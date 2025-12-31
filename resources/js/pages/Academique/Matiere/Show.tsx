import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type Matiere = { id: number; nom: string; code: string; created_at: string; updated_at: string; };
type ShowProps = { matiere: Matiere; };

export default function MatiereShow({ matiere }: ShowProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        // CORRIGÉ : URL en dur pour la suppression
        router.delete(`/matieres/${matiere.id}`, {
            onSuccess: () => setIsDeleteDialogOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Matières", href: "/matieres" }, { title: matiere.nom, href: `/matieres/${matiere.id}` }]}>
            <Head title={`Détails de ${matiere.nom}`} />

            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Détails de la matière
                            <div className="space-x-2">
                                {/* CORRIGÉ : URL en dur pour le lien d'édition */}
                                <Link href={`/matieres/${matiere.id}/edit`}><Button variant="outline">Modifier</Button></Link>
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive">Supprimer</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                            <DialogDescription>
                                                Cette action ne peut pas être annulée. Cela supprimera définitivement la matière "{matiere.nom}".
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
                                            <Button type="button" variant="destructive" onClick={handleDelete}>Supprimer</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div><h3 className="font-semibold text-gray-700">ID</h3><p className="text-gray-900">{matiere.id}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Nom</h3><p className="text-gray-900">{matiere.nom}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Code</h3><Badge variant="secondary">{matiere.code}</Badge></div>
                        <div><h3 className="font-semibold text-gray-700">Date de création</h3><p className="text-gray-900">{new Date(matiere.created_at).toLocaleString()}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Dernière mise à jour</h3><p className="text-gray-900">{new Date(matiere.updated_at).toLocaleString()}</p></div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}