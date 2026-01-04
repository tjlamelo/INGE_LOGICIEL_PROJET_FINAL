import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

// --- Types ---
type Eleve = { id: number; user: { name: string } };
type Enseignement = { id: number; display_name: string };
type Trimestre = {
    id: number;
    nom: string;
    annee_scolaire: string;
    sequence_active: number;
};

export type Note = {
    id: number;
    valeur: number;
    eleve_id: number;
    enseignement_id: number;
    trimestre_id: number;
    sequence: number;
    type_evaluation: string | null;
    date_evaluation: string;
    appreciation: string | null;
};

type EditProps = {
    note: Note;
    eleves: Eleve[];
    enseignements: Enseignement[];
    trimestre_actif: Trimestre; // Reçu depuis le contrôleur
};

type EditForm = {
    valeur: string;
    eleve_id: string;
    enseignement_id: string;
    trimestre_id: string;
    sequence: string;
    type_evaluation: string;
    date_evaluation: string;
    appreciation: string;
};

export default function NoteEdit({
    note,
    eleves,
    enseignements,
    trimestre_actif,
}: EditProps) {
    
    // Initialisation du formulaire avec useForm d'Inertia
    const { data, setData, put, processing, errors } = useForm<EditForm>({
        valeur: note.valeur?.toString() || '0',
        eleve_id: note.eleve_id?.toString() || '',
        enseignement_id: note.enseignement_id?.toString() || '',
        trimestre_id: note.trimestre_id?.toString() || '',
        sequence: note.sequence?.toString() || '1',
        type_evaluation: note.type_evaluation || '',
        date_evaluation: note.date_evaluation || '',
        appreciation: note.appreciation || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/notes/${note.id}`);
    };

    if (!note) {
        return <div className="p-6 text-center">Chargement des données...</div>;
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Évaluation', href: '#' },
                { title: 'Notes', href: '/notes' },
                { title: 'Modifier', href: `/notes/${note.id}/edit` },
            ]}
        >
            <Head title="Modifier la note" />
            <div className="p-6">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Modifier l'évaluation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            
                            {/* SECTION : TRIMESTRE ET SÉQUENCE (VERROUILLÉS) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <Label className="text-slate-500">Trimestre</Label>
                                    <Input 
                                        value={`${trimestre_actif?.nom} (${trimestre_actif?.annee_scolaire})`} 
                                        readOnly 
                                        className="bg-slate-100 cursor-not-allowed border-none font-medium shadow-none"
                                    />
                                    <input type="hidden" value={data.trimestre_id} />
                                </div>
                                <div>
                                    <Label className="text-slate-500">Période (Séquence)</Label>
                                    <Input 
                                        value={`Séquence ${data.sequence}`} 
                                        readOnly 
                                        className="bg-slate-100 cursor-not-allowed border-none font-bold text-blue-600 shadow-none"
                                    />
                                    <input type="hidden" value={data.sequence} />
                                </div>
                            </div>

                            {/* ÉLÈVE */}
                            <div>
                                <Label htmlFor="eleve_id">Élève</Label>
                                <select
                                    id="eleve_id"
                                    value={data.eleve_id}
                                    onChange={(e) => setData('eleve_id', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Sélectionner un élève</option>
                                    {eleves.map((eleve) => (
                                        <option key={eleve.id} value={eleve.id}>
                                            {eleve.user.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.eleve_id && <p className="mt-1 text-xs text-red-500">{errors.eleve_id}</p>}
                            </div>

                            {/* ENSEIGNEMENT */}
                            <div>
                                <Label htmlFor="enseignement_id">Matière & Classe</Label>
                                <select
                                    id="enseignement_id"
                                    value={data.enseignement_id}
                                    onChange={(e) => setData('enseignement_id', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Sélectionner un enseignement</option>
                                    {enseignements.map((ens) => (
                                        <option key={ens.id} value={ens.id}>
                                            {ens.display_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.enseignement_id && <p className="mt-1 text-xs text-red-500">{errors.enseignement_id}</p>}
                            </div>

                            {/* VALEUR ET TYPE */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="valeur">Note (/20)</Label>
                                    <Input
                                        id="valeur"
                                        type="number"
                                        step="0.25"
                                        min="0"
                                        max="20"
                                        value={data.valeur}
                                        onChange={(e) => setData('valeur', e.target.value)}
                                        className="font-semibold text-lg"
                                    />
                                    {errors.valeur && <p className="mt-1 text-xs text-red-500">{errors.valeur}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="type_evaluation">Type d'évaluation</Label>
                                    <select
                                        id="type_evaluation"
                                        value={data.type_evaluation}
                                        onChange={(e) => setData('type_evaluation', e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Interrogation">Interrogation</option>
                                        <option value="Devoir">Devoir</option>
                                        <option value="Examen">Examen</option>
                                    </select>
                                </div>
                            </div>

                            {/* DATE */}
                            <div>
                                <Label htmlFor="date_evaluation">Date de l'évaluation</Label>
                                <Input
                                    id="date_evaluation"
                                    type="date"
                                    value={data.date_evaluation}
                                    onChange={(e) => setData('date_evaluation', e.target.value)}
                                />
                                {errors.date_evaluation && <p className="mt-1 text-xs text-red-500">{errors.date_evaluation}</p>}
                            </div>

                            {/* APPRÉCIATION */}
                            <div>
                                <Label htmlFor="appreciation">Appréciation</Label>
                                <textarea
                                    id="appreciation"
                                    value={data.appreciation}
                                    onChange={(e) => setData('appreciation', e.target.value)}
                                    rows={3}
                                    placeholder="Commentaire sur le travail de l'élève..."
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* BOUTONS ACTIONS */}
                            <div className="flex items-center justify-between pt-6 border-t">
                                <Link href="/notes">
                                    <Button type="button" variant="outline">Annuler</Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                    {processing ? 'Mise à jour...' : 'Enregistrer les modifications'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}