import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Download, FileText, Trash2, Eye, Edit } from 'lucide-react'; // Ajout des icônes

// --- Types ---
type Bulletin = {
    id: number;
    moyenne_generale: number;
    rang: number;
    effectif_classe: number;
    appreciation_generale: string | null;
    est_valide: boolean;
    date_generation: string;
    eleve: {
        id: number;
        user: { name: string };
    };
    trimestre: {
        id: number;
        nom: string;
        annee_scolaire: string;
    };
};

type Classe = {
    id: number;
    nom: string;
};

type Trimestre = {
    id: number;
    nom: string;
    annee_scolaire: string;
};

type PaginationLinks = { url: string | null; label: string; active: boolean };
type PaginatedBulletins = {
    data: Bulletin[];
    links: PaginationLinks[];
    from: number | null;
    to: number | null;
    total: number;
};

type PageProps = {
    bulletins: PaginatedBulletins;
    filters: {
        trimestre_id?: string;
        classe_id?: string;
    };
    trimestres: Trimestre[];
    classes: Classe[];
    flash: { success?: string; error?: string };
};

export default function BulletinIndex({ bulletins, filters, trimestres, classes }: PageProps) {
    const { flash } = usePage<PageProps>().props;
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [bulletinToDelete, setBulletinToDelete] = useState<Bulletin | null>(null);

    // Gestion des alertes
    React.useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const [filterValues, setFilterValues] = useState({
        trimestre_id: filters.trimestre_id || '',
        classe_id: filters.classe_id || '',
    });

    const handleFilterChange = (name: string, value: string) => {
        setFilterValues(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        router.get('/bulletins', filterValues, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setFilterValues({ trimestre_id: '', classe_id: '' });
        router.get('/bulletins', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Pattern identique à votre exemple de suppression
    const openDeleteDialog = (bulletin: Bulletin) => {
        setBulletinToDelete(bulletin);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (bulletinToDelete) {
            router.delete(`/bulletins/${bulletinToDelete.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false),
                preserveScroll: true,
            });
        }
    };

    // Vérifier si les filtres nécessaires pour le téléchargement en masse sont appliqués
    const canBulkDownload = filterValues.classe_id && filterValues.trimestre_id;

    // Obtenir les noms de classe et de trimestre pour l'affichage
    const selectedClasseName = classes.find(c => c.id.toString() === filterValues.classe_id)?.nom || '';
    const selectedTrimestreName = trimestres.find(t => t.id.toString() === filterValues.trimestre_id)?.nom || '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Évaluation', href: '#' },
                { title: 'Bulletins', href: '/bulletins' },
            ]}
        >
            <Head title="Gestion des Bulletins" />

            <div className="space-y-4 p-6">
                {/* Alert de succès */}
                {showSuccessAlert && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                        {flash.success}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Gestion des Bulletins
                        </h1>
                        <p className="text-sm text-gray-500">
                            Consultez et gérez les bulletins des élèves.
                        </p>
                    </div>
                    
                    <div className="flex space-x-2">
                        {/* Bouton de téléchargement en masse - visible seulement si des filtres sont appliqués */}
                        {canBulkDownload && (
                        <a
  href={`/bulletins/bulk-download/${filterValues.classe_id}/${filterValues.trimestre_id}`}
  className="inline-flex items-center justify-center rounded-md text-sm font-medium
             ring-offset-background transition-colors focus-visible:outline-none
             focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
             border border-input bg-background hover:bg-accent hover:text-accent-foreground
             h-10 px-4 py-2"
>
  <Download className="h-4 w-4 mr-2" />
  Télécharger en masse
</a>

                        )}
                        
                        <Link href="/bulletins/create">
                            <Button>Générer des bulletins</Button>
                        </Link>
                    </div>
                </div>

                {/* Filtres */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtres</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="trimestre_id">Trimestre</Label>
                                <Select
                                    value={filterValues.trimestre_id}
                                    onValueChange={(value) => handleFilterChange('trimestre_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un trimestre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {trimestres.map(trimestre => (
                                            <SelectItem key={trimestre.id} value={trimestre.id.toString()}>
                                                {trimestre.nom} ({trimestre.annee_scolaire})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="classe_id">Classe</Label>
                                <Select
                                    value={filterValues.classe_id}
                                    onValueChange={(value) => handleFilterChange('classe_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une classe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(classe => (
                                            <SelectItem key={classe.id} value={classe.id.toString()}>
                                                {classe.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end space-x-2">
                                <Button onClick={applyFilters}>Appliquer</Button>
                                <Button variant="outline" onClick={resetFilters}>Réinitialiser</Button>
                            </div>
                        </div>
                        
                        {/* Indicateur de téléchargement disponible */}
                        {canBulkDownload && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-sm text-blue-700">
                                    Vous pouvez maintenant télécharger tous les bulletins pour <strong>{selectedClasseName}</strong> au <strong>{selectedTrimestreName}</strong>.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="relative overflow-x-auto rounded-lg border">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-gray-50 text-xs text-gray-700 uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Élève</th>
                                        <th className="px-6 py-3">Trimestre</th>
                                        <th className="px-6 py-3 text-center">Moyenne</th>
                                        <th className="px-6 py-3 text-center">Rang</th>
                                        <th className="px-6 py-3">Statut</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bulletins.data.map((bulletin) => (
                                        <tr
                                            key={bulletin.id}
                                            className="border-b bg-white hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {bulletin.eleve.user.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {bulletin.trimestre.nom}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`rounded px-2 py-1 font-bold ${bulletin.moyenne_generale < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                                                >
                                                    {bulletin.moyenne_generale}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {bulletin.rang}/{bulletin.effectif_classe}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded px-2 py-1 text-xs ${bulletin.est_valide ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                                >
                                                    {bulletin.est_valide ? 'Validé' : 'En attente'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(bulletin.date_generation).toLocaleDateString()}
                                            </td>
                                            <td className="space-x-1 px-6 py-4 text-right">
                                                <Link
                                                    href={`/bulletins/${bulletin.eleve.id}/${bulletin.trimestre.id}`}
                                                    title="Voir le bulletin"
                                                >
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/bulletins/${bulletin.id}/edit`}
                                                    title="Modifier le bulletin"
                                                >
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/bulletins/${bulletin.eleve.id}/${bulletin.trimestre.id}/pdf`}
                                                    title="Télécharger le PDF"
                                                >
                                                    <Button variant="ghost" size="sm">
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => openDeleteDialog(bulletin)}
                                                    title="Supprimer le bulletin"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {bulletins.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-10 text-center text-gray-500"
                                            >
                                                Aucun bulletin trouvé.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {bulletins.links && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Affichage de {bulletins.from || 0} à{' '}
                                    {bulletins.to || 0} sur {bulletins.total} résultats
                                </div>
                                <div className="flex space-x-1">
                                    {bulletins.links.map(
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

                {/* Dialog de suppression - Pattern identique à votre exemple */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                            <DialogDescription>
                                Cette action ne peut pas être annulée. Elle supprimera définitivement le bulletin de {bulletinToDelete?.eleve.user.name} pour le {bulletinToDelete?.trimestre.nom}.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="button" variant="destructive" onClick={handleDelete}>
                                Supprimer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}