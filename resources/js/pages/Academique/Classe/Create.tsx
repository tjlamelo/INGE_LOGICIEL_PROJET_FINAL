import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateForm = { nom: string; niveau: string; filiere: string; };

export default function ClasseCreate() {
    const { data, setData, post, processing, errors } = useForm<CreateForm>({ nom: '', niveau: '', filiere: '' });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/classes');
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Classes", href: "/classes" }, { title: "Créer", href: "/classes/create" }]}>
            <Head title="Créer une Classe" />
            <div className="p-6">
                <Card className="max-w-xl mx-auto">
                    <CardHeader><CardTitle>Nouvelle Classe</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="nom">Nom de la classe</Label>
                                <Input id="nom" value={data.nom} onChange={(e) => setData('nom', e.target.value)} placeholder="ex: 1ère A" />
                                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                            </div>
                            <div>
                                <Label htmlFor="niveau">Niveau</Label>
                                <Input id="niveau" value={data.niveau} onChange={(e) => setData('niveau', e.target.value)} placeholder="ex: 1ère année" />
                                {errors.niveau && <p className="text-red-500 text-sm mt-1">{errors.niveau}</p>}
                            </div>
                            <div>
                                <Label htmlFor="filiere">Filière (Optionnel)</Label>
                                <Input id="filiere" value={data.filiere} onChange={(e) => setData('filiere', e.target.value)} placeholder="ex: Scientifique" />
                                {errors.filiere && <p className="text-red-500 text-sm mt-1">{errors.filiere}</p>}
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