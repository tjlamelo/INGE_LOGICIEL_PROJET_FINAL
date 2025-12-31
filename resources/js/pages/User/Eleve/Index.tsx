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
type Eleve = {
    id: number;
    user_id: number;
    matricule: string;
    user_name: string; // Vient de la jointure dans le service
    user_email: string; // Vient de la jointure dans le service
    classe_nom: string | null; // Vient de la jointure dans le service
};

type PaginationLinks = { url: string | null; label: string; active: boolean; };
type PaginatedEleves = { data: Eleve[]; links: PaginationLinks[]; from: number | null; to: number | null; total: number; };
type PageProps = { eleves: PaginatedEleves; flash: { success?: string; error?: string; }; };

export default function EleveIndex() {
    const { eleves, flash } = usePage<PageProps>().props;
    const [showSuccessAlert, setShowSuccessAlert] = React.useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState<boolean>(false);
    const [eleveToDelete, setEleveToDelete] = React.useState<Eleve | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const openDeleteDialog = (eleve: Eleve) => {
        setEleveToDelete(eleve);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (eleveToDelete) {
            router.delete(`/eleves/${eleveToDelete.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Utilisateurs", href: "#" }, { title: "Élèves", href: "/eleves" }]}>
            <Head title="Liste des Élèves" />

            <div className="p-6 space-y-4">
                {showSuccessAlert && <Alert><AlertDescription>{flash.success}</AlertDescription></Alert>}

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Liste des Élèves</h1>
                    <Link href="/eleves/create"><Button>Créer un Élève</Button></Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Tous les élèves</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Nom</th>
                                        <th scope="col" className="px-6 py-3">Email</th>
                                        <th scope="col" className="px-6 py-3">Matricule</th>
                                        <th scope="col" className="px-6 py-3">Classe</th>
                                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eleves.data.map((eleve: Eleve) => (
                                        <tr key={eleve.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{eleve.user_name}</td>
                                            <td className="px-6 py-4">{eleve.user_email}</td>
                                            <td className="px-6 py-4">{eleve.matricule}</td>
                                            <td className="px-6 py-4">{eleve.classe_nom || <span className="text-gray-400">Non assignée</span>}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Link href={`/eleves/${eleve.id}`}><Button variant="outline" size="sm">Voir</Button></Link>
                                                <Link href={`/eleves/${eleve.id}/edit`}><Button variant="outline" size="sm">Modifier</Button></Link>
                                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(eleve)}>Supprimer</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                                            <DialogDescription>
                                                                Cette action ne peut pas être annulée. Cela supprimera définitivement l'élève "{eleveToDelete?.user_name}".
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
                        {eleves.links && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-700">Affichage de {eleves.from || 0} à {eleves.to || 0} sur {eleves.total} résultats</div>
                                <div className="flex space-x-1">
                                    {eleves.links.map((link: PaginationLinks, index: number) => (
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