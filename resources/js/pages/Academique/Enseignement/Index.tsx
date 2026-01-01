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
type Enseignement = {
    id: number;
    enseignant_name: string; // Vient de la jointure dans le service
    classe_nom: string;      // Vient de la jointure
    matiere_nom: string;     // Vient de la jointure
    coefficient: number;
};

type PaginationLinks = { url: string | null; label: string; active: boolean; };
type PaginatedEnseignements = { data: Enseignement[]; links: PaginationLinks[]; from: number | null; to: number | null; total: number; };
type PageProps = { enseignements: PaginatedEnseignements; flash: { success?: string; error?: string; }; };

export default function EnseignementIndex() {
    const { enseignements, flash } = usePage<PageProps>().props;
    const [showSuccessAlert, setShowSuccessAlert] = React.useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState<boolean>(false);
    const [enseignementToDelete, setEnseignementToDelete] = React.useState<Enseignement | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const openDeleteDialog = (enseignement: Enseignement) => {
        setEnseignementToDelete(enseignement);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (enseignementToDelete) {
            router.delete(`/enseignements/${enseignementToDelete.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Enseignements", href: "/enseignements" }]}>
            <Head title="Liste des Enseignements" />

            <div className="p-6 space-y-4">
                {showSuccessAlert && <Alert><AlertDescription>{flash.success}</AlertDescription></Alert>}

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Liste des Enseignements</h1>
                    <Link href="/enseignements/create"><Button>Créer un Enseignement</Button></Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Tous les enseignements</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Enseignant</th>
                                        <th scope="col" className="px-6 py-3">Classe</th>
                                        <th scope="col" className="px-6 py-3">Matière</th>
                                        <th scope="col" className="px-6 py-3">Coefficient</th>
                                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enseignements.data.map((enseignement: Enseignement) => (
                                        <tr key={enseignement.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{enseignement.enseignant_name}</td>
                                            <td className="px-6 py-4">{enseignement.classe_nom}</td>
                                            <td className="px-6 py-4">{enseignement.matiere_nom}</td>
                                            <td className="px-6 py-4">{enseignement.coefficient}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Link href={`/enseignements/${enseignement.id}`}><Button variant="outline" size="sm">Voir</Button></Link>
                                                <Link href={`/enseignements/${enseignement.id}/edit`}><Button variant="outline" size="sm">Modifier</Button></Link>
                                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(enseignement)}>Supprimer</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                                            <DialogDescription>
                                                                Cette action ne peut pas être annulée. Elle supprimera l'assignation de "{enseignementToDelete?.matiere_nom}" par "{enseignementToDelete?.enseignant_name}" pour la classe "{enseignementToDelete?.classe_nom}".
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
                        {enseignements.links && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-700">Affichage de {enseignements.from || 0} à {enseignements.to || 0} sur {enseignements.total} résultats</div>
                                <div className="flex space-x-1">
                                    {enseignements.links.map((link: PaginationLinks, index: number) => (
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