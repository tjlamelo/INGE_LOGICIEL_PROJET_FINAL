import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
type Trimestre = { id: number; nom: string; annee_scolaire: string; created_at: string; updated_at: string; };
type ShowProps = { trimestre: Trimestre; };

export default function TrimestreShow({ trimestre }: ShowProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/trimestres/${trimestre.id}`, {
            onSuccess: () => setIsDeleteDialogOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Trimestres", href: "/trimestres" }, { title: trimestre.nom, href: `/trimestres/${trimestre.id}` }]}>
            <Head title={`Détails de ${trimestre.nom}`} />
            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Détails du trimestre
                            <div className="space-x-2">
                                <Link href={`/trimestres/${trimestre.id}/edit`}><Button variant="outline">Modifier</Button></Link>
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger asChild><Button variant="destructive">Supprimer</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                            <DialogDescription>Cette action ne peut pas être annulée. Cela supprimera définitivement le trimestre "{trimestre.nom}".</DialogDescription>
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
                        <div><h3 className="font-semibold text-gray-700">ID</h3><p className="text-gray-900">{trimestre.id}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Nom</h3><p className="text-gray-900">{trimestre.nom}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Année Scolaire</h3><p className="text-gray-900">{trimestre.annee_scolaire}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Date de création</h3><p className="text-gray-900">{new Date(trimestre.created_at).toLocaleString()}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Dernière mise à jour</h3><p className="text-gray-900">{new Date(trimestre.updated_at).toLocaleString()}</p></div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}