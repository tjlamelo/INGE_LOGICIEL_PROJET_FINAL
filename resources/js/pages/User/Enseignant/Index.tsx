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
type Enseignant = {
    id: number;
    user_id: number;
    matricule: string;
    telephone: string | null;
    user_name: string; // Vient de la jointure dans le service
    user_email: string; // Vient de la jointure dans le service
};

type PaginationLinks = { url: string | null; label: string; active: boolean; };
type PaginatedEnseignants = { data: Enseignant[]; links: PaginationLinks[]; from: number | null; to: number | null; total: number; };
type PageProps = { enseignants: PaginatedEnseignants; flash: { success?: string; error?: string; }; };

export default function EnseignantIndex() {
    const { enseignants, flash } = usePage<PageProps>().props;
    const [showSuccessAlert, setShowSuccessAlert] = React.useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState<boolean>(false);
    const [enseignantToDelete, setEnseignantToDelete] = React.useState<Enseignant | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const openDeleteDialog = (enseignant: Enseignant) => {
        setEnseignantToDelete(enseignant);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (enseignantToDelete) {
            router.delete(`/enseignants/${enseignantToDelete.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Utilisateurs", href: "#" }, { title: "Enseignants", href: "/enseignants" }]}>
            <Head title="Liste des Enseignants" />

            <div className="p-6 space-y-4">
                {showSuccessAlert && <Alert><AlertDescription>{flash.success}</AlertDescription></Alert>}

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Liste des Enseignants</h1>
                    <Link href="/enseignants/create"><Button>Créer un Enseignant</Button></Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Tous les enseignants</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Nom</th>
                                        <th scope="col" className="px-6 py-3">Email</th>
                                        <th scope="col" className="px-6 py-3">Matricule</th>
                                        <th scope="col" className="px-6 py-3">Téléphone</th>
                                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enseignants.data.map((enseignant: Enseignant) => (
                                        <tr key={enseignant.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{enseignant.user_name}</td>
                                            <td className="px-6 py-4">{enseignant.user_email}</td>
                                            <td className="px-6 py-4">{enseignant.matricule}</td>
                                            <td className="px-6 py-4">{enseignant.telephone || <span className="text-gray-400">Non spécifié</span>}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Link href={`/enseignants/${enseignant.id}`}><Button variant="outline" size="sm">Voir</Button></Link>
                                                <Link href={`/enseignants/${enseignant.id}/edit`}><Button variant="outline" size="sm">Modifier</Button></Link>
                                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(enseignant)}>Supprimer</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                                            <DialogDescription>
                                                                Cette action ne peut pas être annulée. Cela supprimera définitivement l'enseignant "{enseignantToDelete?.user_name}".
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
                        {enseignants.links && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-700">Affichage de {enseignants.from || 0} à {enseignants.to || 0} sur {enseignants.total} résultats</div>
                                <div className="flex space-x-1">
                                    {enseignants.links.map((link: PaginationLinks, index: number) => (
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