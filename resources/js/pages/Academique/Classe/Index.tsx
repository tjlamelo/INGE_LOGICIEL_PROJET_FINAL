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
import { Users, BookOpen, GraduationCap, TrendingUp, Plus } from "lucide-react";

// --- Types ---
type Classe = {
    id: number;
    nom: string;
    niveau: string;
    filiere: string | null;
    eleves_count?: number;
    created_at: string;
    updated_at: string;
};

type PaginationLinks = { url: string | null; label: string; active: boolean; };
type PaginatedClasses = { data: Classe[]; links: PaginationLinks[]; from: number | null; to: number | null; total: number; };
type ClasseStats = {
    total_classes: number;
    total_students: number;
    average_students_per_class: number;
    classes_by_level: Array<{ niveau: string; count: number; students_count: number }>;
    classes_by_filiere: Array<{ filiere: string; count: number; students_count: number }>;
    most_populated_class: Classe | null;
    least_populated_class: Classe | null;
};

type PageProps = { 
    classes: PaginatedClasses; 
    stats: ClasseStats;
    flash: { success?: string; error?: string; }; 
};

export default function ClasseIndex() {
    const { classes, stats, flash } = usePage<PageProps>().props;
    const [showSuccessAlert, setShowSuccessAlert] = React.useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState<boolean>(false);
    const [classeToDelete, setClasseToDelete] = React.useState<Classe | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const openDeleteDialog = (classe: Classe) => {
        setClasseToDelete(classe);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (classeToDelete) {
            router.delete(`/classes/${classeToDelete.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Classes", href: "/classes" }]}>
            <Head title="Liste des Classes" />

            <div className="p-6 space-y-6">
                {showSuccessAlert && <Alert><AlertDescription>{flash.success}</AlertDescription></Alert>}

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Liste des Classes</h1>
                    <Link href="/classes/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Créer une Classe
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_classes}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Élèves</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_students}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Moyenne/Classe</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.average_students_per_class.toFixed(1)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Classe la + remplie</CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">
                                {stats.most_populated_class ? 
                                    `${stats.most_populated_class.nom} (${stats.most_populated_class.eleves_count})` : 
                                    'N/A'
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Classes by Level */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Classes par Niveau</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.classes_by_level.map((level) => (
                                    <div key={level.niveau} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline">{level.niveau}</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {level.count} classe{level.count > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">{level.students_count}</span>
                                            <span className="text-sm text-muted-foreground">élèves</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Classes by Filiere */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Classes par Filière</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.classes_by_filiere.map((filiere) => (
                                    <div key={filiere.filiere} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline">{filiere.filiere}</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {filiere.count} classe{filiere.count > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">{filiere.students_count}</span>
                                            <span className="text-sm text-muted-foreground">élèves</span>
                                        </div>
                                    </div>
                                ))}
                                {stats.classes_by_filiere.length === 0 && (
                                    <p className="text-sm text-muted-foreground">Aucune filière spécifiée</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader><CardTitle>Toutes les classes</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Nom</th>
                                        <th scope="col" className="px-6 py-3">Niveau</th>
                                        <th scope="col" className="px-6 py-3">Filière</th>
                                        <th scope="col" className="px-6 py-3">Élèves</th>
                                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.data.map((classe: Classe) => (
                                        <tr key={classe.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{classe.nom}</td>
                                            <td className="px-6 py-4">{classe.niveau}</td>
                                            <td className="px-6 py-4">{classe.filiere || <span className="text-gray-400">Non spécifiée</span>}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={classe.eleves_count && classe.eleves_count > 30 ? "destructive" : "secondary"}>
                                                    {classe.eleves_count || 0} élève{classe.eleves_count && classe.eleves_count > 1 ? 's' : ''}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Link href={`/classes/${classe.id}`}>
                                                    <Button variant="outline" size="sm">Voir</Button>
                                                </Link>
                                                <Link href={`/classes/${classe.id}/edit`}>
                                                    <Button variant="outline" size="sm">Modifier</Button>
                                                </Link>
                                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(classe)}>Supprimer</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                                            <DialogDescription>
                                                                Cette action ne peut pas être annulée. Cela supprimera définitivement la classe "{classeToDelete?.nom}".
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
                        {classes.links && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-700">Affichage de {classes.from || 0} à {classes.to || 0} sur {classes.total} résultats</div>
                                <div className="flex space-x-1">
                                    {classes.links.map((link: PaginationLinks, index: number) => (
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