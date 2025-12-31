import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateForm = { nom: string; code: string; };

export default function MatiereCreate() {
    const { data, setData, post, processing, errors } = useForm<CreateForm>({ nom: '', code: '' });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // CORRIGÉ : URL en dur pour la création
        post('/matieres');
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Matières", href: "/matieres" }, { title: "Créer", href: "/matieres/create" }]}>
            <Head title="Créer une Matière" />
            <div className="p-6">
                <Card className="max-w-xl mx-auto">
                    <CardHeader><CardTitle>Nouvelle Matière</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="nom">Nom de la matière</Label>
                                <Input id="nom" value={data.nom} onChange={(e) => setData('nom', e.target.value)} placeholder="ex: Mathématiques" />
                                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                            </div>
                            <div>
                                <Label htmlFor="code">Code</Label>
                                <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="ex: MATH" />
                                {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                            </div>
                            <div className="flex items-center justify-end space-x-2 pt-4">
                                <Button type="submit" disabled={processing}>{processing ? 'Création...' : 'Créer'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}