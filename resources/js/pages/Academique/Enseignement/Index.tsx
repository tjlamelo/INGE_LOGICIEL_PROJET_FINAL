import React, { useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Users, BookOpen, Award, TrendingUp, Plus, AlertTriangle } from "lucide-react";

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

type EnseignementStats = {
    total_enseignements: number;
    total_enseignants?: number;
    total_classes: number;
    total_matieres: number;
    average_coefficient: number;
    enseignements_by_class: Array<{ classe_nom: string; count: number; avg_coefficient: number }>;
    enseignements_by_subject: Array<{ matiere_nom: string; count: number; avg_coefficient: number }>;
    enseignements_by_teacher?: Array<{ enseignant_name: string; count: number; avg_coefficient: number }>;
    highest_coefficient_subject: string | null;
    lowest_coefficient_subject: string | null;
};

type PageProps = { 
    enseignements: PaginatedEnseignements; 
    stats: EnseignementStats;
    is_teacher: boolean;
    flash: { success?: string; error?: string; }; 
};

export default function EnseignementIndex() {
    const { enseignements, stats, is_teacher, flash } = usePage<PageProps>().props;
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

    const getCoefficientBadgeVariant = (coefficient: number) => {
        if (coefficient >= 5) return "destructive";
        if (coefficient >= 3) return "default";
        return "secondary";
    };

    // Vérifier si l'enseignant n'a aucun enseignement
    const hasNoEnseignements = is_teacher && stats.total_enseignements === 0;

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Enseignements", href: "/enseignements" }]}>
            <Head title="Liste des Enseignements" />

            <div className="p-6 space-y-6">
                {showSuccessAlert && <Alert><AlertDescription>{flash.success}</AlertDescription></Alert>}

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {is_teacher ? "Mes Enseignements" : "Liste des Enseignements"}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {is_teacher ? "Gérez vos enseignements" : "Gérez tous les enseignements"}
                        </p>
                    </div>
                    <Link href="/enseignements/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Créer un Enseignement
                        </Button>
                    </Link>
                </div>

                {/* Message pour les enseignants sans enseignement */}
                {hasNoEnseignements && (
                    <Alert className="border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Vous n'avez actuellement aucun enseignement assigné. Veuillez contacter l'administrateur pour vous assigner des classes et des matières.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Afficher les statistiques seulement si l'enseignant a des enseignements */}
                {!hasNoEnseignements && (
                    <>
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Enseignements</CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total_enseignements}</div>
                                </CardContent>
                            </Card>
                            {is_teacher ? (
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                                        <Award className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.total_classes}</div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Enseignants</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.total_enseignants}</div>
                                    </CardContent>
                                </Card>
                            )}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Matières</CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total_matieres}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Moyenne Coefficient</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.average_coefficient.toFixed(2)}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Enseignements by Class */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Enseignements par Classe</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats.enseignements_by_class.slice(0, 5).map((item) => (
                                            <div key={item.classe_nom} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline">{item.classe_nom}</Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {item.count} enseignement{item.count > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium">Coeff. moyen: {item.avg_coefficient.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {stats.enseignements_by_class.length === 0 && (
                                            <p className="text-sm text-muted-foreground">Aucune classe trouvée</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Enseignements by Subject */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Enseignements par Matière</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats.enseignements_by_subject.slice(0, 5).map((item) => (
                                            <div key={item.matiere_nom} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline">{item.matiere_nom}</Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {item.count} enseignement{item.count > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium">Coeff. moyen: {item.avg_coefficient.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {stats.enseignements_by_subject.length === 0 && (
                                            <p className="text-sm text-muted-foreground">Aucune matière trouvée</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Coefficient Extremes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Coefficients Extrêmes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Plus élevé:</span>
                                        <Badge variant="destructive">
                                            {stats.highest_coefficient_subject || 'N/A'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Plus bas:</span>
                                        <Badge variant="secondary">
                                            {stats.lowest_coefficient_subject || 'N/A'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Tableau des enseignements - Afficher même s'il n'y en a pas */}
                <Card>
                    <CardHeader>
                        <CardTitle>{is_teacher ? "Mes enseignements" : "Tous les enseignements"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {hasNoEnseignements ? (
                            <div className="text-center py-8">
                                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun enseignement assigné</h3>
                                <p className="text-gray-500 mb-4">
                                    Vous n'avez actuellement aucun enseignement assigné. Veuillez contacter l'administrateur pour vous assigner des classes et des matières.
                                </p>
                                <Link href="/enseignements/create">
                                    <Button variant="outline">Demander un enseignement</Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="relative overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                {!is_teacher && <th scope="col" className="px-6 py-3">Enseignant</th>}
                                                <th scope="col" className="px-6 py-3">Classe</th>
                                                <th scope="col" className="px-6 py-3">Matière</th>
                                                <th scope="col" className="px-6 py-3">Coefficient</th>
                                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {enseignements.data.map((enseignement: Enseignement) => (
                                                <tr key={enseignement.id} className="bg-white border-b hover:bg-gray-50">
                                                    {!is_teacher && <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{enseignement.enseignant_name}</td>}
                                                    <td className="px-6 py-4">{enseignement.classe_nom}</td>
                                                    <td className="px-6 py-4">{enseignement.matiere_nom}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant={getCoefficientBadgeVariant(enseignement.coefficient)}>
                                                            {enseignement.coefficient}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <Link href={`/enseignements/${enseignement.id}`}>
                                                            <Button variant="outline" size="sm">Voir</Button>
                                                        </Link>
                                                        <Link href={`/enseignements/${enseignement.id}/edit`}>
                                                            <Button variant="outline" size="sm">Modifier</Button>
                                                        </Link>
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
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}