import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react'; // Ajout de useForm
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

// --- Types ---
type Bulletin = {
    id: number;
    moyenne_generale: number;
    rang: number;
    effectif_classe: number;
    appreciation_generale: string | null;
    est_valide: boolean;
    date_generation: string;
};

type Eleve = {
    id: number;
    user: { name: string };
};

type Trimestre = {
    id: number;
    nom: string;
    annee_scolaire: string;
};

type EditProps = {
    bulletin: Bulletin;
    eleve: Eleve;
    trimestre: Trimestre;
};

export default function BulletinEdit({ bulletin, eleve, trimestre }: EditProps) {
    // Utilisation de useForm comme dans votre exemple
    const { data, setData, put, processing, errors } = useForm({
        appreciation_generale: bulletin.appreciation_generale || '',
        est_valide: bulletin.est_valide,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/bulletins/${bulletin.id}`); // Pattern identique à votre exemple
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Évaluation', href: '#' },
                { title: 'Bulletins', href: '/bulletins' },
                { title: `Bulletin de ${eleve.user.name}`, href: `/bulletins/${eleve.id}/${trimestre.id}` },
                { title: 'Modifier', href: `/bulletins/${bulletin.id}/edit` },
            ]}
        >
            <Head title={`Modifier le bulletin de ${eleve.user.name}`} />

            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Modifier le bulletin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label htmlFor="appreciation_generale">Appréciation générale</Label>
                                <textarea
                                    id="appreciation_generale"
                                    rows={4}
                                    value={data.appreciation_generale}
                                    onChange={(e) => setData('appreciation_generale', e.target.value)}
                                    className="w-full mt-1 p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Appréciation générale du travail de l'élève..."
                                />
                                {errors.appreciation_generale && <p className="text-red-500 text-xs mt-1">{errors.appreciation_generale}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="est_valide"
                                    checked={data.est_valide}
                                    onCheckedChange={(checked) => setData('est_valide', checked as boolean)}
                                />
                                <Label htmlFor="est_valide">Bulletin validé</Label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Link href={`/bulletins/${eleve.id}/${trimestre.id}`}>
                                    <Button type="button" variant="ghost">Annuler</Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                >
                                    {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}