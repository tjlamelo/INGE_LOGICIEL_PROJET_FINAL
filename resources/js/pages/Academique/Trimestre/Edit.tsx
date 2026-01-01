import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Types ---
type Trimestre = { id: number; nom: string; annee_scolaire: string; };
type EditProps = { trimestre: Trimestre; };

export default function TrimestreEdit({ trimestre }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        nom: trimestre.nom,
        annee_scolaire: trimestre.annee_scolaire,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/trimestres/${trimestre.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Trimestres", href: "/trimestres" }, { title: "Modifier", href: `/trimestres/${trimestre.id}/edit` }]}>
            <Head title={`Modifier ${trimestre.nom}`} />
            <div className="p-6">
                <Card className="max-w-xl mx-auto">
                    <CardHeader><CardTitle>Modifier le trimestre : {trimestre.nom}</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="nom">Nom du trimestre</Label>
                                <Input id="nom" value={data.nom} onChange={(e) => setData('nom', e.target.value)} placeholder="ex: 1er Trimestre" />
                                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                            </div>
                            <div>
                                <Label htmlFor="annee_scolaire">Année Scolaire</Label>
                                <Input id="annee_scolaire" value={data.annee_scolaire} onChange={(e) => setData('annee_scolaire', e.target.value)} placeholder="ex: 2023-2024" />
                                {errors.annee_scolaire && <p className="text-red-500 text-sm mt-1">{errors.annee_scolaire}</p>}
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <Link href="/trimestres"><Button type="button" variant="outline">Annuler</Button></Link>
                                <Button type="submit" disabled={processing}>{processing ? 'Mise à jour...' : 'Mettre à jour'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}