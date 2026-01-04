import React, { useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// --- Types ---
type Note = {
    id: number;
    valeur: number;
    type_evaluation: string | null;
    eleve_name: string; // Vient de la jointure
    matiere_nom: string; // Vient de la jointure
    classe_nom: string; // Vient de la jointure
    trimestre_nom: string; // Vient de la jointure
    annee_scolaire: string; // Vient de la jointure
};

type PaginationLinks = { url: string | null; label: string; active: boolean; };
type PaginatedNotes = { data: Note[]; links: PaginationLinks[]; from: number | null; to: number | null; total: number; };
type PageProps = { notes: PaginatedNotes; flash: { success?: string; error?: string; }; };

export default function NoteIndex() {
    const { notes, flash } = usePage<PageProps>().props;
    const [showSuccessAlert, setShowSuccessAlert] = React.useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState<boolean>(false);
    const [noteToDelete, setNoteToDelete] = React.useState<Note | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const openDeleteDialog = (note: Note) => {
        setNoteToDelete(note);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (noteToDelete) {
            router.delete(`/notes/${noteToDelete.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Évaluation", href: "#" }, { title: "Notes", href: "/notes" }]}>
            <Head title="Liste des Notes" />

            <div className="p-6 space-y-4">
                {showSuccessAlert && <Alert><AlertDescription>{flash.success}</AlertDescription></Alert>}

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Liste des Notes</h1>
                    <Link href="/notes/create"><Button>Ajouter une Note</Button></Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Toutes les notes</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Élève</th>
                                        <th scope="col" className="px-6 py-3">Matière</th>
                                        <th scope="col" className="px-6 py-3">Classe</th>
                                        <th scope="col" className="px-6 py-3">Trimestre</th>
                                        <th scope="col" className="px-6 py-3">Note</th>
                                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notes.data.map((note: Note) => (
                                        <tr key={note.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{note.eleve_name}</td>
                                            <td className="px-6 py-4">{note.matiere_nom}</td>
                                            <td className="px-6 py-4">{note.classe_nom}</td>
                                            <td className="px-6 py-4">{note.trimestre_nom} ({note.annee_scolaire})</td>
                                            <td className="px-6 py-4 font-semibold">{note.valeur}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Link href={`/notes/${note.id}`}><Button variant="outline" size="sm">Voir</Button></Link>
                                                <Link href={`/notes/${note.id}/edit`}><Button variant="outline" size="sm">Modifier</Button></Link>
                                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(note)}>Supprimer</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                                            <DialogDescription>
                                                                Cette action ne peut pas être annulée. Elle supprimera définitivement la note de {note.valeur} pour "{noteToDelete?.eleve_name}".
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
                                                            <Button type="button" variant="destructive" onClick={handleDelete}>Supprimer</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        {notes.links && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-700">Affichage de {notes.from || 0} à {notes.to || 0} sur {notes.total} résultats</div>
                                <div className="flex space-x-1">
                                    {notes.links.map((link: PaginationLinks, index: number) => (
                                        link.url ? (
                                            <Link key={index} href={link.url} className={`px-3 py-2 text-sm leading-tight border rounded ${link.active ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ) : (
                                            <span key={index} className="px-3 py-2 text-sm leading-tight text-gray-500 border border-gray-300 rounded cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}