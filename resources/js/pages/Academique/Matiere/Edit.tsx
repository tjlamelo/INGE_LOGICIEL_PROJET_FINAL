import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Matiere = { id: number; nom: string; code: string; created_at: string; updated_at: string; };
type EditForm = { nom: string; code: string; };
type EditProps = { matiere: Matiere; };

export default function MatiereEdit({ matiere }: EditProps) {
    const { data, setData, put, processing, errors } = useForm<EditForm>({ nom: matiere.nom, code: matiere.code });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // CORRIGÉ : URL en dur pour la mise à jour
        put(`/matieres/${matiere.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Matières", href: "/matieres" }, { title: "Modifier", href: `/matieres/${matiere.id}/edit` }]}>
            <Head title={`Modifier ${matiere.nom}`} />
            <div className="p-6">
                <Card className="max-w-xl mx-auto">
                    <CardHeader><CardTitle>Modifier la matière : {matiere.nom}</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="nom">Nom de la matière</Label>
                                <Input id="nom" value={data.nom} onChange={(e) => setData('nom', e.target.value)} />
                                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                            </div>
                            <div>
                                <Label htmlFor="code">Code</Label>
                                <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />
                                {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                {/* CORRIGÉ : URL en dur pour le lien d'annulation */}
                                <Link href="/matieres"><Button type="button" variant="outline">Annuler</Button></Link>
                                <Button type="submit" disabled={processing}>{processing ? 'Mise à jour...' : 'Mettre à jour'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}