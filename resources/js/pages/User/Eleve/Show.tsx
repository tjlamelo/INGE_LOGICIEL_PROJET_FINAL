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
type Classe = { id: number; nom: string; } | null;

type Eleve = {
    id: number;
    matricule: string;
    date_naissance: string;
    lieu_naissance: string | null;
    sexe: string;
    nom_tuteur: string | null;
    contact_tuteur: string | null;
    user: User;
    classe: Classe;
};

type ShowProps = { eleve: Eleve; };

export default function EleveShow({ eleve }: ShowProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/eleves/${eleve.id}`, {
            onSuccess: () => setIsDeleteDialogOpen(false),
        });
    };

    // ✅ sécurisation des propriétés optionnelles
    const userName = eleve.user?.name || "Utilisateur inconnu";
    const userEmail = eleve.user?.email || "Email inconnu";
    const classeName = eleve.classe?.nom || "Non assignée";
    const lieuNaissance = eleve.lieu_naissance || "Non spécifié";
    const nomTuteur = eleve.nom_tuteur || "Non spécifié";
    const contactTuteur = eleve.contact_tuteur || "Non spécifié";

    return (
        <AppLayout
            breadcrumbs={[
                { title: "Utilisateurs", href: "#" },
                { title: "Élèves", href: "/eleves" },
                { title: userName, href: `/eleves/${eleve.id}` },
            ]}
        >
            <Head title={`Détails de ${userName}`} />
            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Détails de l'élève
                            <div className="space-x-2">
                                <Link href={`/eleves/${eleve.id}/edit`}>
                                    <Button variant="outline">Modifier</Button>
                                </Link>
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive">Supprimer</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                            <DialogDescription>
                                                Cette action ne peut pas être annulée. Cela supprimera définitivement l'élève "{userName}".
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="flex justify-end gap-2">
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
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-700">Nom</h3>
                            <p className="text-gray-900">{userName}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Email</h3>
                            <p className="text-gray-900">{userEmail}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Matricule</h3>
                            <p className="text-gray-900">{eleve.matricule}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Classe</h3>
                            <p className="text-gray-900">{classeName}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Date de naissance</h3>
                            <p className="text-gray-900">{new Date(eleve.date_naissance).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Lieu de naissance</h3>
                            <p className="text-gray-900">{lieuNaissance}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Sexe</h3>
                            <p className="text-gray-900">{eleve.sexe === "M" ? "Masculin" : "Féminin"}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Nom du tuteur</h3>
                            <p className="text-gray-900">{nomTuteur}</p>
                        </div>
                        <div className="md:col-span-2">
                            <h3 className="font-semibold text-gray-700">Contact du tuteur</h3>
                            <p className="text-gray-900">{contactTuteur}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
