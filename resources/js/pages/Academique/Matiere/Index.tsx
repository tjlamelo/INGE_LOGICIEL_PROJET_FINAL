import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';

// --- Les types TypeScript restent les mêmes ---
type Matiere = {
    id: number;
    nom: string;
    code: string;
    created_at: string;
    updated_at: string;
};
type PaginationLinks = { url: string | null; label: string; active: boolean };
type PaginatedMatieres = {
    data: Matiere[];
    links: PaginationLinks[];
    from: number | null;
    to: number | null;
    total: number;
};
type PageProps = {
    matieres: PaginatedMatieres;
    flash: { success?: string; error?: string };
};

export default function MatiereIndex() {
    const { matieres, flash = {} } = usePage<PageProps>().props;

    const [showSuccessAlert, setShowSuccessAlert] =
        React.useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
        React.useState<boolean>(false);
    const [matiereToDelete, setMatiereToDelete] =
        React.useState<Matiere | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);
    const openDeleteDialog = (matiere: Matiere) => {
        setMatiereToDelete(matiere);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (matiereToDelete) {
            // CORRIGÉ : URL en dur pour la suppression
            router.delete(`/matieres/${matiereToDelete.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Académique', href: '#' },
                { title: 'Matières', href: '/matieres' },
            ]}
        >
            <Head title="Liste des Matières" />

            <div className="space-y-4 p-6">
                {showSuccessAlert && (
                    <Alert>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Liste des Matières
                    </h1>
                    {/* CORRIGÉ : URL en dur pour le lien de création */}
                    <Link href="/matieres/create">
                        <Button>Créer une Matière</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Toutes les matières</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Nom
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Code
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matieres.data.map((matiere: Matiere) => (
                                        <tr
                                            key={matiere.id}
                                            className="border-b bg-white hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900">
                                                {matiere.nom}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary">
                                                    {matiere.code}
                                                </Badge>
                                            </td>
                                            <td className="space-x-2 px-6 py-4 text-right">
                                                {/* CORRIGÉ : URL en dur pour le lien de visualisation */}
                                                <Link
                                                    href={`/matieres/${matiere.id}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Voir
                                                    </Button>
                                                </Link>
                                                {/* CORRIGÉ : URL en dur pour le lien d'édition */}
                                                <Link
                                                    href={`/matieres/${matiere.id}/edit`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Modifier
                                                    </Button>
                                                </Link>
                                                <Dialog
                                                    open={isDeleteDialogOpen}
                                                    onOpenChange={
                                                        setIsDeleteDialogOpen
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                openDeleteDialog(
                                                                    matiere,
                                                                )
                                                            }
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Êtes-vous
                                                                absolument sûr ?
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Cette action ne
                                                                peut pas être
                                                                annulée. Cela
                                                                supprimera
                                                                définitivement
                                                                la matière "
                                                                {
                                                                    matiereToDelete?.nom
                                                                }
                                                                ".
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    setIsDeleteDialogOpen(
                                                                        false,
                                                                    )
                                                                }
                                                            >
                                                                Annuler
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                onClick={
                                                                    handleDelete
                                                                }
                                                            >
                                                                Supprimer
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* La pagination utilise déjà `link.url`, donc aucun changement n'est nécessaire ici */}
                        {matieres.links && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Affichage de {matieres.from || 0} à{' '}
                                    {matieres.to || 0} sur {matieres.total}{' '}
                                    résultats
                                </div>
                                <div className="flex space-x-1">
                                    {matieres.links.map(
                                        (
                                            link: PaginationLinks,
                                            index: number,
                                        ) =>
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`rounded border px-3 py-2 text-sm leading-tight ${link.active ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="cursor-not-allowed rounded border border-gray-300 px-3 py-2 text-sm leading-tight text-gray-500"
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ),
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
