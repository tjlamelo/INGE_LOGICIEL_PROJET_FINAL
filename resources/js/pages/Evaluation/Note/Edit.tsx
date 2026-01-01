import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types sont les mêmes que pour Create et Show
type Eleve = { id: number; user: { name: string; }; };
type Enseignement = { id: number; display_name: string; };
type Trimestre = { id: number; nom: string; annee_scolaire: string; };
export type Note = {
    // Attributs directs du modèle Note
    id: number;
    valeur: number; // Sera un nombre, provenant de la base de données
    eleve_id: number;
    enseignement_id: number;
    trimestre_id: number;
    type_evaluation: string | null;
    date_evaluation: string; // Les dates sont souvent des chaînes ISO 8601
    appreciation: string | null;
    created_at: string;
    updated_at: string;

    
};
type EditProps = { note: Note; eleves: Eleve[]; enseignements: Enseignement[]; trimestres: Trimestre[]; };

export default function NoteEdit({ note, eleves, enseignements, trimestres }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        valeur: note.valeur.toString(),
        eleve_id: note.eleve_id.toString(),
        enseignement_id: note.enseignement_id.toString(),
        trimestre_id: note.trimestre_id.toString(),
        type_evaluation: note.type_evaluation || '',
        date_evaluation: note.date_evaluation,
        appreciation: note.appreciation || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/notes/${note.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Évaluation", href: "#" }, { title: "Notes", href: "/notes" }, { title: "Modifier", href: `/notes/${note.id}/edit` }]}>
            <Head title="Modifier la note" />
            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader><CardTitle>Modifier la note</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {/* Les champs sont identiques à Create, mais pré-remplis */}
                            <div>
                                <Label htmlFor="eleve_id">Élève</Label>
                                <select id="eleve_id" value={data.eleve_id} onChange={(e) => setData('eleve_id', e.target.value)} className="w-full p-2 border rounded-md bg-white">
                                    <option value="">Sélectionner un élève</option>
                                    {eleves.map(eleve => <option key={eleve.id} value={eleve.id}>{eleve.user.name}</option>)}
                                </select>
                                {errors.eleve_id && <p className="text-red-500 text-sm mt-1">{errors.eleve_id}</p>}
                            </div>
                                <div>
                                                            <Label htmlFor="enseignement_id">Enseignement (Matière - Classe)</Label>
                                                            <select id="enseignement_id" value={data.enseignement_id} onChange={(e) => setData('enseignement_id', e.target.value)} className="w-full p-2 border rounded-md bg-white">
                                                                <option value="">Sélectionner un enseignement</option>
                                                                {enseignements.map(ens => <option key={ens.id} value={ens.id}>{ens.display_name}</option>)}
                                                            </select>
                                                            {errors.enseignement_id && <p className="text-red-500 text-sm mt-1">{errors.enseignement_id}</p>}
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="trimestre_id">Trimestre</Label>
                                                            <select id="trimestre_id" value={data.trimestre_id} onChange={(e) => setData('trimestre_id', e.target.value)} className="w-full p-2 border rounded-md bg-white">
                                                                <option value="">Sélectionner un trimestre</option>
                                                                {trimestres.map(trimestre => <option key={trimestre.id} value={trimestre.id}>{trimestre.nom} ({trimestre.annee_scolaire})</option>)}
                                                            </select>
                                                            {errors.trimestre_id && <p className="text-red-500 text-sm mt-1">{errors.trimestre_id}</p>}
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="valeur">Valeur de la note</Label>
                                                            <Input id="valeur" type="number" step="0.01" min="0" max="20" value={data.valeur} onChange={(e) => setData('valeur', e.target.value)} />
                                                            {errors.valeur && <p className="text-red-500 text-sm mt-1">{errors.valeur}</p>}
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="type_evaluation">Type d'évaluation</Label>
                                                            <Input id="type_evaluation" value={data.type_evaluation} onChange={(e) => setData('type_evaluation', e.target.value)} placeholder="ex: Devoir, Examen" />
                                                            {errors.type_evaluation && <p className="text-red-500 text-sm mt-1">{errors.type_evaluation}</p>}
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="date_evaluation">Date de l'évaluation</Label>
                                                            <Input id="date_evaluation" type="date" value={data.date_evaluation} onChange={(e) => setData('date_evaluation', e.target.value)} />
                                                            {errors.date_evaluation && <p className="text-red-500 text-sm mt-1">{errors.date_evaluation}</p>}
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="appreciation">Appréciation</Label>
                                                            <textarea id="appreciation" value={data.appreciation} onChange={(e) => setData('appreciation', e.target.value)} rows={3} className="w-full p-2 border rounded-md" />
                                                            {errors.appreciation && <p className="text-red-500 text-sm mt-1">{errors.appreciation}</p>}
                                                        </div>
                            <div className="flex items-center justify-between pt-4">
                                <Link href="/notes"><Button type="button" variant="outline">Annuler</Button></Link>
                                <Button type="submit" disabled={processing}>{processing ? 'Mise à jour...' : 'Mettre à jour'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}