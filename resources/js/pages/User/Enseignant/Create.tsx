import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Types ---
type User = { id: number; name: string; email: string; };
type CreateProps = { users: User[]; };

export default function EnseignantCreate({ users }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        matricule: '',
        telephone: '',
        adresse: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/enseignants');
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Utilisateurs", href: "#" }, { title: "Enseignants", href: "/enseignants" }, { title: "Créer", href: "/enseignants/create" }]}>
            <Head title="Créer un Enseignant" />
            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader><CardTitle>Ajouter un nouvel enseignant</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="user_id">Utilisateur associé</Label>
                                <select id="user_id" value={data.user_id} onChange={(e) => setData('user_id', e.target.value)} className="w-full p-2 border rounded-md bg-white">
                                    <option value="">Sélectionner un utilisateur</option>
                                    {users.map(user => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}
                                </select>
                                {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
                            </div>
                            <div>
                                <Label htmlFor="matricule">Matricule</Label>
                                <Input id="matricule" value={data.matricule} onChange={(e) => setData('matricule', e.target.value)} />
                                {errors.matricule && <p className="text-red-500 text-sm mt-1">{errors.matricule}</p>}
                            </div>
                            <div>
                                <Label htmlFor="telephone">Téléphone</Label>
                                <Input id="telephone" value={data.telephone} onChange={(e) => setData('telephone', e.target.value)} />
                                {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                            </div>
                            <div>
                                <Label htmlFor="adresse">Adresse</Label>
                                <textarea id="adresse" value={data.adresse} onChange={(e) => setData('adresse', e.target.value)} rows={3} className="w-full p-2 border rounded-md" />
                                {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <Link href="/enseignants"><Button type="button" variant="outline">Annuler</Button></Link>
                                <Button type="submit" disabled={processing}>{processing ? 'Création...' : 'Créer l\'enseignant'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}