import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Types ---
type User = { id: number; name: string; email: string; };
type Enseignant = { id: number; user: User; };
type Classe = { id: number; nom: string; };
type Matiere = { id: number; nom: string; };
type Enseignement = {
    id: number;
    enseignant_id: number;
    classe_id: number;
    matiere_id: number;
    coefficient: number;
};
type EditProps = { enseignement: Enseignement; enseignants: Enseignant[]; classes: Classe[]; matieres: Matiere[]; };

export default function EnseignementEdit({ enseignement, enseignants, classes, matieres }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        enseignant_id: enseignement.enseignant_id.toString(),
        classe_id: enseignement.classe_id.toString(),
        matiere_id: enseignement.matiere_id.toString(),
        coefficient: enseignement.coefficient.toString(),
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/enseignements/${enseignement.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Enseignements", href: "/enseignements" }, { title: "Modifier", href: `/enseignements/${enseignement.id}/edit` }]}>
            <Head title="Modifier l'enseignement" />
            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader><CardTitle>Modifier l'enseignement</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {/* Les champs sont identiques à Create, mais pré-remplis */}
                            <div>
                                <Label htmlFor="enseignant_id">Enseignant</Label>
                                <select id="enseignant_id" value={data.enseignant_id} onChange={(e) => setData('enseignant_id', e.target.value)} className="w-full p-2 border rounded-md bg-white">
                                    <option value="">Sélectionner un enseignant</option>
                                    {enseignants.map(ens => <option key={ens.id} value={ens.id}>{ens.user.name}</option>)}
                                </select>
                                {errors.enseignant_id && <p className="text-red-500 text-sm mt-1">{errors.enseignant_id}</p>}
                            </div>
                            <div>
                                <Label htmlFor="classe_id">Classe</Label>
                                <select id="classe_id" value={data.classe_id} onChange={(e) => setData('classe_id', e.target.value)} className="w-full p-2 border rounded-md bg-white">
                                    <option value="">Sélectionner une classe</option>
                                    {classes.map(classe => <option key={classe.id} value={classe.id}>{classe.nom}</option>)}
                                </select>
                                {errors.classe_id && <p className="text-red-500 text-sm mt-1">{errors.classe_id}</p>}
                            </div>
                            <div>
                                <Label htmlFor="matiere_id">Matière</Label>
                                <select id="matiere_id" value={data.matiere_id} onChange={(e) => setData('matiere_id', e.target.value)} className="w-full p-2 border rounded-md bg-white">
                                    <option value="">Sélectionner une matière</option>
                                    {matieres.map(matiere => <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>)}
                                </select>
                                {errors.matiere_id && <p className="text-red-500 text-sm mt-1">{errors.matiere_id}</p>}
                            </div>
                            <div>
                                <Label htmlFor="coefficient">Coefficient</Label>
                                <Input id="coefficient" type="number" min="1" value={data.coefficient} onChange={(e) => setData('coefficient', e.target.value)} />
                                {errors.coefficient && <p className="text-red-500 text-sm mt-1">{errors.coefficient}</p>}
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <Link href="/enseignements"><Button type="button" variant="outline">Annuler</Button></Link>
                                <Button type="submit" disabled={processing}>{processing ? 'Mise à jour...' : 'Mettre à jour'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}