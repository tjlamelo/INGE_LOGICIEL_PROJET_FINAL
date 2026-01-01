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
type Enseignant = { id: number; user: User; };
type Classe = { id: number; nom: string; } | null;
type Matiere = { id: number; nom: string; } | null;
type Enseignement = {
    id: number;
    coefficient: number;
    enseignant: Enseignant;
    classe: Classe;
    matiere: Matiere;
};
type ShowProps = { enseignement: Enseignement; };

export default function EnseignementShow({ enseignement }: ShowProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/enseignements/${enseignement.id}`, {
            onSuccess: () => setIsDeleteDialogOpen(false),
        });
    };

    // Sécurisation des propriétés optionnelles
    const enseignantName = enseignement.enseignant?.user?.name || "Enseignant inconnu";
    const classeNom = enseignement.classe?.nom || "Classe inconnue";
    const matiereNom = enseignement.matiere?.nom || "Matière inconnue";

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Enseignements", href: "/enseignements" }, { title: `${matiereNom} - ${classeNom}`, href: `/enseignements/${enseignement.id}` }]}>
            <Head title={`Détails de l'enseignement`} />
            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Détails de l'enseignement
                            <div className="space-x-2">
                                <Link href={`/enseignements/${enseignement.id}/edit`}><Button variant="outline">Modifier</Button></Link>
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger asChild><Button variant="destructive">Supprimer</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                            <DialogDescription>Cette action ne peut pas être annulée. Elle supprimera l'assignation de "{matiereNom}" par "{enseignantName}" pour la classe "{classeNom}".</DialogDescription>
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
                        <div><h3 className="font-semibold text-gray-700">Enseignant</h3><p className="text-gray-900">{enseignantName}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Matière</h3><p className="text-gray-900">{matiereNom}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Classe</h3><p className="text-gray-900">{classeNom}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Coefficient</h3><p className="text-gray-900">{enseignement.coefficient}</p></div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}