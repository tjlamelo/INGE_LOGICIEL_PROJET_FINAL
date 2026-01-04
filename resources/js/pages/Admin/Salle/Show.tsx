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
type Note = {
    id: number;
    valeur: number;
    type_evaluation: string | null;
    date_evaluation: string;
    appreciation: string | null;
    eleve: { user: { name: string } } | null;
    enseignement: {
        matiere: { nom: string } | null;
        classe: { nom: string } | null;
        enseignant: { user: { name: string } } | null;
    } | null;
    trimestre: { nom: string; annee_scolaire: string } | null;
};
type ShowProps = { note: Note; };

export default function NoteShow({ note }: ShowProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/notes/${note.id}`, {
            onSuccess: () => setIsDeleteDialogOpen(false),
        });
    };

    // Sécurisation des propriétés optionnelles
    const eleveName = note.eleve?.user?.name || "Élève inconnu";
    const matiereNom = note.enseignement?.matiere?.nom || "Matière inconnue";
    const classeNom = note.enseignement?.classe?.nom || "Classe inconnue";
    const enseignantName = note.enseignement?.enseignant?.user?.name || "Enseignant inconnu";
    const trimestreInfo = note.trimestre ? `${note.trimestre.nom} (${note.trimestre.annee_scolaire})` : "Trimestre inconnu";

    return (
        <AppLayout breadcrumbs={[{ title: "Évaluation", href: "#" }, { title: "Notes", href: "/notes" }, { title: `Note de ${eleveName}`, href: `/notes/${note.id}` }]}>
            <Head title={`Détails de la note`} />
            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Détails de la note
                            <div className="space-x-2">
                                <Link href={`/notes/${note.id}/edit`}><Button variant="outline">Modifier</Button></Link>
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger asChild><Button variant="destructive">Supprimer</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                            <DialogDescription>Cette action ne peut pas être annulée. Elle supprimera définitivement la note de {note.valeur} pour "{eleveName}".</DialogDescription>
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
                        <div><h3 className="font-semibold text-gray-700">Élève</h3><p className="text-gray-900">{eleveName}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Note</h3><p className="text-gray-900 font-semibold text-lg">{note.valeur} / 20</p></div>
                        <div><h3 className="font-semibold text-gray-700">Matière</h3><p className="text-gray-900">{matiereNom}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Classe</h3><p className="text-gray-900">{classeNom}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Enseignant</h3><p className="text-gray-900">{enseignantName}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Trimestre</h3><p className="text-gray-900">{trimestreInfo}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Type d'évaluation</h3><p className="text-gray-900">{note.type_evaluation || <span className="text-gray-400">Non spécifié</span>}</p></div>
                        <div><h3 className="font-semibold text-gray-700">Date</h3><p className="text-gray-900">{new Date(note.date_evaluation).toLocaleDateString()}</p></div>
                        <div className="md:col-span-2"><h3 className="font-semibold text-gray-700">Appréciation</h3><p className="text-gray-900 whitespace-pre-wrap">{note.appreciation || <span className="text-gray-400">Aucune</span>}</p></div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}