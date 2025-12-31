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

type Classe = { id: number; nom: string; niveau: string; filiere: string | null; created_at: string; updated_at: string; };
type ShowProps = { classe: Classe; };

export default function ClasseShow({ classe }: ShowProps) {
     console.log('Props reçues dans ClasseShow :', classe);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/classes/${classe.id}`, {
            onSuccess: () => setIsDeleteDialogOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Classes", href: "/classes" }, { title: classe.nom, href: `/classes/${classe.id}` }]}>
            <Head title={`Détails de ${classe.nom}`} />
            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Détails de la classe
                            <div className="space-x-2">
                                <Link href={`/classes/${classe.id}/edit`}><Button variant="outline">Modifier</Button></Link>
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger asChild><Button variant="destructive">Supprimer</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                            <DialogDescription>Cette action ne peut pas être annulée. Cela supprimera définitivement la classe "{classe.nom}".</DialogDescription>
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
                        <div><h3 className="font-semibold text-gray-700">ID</h3><p className="text-gray-900">{classe.id}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Nom</h3><p className="text-gray-900">{classe.nom}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Niveau</h3><p className="text-gray-900">{classe.niveau}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Filière</h3><p className="text-gray-900">{classe.filiere || <span className="text-gray-400">Non spécifiée</span>}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Date de création</h3><p className="text-gray-900">{new Date(classe.created_at).toLocaleString()}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Dernière mise à jour</h3><p className="text-gray-900">{new Date(classe.updated_at).toLocaleString()}</p></div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}