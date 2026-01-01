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
type User = { id: number; name: string; email: string; } | null;
type Enseignant = {
    id: number;
    matricule: string;
    telephone: string | null;
    adresse: string | null;
    user: User;
};
type ShowProps = { enseignant: Enseignant; };

export default function EnseignantShow({ enseignant }: ShowProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/enseignants/${enseignant.id}`, {
            onSuccess: () => setIsDeleteDialogOpen(false),
        });
    };
    
    const userName = enseignant.user?.name || "Utilisateur inconnu";
    const userEmail = enseignant.user?.email || "Email inconnu";

    return (
        <AppLayout breadcrumbs={[{ title: "Utilisateurs", href: "#" }, { title: "Enseignants", href: "/enseignants" }, { title: userName, href: `/enseignants/${enseignant.id}` }]}>
            <Head title={`Détails de ${userName}`} />
            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Détails de l'enseignant
                            <div className="space-x-2">
                                <Link href={`/enseignants/${enseignant.id}/edit`}><Button variant="outline">Modifier</Button></Link>
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger asChild><Button variant="destructive">Supprimer</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                            <DialogDescription>Cette action ne peut pas être annulée. Cela supprimera définitivement l'enseignant "{userName}".</DialogDescription>
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
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><h3 className="font-semibold text-gray-700">Nom</h3><p className="text-gray-900">{userName}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Email</h3><p className="text-gray-900">{userEmail}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Matricule</h3><p className="text-gray-900">{enseignant.matricule}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Téléphone</h3><p className="text-gray-900">{enseignant.telephone || <span className="text-gray-400">Non spécifié</span>}</p></div>
                        <div className="md:col-span-2"><h3 className="font-semibold text-gray-700">Adresse</h3><p className="text-gray-900 whitespace-pre-wrap">{enseignant.adresse || <span className="text-gray-400">Non spécifiée</span>}</p></div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}