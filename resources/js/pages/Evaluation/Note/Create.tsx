import React, { useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Types ---
type User = { id: number; name: string; email: string; };
type Eleve = { id: number; user: User; };
type Enseignement = { id: number; display_name: string; };
type Trimestre = { 
    id: number; 
    nom: string; 
    annee_scolaire: string; 
    sequence_active: number; 
};

type CreateProps = { 
    eleves: Eleve[]; 
    enseignements: Enseignement[]; 
    trimestre_actif: Trimestre; 
};

type CreateForm = {
    valeur: string;
    eleve_id: string;
    enseignement_id: string;
    trimestre_id: string;
    sequence: string;
    type_evaluation: string;
    date_evaluation: string;
    appreciation: string;
};

export default function NoteCreate({ eleves, enseignements, trimestre_actif }: CreateProps) {
    // Initialisation du formulaire
    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        valeur: '',
        eleve_id: '',
        enseignement_id: '',
        // On initialise directement avec les données du trimestre actif
        trimestre_id: trimestre_actif?.id.toString() || '',
        sequence: trimestre_actif?.sequence_active.toString() || '1',
        type_evaluation: 'Interrogation',
        date_evaluation: new Date().toISOString().split('T')[0],
        appreciation: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/notes');
    };

    return (
        <AppLayout 
            breadcrumbs={[
                { title: "Évaluation", href: "#" }, 
                { title: "Notes", href: "/notes" }, 
                { title: "Créer", href: "/notes/create" }
            ]}
        >
            <Head title="Ajouter une Note" />
            
            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            Nouvelle évaluation - {trimestre_actif?.nom}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Année scolaire : {trimestre_actif?.annee_scolaire}
                        </p>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* SECTION VERROUILLÉE : CONTEXTE TEMPOREL */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                                <div>
                                    <Label className="text-blue-700">Trimestre Actif</Label>
                                    <Input 
                                        value={trimestre_actif?.nom || 'Chargement...'} 
                                        readOnly 
                                        className="bg-white border-blue-200 cursor-not-allowed shadow-none mt-1" 
                                    />
                                    <input type="hidden" value={data.trimestre_id} />
                                </div>
                                <div>
                                    <Label className="text-blue-700">Séquence de saisie</Label>
                                    <Input 
                                        value={`Séquence ${trimestre_actif?.sequence_active || ''}`} 
                                        readOnly 
                                        className="bg-white border-blue-200 font-bold text-blue-600 cursor-not-allowed shadow-none mt-1"
                                    />
                                    <input type="hidden" value={data.sequence} />
                                </div>
                            </div>

                            {/* CHOIX DU COURS */}
                            <div>
                                <Label htmlFor="enseignement_id">Classe & Matière</Label>
                                <select 
                                    id="enseignement_id" 
                                    value={data.enseignement_id} 
                                    onChange={(e) => setData('enseignement_id', e.target.value)} 
                                    className="w-full mt-1 p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Sélectionner un cours</option>
                                    {enseignements.map(ens => (
                                        <option key={ens.id} value={ens.id}>{ens.display_name}</option>
                                    ))}
                                </select>
                                {errors.enseignement_id && <p className="text-red-500 text-xs mt-1">{errors.enseignement_id}</p>}
                            </div>

                            {/* CHOIX DE L'ÉLÈVE */}
                            <div>
                                <Label htmlFor="eleve_id">Élève</Label>
                                <select 
                                    id="eleve_id" 
                                    value={data.eleve_id} 
                                    onChange={(e) => setData('eleve_id', e.target.value)} 
                                    className="w-full mt-1 p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Sélectionner un élève</option>
                                    {eleves.map(eleve => (
                                        <option key={eleve.id} value={eleve.id}>{eleve.user.name}</option>
                                    ))}
                                </select>
                                {errors.eleve_id && <p className="text-red-500 text-xs mt-1">{errors.eleve_id}</p>}
                            </div>

                            {/* NOTE ET TYPE */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="valeur">Note (/20)</Label>
                                    <Input 
                                        id="valeur" 
                                        type="number" 
                                        step="0.25" 
                                        min="0" 
                                        max="20" 
                                        placeholder="Ex: 14.5"
                                        value={data.valeur} 
                                        onChange={(e) => setData('valeur', e.target.value)} 
                                        className="mt-1"
                                    />
                                    {errors.valeur && <p className="text-red-500 text-xs mt-1">{errors.valeur}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="type_evaluation">Type d'évaluation</Label>
                                    <select 
                                        id="type_evaluation" 
                                        value={data.type_evaluation} 
                                        onChange={(e) => setData('type_evaluation', e.target.value)} 
                                        className="w-full mt-1 p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                                    className="mt-1"
                                />
                                {errors.date_evaluation && <p className="text-red-500 text-xs mt-1">{errors.date_evaluation}</p>}
                            </div>

                            {/* APPRÉCIATION */}
                            <div>
                                <Label htmlFor="appreciation">Appréciation (Optionnel)</Label>
                                <textarea 
                                    id="appreciation" 
                                    rows={3}
                                    value={data.appreciation} 
                                    onChange={(e) => setData('appreciation', e.target.value)} 
                                    placeholder="Ex: Bon travail, continuez ainsi..."
                                    className="w-full mt-1 p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                {errors.appreciation && <p className="text-red-500 text-xs mt-1">{errors.appreciation}</p>}
                            </div>

                            {/* ACTIONS */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Link href="/notes">
                                    <Button type="button" variant="ghost">Annuler</Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                                >
                                    {processing ? 'Enregistrement...' : 'Enregistrer la note'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}