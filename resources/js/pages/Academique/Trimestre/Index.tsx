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
type Trimestre = {
    id: number;
    nom: string;
    annee_scolaire: string;
};

type PaginationLinks = { url: string | null; label: string; active: boolean; };
type PaginatedTrimestres = { data: Trimestre[]; links: PaginationLinks[]; from: number | null; to: number | null; total: number; };
type PageProps = { trimestres: PaginatedTrimestres; flash: { success?: string; error?: string; }; };

export default function TrimestreIndex() {
    const { trimestres, flash } = usePage<PageProps>().props;
    const [showSuccessAlert, setShowSuccessAlert] = React.useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState<boolean>(false);
    const [trimestreToDelete, setTrimestreToDelete] = React.useState<Trimestre | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const openDeleteDialog = (trimestre: Trimestre) => {
        setTrimestreToDelete(trimestre);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (trimestreToDelete) {
            router.delete(`/trimestres/${trimestreToDelete.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Trimestres", href: "/trimestres" }]}>
            <Head title="Liste des Trimestres" />

            <div className="p-6 space-y-4">
                {showSuccessAlert && <Alert><AlertDescription>{flash.success}</AlertDescription></Alert>}

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Liste des Trimestres</h1>
                    <Link href="/trimestres/create"><Button>Créer un Trimestre</Button></Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Tous les trimestres</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Nom</th>
                                        <th scope="col" className="px-6 py-3">Année Scolaire</th>
                                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trimestres.data.map((trimestre: Trimestre) => (
                                        <tr key={trimestre.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{trimestre.nom}</td>
                                            <td className="px-6 py-4">{trimestre.annee_scolaire}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Link href={`/trimestres/${trimestre.id}`}><Button variant="outline" size="sm">Voir</Button></Link>
                                                <Link href={`/trimestres/${trimestre.id}/edit`}><Button variant="outline" size="sm">Modifier</Button></Link>
                                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(trimestre)}>Supprimer</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                                            <DialogDescription>
                                                                Cette action ne peut pas être annulée. Cela supprimera définitivement le trimestre "{trimestreToDelete?.nom}".
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
                        {trimestres.links && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-700">Affichage de {trimestres.from || 0} à {trimestres.to || 0} sur {trimestres.total} résultats</div>
                                <div className="flex space-x-1">
                                    {trimestres.links.map((link: PaginationLinks, index: number) => (
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