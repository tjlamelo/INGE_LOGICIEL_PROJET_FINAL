import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react'; // Ajout de useForm
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- Types ---
type Classe = {
    id: number;
    nom: string;
};

type Trimestre = {
    id: number;
    nom: string;
    annee_scolaire: string;
};

type CreateProps = {
    classes: Classe[];
    trimestres: Trimestre[];
};

export default function BulletinCreate({ classes, trimestres }: CreateProps) {
    // Utilisation de useForm comme dans votre exemple
    const { data, setData, post, processing, errors } = useForm({
        classe_id: '',
        trimestre_id: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/bulletins'); // Pattern identique à votre exemple
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Évaluation', href: '#' },
                { title: 'Bulletins', href: '/bulletins' },
                { title: 'Générer', href: '/bulletins/create' },
            ]}
        >
            <Head title="Générer des bulletins" />

            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Générer des bulletins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label htmlFor="classe_id">Classe</Label>
                                <Select
                                    value={data.classe_id}
                                    onValueChange={(value) => setData('classe_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une classe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(classe => (
                                            <SelectItem key={classe.id} value={classe.id.toString()}>
                                                {classe.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.classe_id && <p className="text-red-500 text-xs mt-1">{errors.classe_id}</p>}
                            </div>

                            <div>
                                <Label htmlFor="trimestre_id">Trimestre</Label>
                                <Select
                                    value={data.trimestre_id}
                                    onValueChange={(value) => setData('trimestre_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un trimestre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {trimestres.map(trimestre => (
                                            <SelectItem key={trimestre.id} value={trimestre.id.toString()}>
                                                {trimestre.nom} ({trimestre.annee_scolaire})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.trimestre_id && <p className="text-red-500 text-xs mt-1">{errors.trimestre_id}</p>}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Link href="/bulletins">
                                    <Button type="button" variant="ghost">Annuler</Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing || !data.classe_id || !data.trimestre_id}
                                >
                                    {processing ? 'Génération...' : 'Générer les bulletins'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}