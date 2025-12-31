import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Types ---
type User = { id: number; name: string; email: string; };
type Classe = { id: number; nom: string; };
type CreateProps = { classes: Classe[]; users: User[]; }; // On suppose que la liste des utilisateurs est aussi passée

export default function EleveCreate({ classes, users }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        matricule: '',
        date_naissance: '',
        lieu_naissance: '',
        sexe: 'M',
        nom_tuteur: '',
        contact_tuteur: '',
        classe_id: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/eleves');
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Utilisateurs", href: "#" }, { title: "Élèves", href: "/eleves" }, { title: "Créer", href: "/eleves/create" }]}>
            <Head title="Créer un Élève" />
            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader><CardTitle>Ajouter un nouvel élève</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="user_id">Utilisateur associé</Label>
                                <select id="user_id" value={data.user_id} onChange={(e) => setData('user_id', e.target.value)} className="w-full p-2 border rounded">
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
                                <Label htmlFor="date_naissance">Date de naissance</Label>
                                <Input id="date_naissance" type="date" value={data.date_naissance} onChange={(e) => setData('date_naissance', e.target.value)} />
                                {errors.date_naissance && <p className="text-red-500 text-sm mt-1">{errors.date_naissance}</p>}
                            </div>
                            <div>
                                <Label htmlFor="lieu_naissance">Lieu de naissance</Label>
                                <Input id="lieu_naissance" value={data.lieu_naissance} onChange={(e) => setData('lieu_naissance', e.target.value)} />
                                {errors.lieu_naissance && <p className="text-red-500 text-sm mt-1">{errors.lieu_naissance}</p>}
                            </div>
                            <div>
                                <Label htmlFor="sexe">Sexe</Label>
                                <select id="sexe" value={data.sexe} onChange={(e) => setData('sexe', e.target.value)} className="w-full p-2 border rounded">
                                    <option value="M">Masculin</option>
                                    <option value="F">Féminin</option>
                                </select>
                                {errors.sexe && <p className="text-red-500 text-sm mt-1">{errors.sexe}</p>}
                            </div>
                            <div>
                                <Label htmlFor="classe_id">Classe</Label>
                                <select id="classe_id" value={data.classe_id} onChange={(e) => setData('classe_id', e.target.value)} className="w-full p-2 border rounded">
                                    <option value="">Non assignée</option>
                                    {classes.map(classe => <option key={classe.id} value={classe.id}>{classe.nom}</option>)}
                                </select>
                                {errors.classe_id && <p className="text-red-500 text-sm mt-1">{errors.classe_id}</p>}
                            </div>
                            <div>
                                <Label htmlFor="nom_tuteur">Nom du tuteur</Label>
                                <Input id="nom_tuteur" value={data.nom_tuteur} onChange={(e) => setData('nom_tuteur', e.target.value)} />
                                {errors.nom_tuteur && <p className="text-red-500 text-sm mt-1">{errors.nom_tuteur}</p>}
                            </div>
                            <div>
                                <Label htmlFor="contact_tuteur">Contact du tuteur</Label>
                                <Input id="contact_tuteur" value={data.contact_tuteur} onChange={(e) => setData('contact_tuteur', e.target.value)} />
                                {errors.contact_tuteur && <p className="text-red-500 text-sm mt-1">{errors.contact_tuteur}</p>}
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <Link href="/eleves"><Button type="button" variant="outline">Annuler</Button></Link>
                                <Button type="submit" disabled={processing}>{processing ? 'Création...' : 'Créer l\'élève'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}