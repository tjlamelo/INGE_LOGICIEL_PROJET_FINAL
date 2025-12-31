import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Classe = { id: number; nom: string; niveau: string; filiere: string | null; created_at: string; updated_at: string; };
type EditForm = { nom: string; niveau: string; filiere: string; };
type EditProps = { classe: Classe; };

export default function ClasseEdit({ classe }: EditProps) {
    const { data, setData, put, processing, errors } = useForm<EditForm>({
        nom: classe.nom,
        niveau: classe.niveau,
        filiere: classe.filiere || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/classes/${classe.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Académique", href: "#" }, { title: "Classes", href: "/classes" }, { title: "Modifier", href: `/classes/${classe.id}/edit` }]}>
            <Head title={`Modifier ${classe.nom}`} />
            <div className="p-6">
                <Card className="max-w-xl mx-auto">
                    <CardHeader><CardTitle>Modifier la classe : {classe.nom}</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="nom">Nom de la classe</Label>
                                <Input id="nom" value={data.nom} onChange={(e) => setData('nom', e.target.value)} />
                                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                            </div>
                            <div>
                                <Label htmlFor="niveau">Niveau</Label>
                                <Input id="niveau" value={data.niveau} onChange={(e) => setData('niveau', e.target.value)} />
                                {errors.niveau && <p className="text-red-500 text-sm mt-1">{errors.niveau}</p>}
                            </div>
                            <div>
                                <Label htmlFor="filiere">Filière (Optionnel)</Label>
                                <Input id="filiere" value={data.filiere} onChange={(e) => setData('filiere', e.target.value)} />
                                {errors.filiere && <p className="text-red-500 text-sm mt-1">{errors.filiere}</p>}
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <Link href="/classes"><Button type="button" variant="outline">Annuler</Button></Link>
                                <Button type="submit" disabled={processing}>{processing ? 'Mise à jour...' : 'Mettre à jour'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}