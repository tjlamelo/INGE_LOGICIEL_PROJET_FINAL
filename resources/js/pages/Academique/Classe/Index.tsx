import React, { useEffect, useState } from "react";
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
type Classe = {
    id: number;
    nom: string;
    niveau: string;
    filiere: string | null;
    created_at: string;
    updated_at: string;
};

type PaginationLinks = { url: string | null; label: string; active: boolean };
type PaginatedClasses = { data: Classe[]; links: PaginationLinks[]; from: number | null; to: number | null; total: number };
type PageProps = { classes: PaginatedClasses; flash: { success?: string; error?: string } };

export default function ClasseIndex() {
    const { classes, flash } = usePage<PageProps>().props;
    const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(!!flash?.success);

useEffect(() => {
    if (!flash?.success) return;

    const timer = setTimeout(() => {
        setShowSuccessAlert(false);
    }, 3000);

    return () => clearTimeout(timer);
}, [flash?.success]);


    // --- Suppression ---
    const handleDelete = (id: number) => {
        router.delete(`/classes/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Classes", href: "/classes" }]}>
            <Head title="Liste des Classes" />

            <div className="p-6 space-y-4">
                {showSuccessAlert && <Alert><AlertDescription>{flash.success}</AlertDescription></Alert>}

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Liste des Classes</h1>
                    <Link href="/classes/create">
                        <Button>Créer une Classe</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Toutes les classes</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Nom</th>
                                        <th className="px-6 py-3">Niveau</th>
                                        <th className="px-6 py-3">Filière</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.data.map((classe) => (
                                        <tr key={classe.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{classe.nom}</td>
                                            <td className="px-6 py-4">{classe.niveau}</td>
                                            <td className="px-6 py-4">{classe.filiere || <span className="text-gray-400">Non spécifiée</span>}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Link href={`/classes/${classe.id}`}><Button variant="outline" size="sm">Voir</Button></Link>
                                                <Link href={`/classes/${classe.id}/edit`}><Button variant="outline" size="sm">Modifier</Button></Link>

                                                {/* Dialog par ligne */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive" size="sm">Supprimer</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Êtes-vous sûr ?</DialogTitle>
                                                            <DialogDescription>
                                                                Cette action supprimera définitivement la classe "{classe.nom}".
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => {}}>Annuler</Button>
                                                            <Button variant="destructive" onClick={() => handleDelete(classe.id)}>Supprimer</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </td>
                                        </tr>
                                    ))}
                                    {classes.data.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-4">Aucune classe enregistrée</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {classes.links && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-700">
                                    Affichage de {classes.from || 0} à {classes.to || 0} sur {classes.total} résultats
                                </div>
                                <div className="flex space-x-1">
                                    {classes.links.map((link, idx) =>
                                        link.url ? (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm border rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={idx}
                                                className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
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
