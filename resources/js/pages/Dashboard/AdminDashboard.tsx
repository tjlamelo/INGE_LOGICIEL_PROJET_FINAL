import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface AdminDashboardProps {
    data: any;
    userName: string;
}

export default function AdminDashboard({ data, userName }: AdminDashboardProps) {
    const { statistics, recent_activities, charts_data } = data;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
                <Badge variant="outline" className="text-sm">
                    Bienvenue, {userName}
                </Badge>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Élèves</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.total_students}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Enseignants</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.total_teachers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.total_classes}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Matières</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.total_subjects}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Trimestre actif */}
            {statistics.active_trimestre && (
                <Card>
                    <CardHeader>
                        <CardTitle>Trimestre Actif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-medium">{statistics.active_trimestre.nom}</p>
                                <p className="text-sm text-gray-500">Année scolaire: {statistics.active_trimestre.annee_scolaire}</p>
                            </div>
                            <Badge variant="outline">
                                Séquence {statistics.active_trimestre.sequence_active}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notes récentes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notes Récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recent_activities.recent_notes.map((note: any) => (
                                <div key={note.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{note.eleve.user.name}</p>
                                        <p className="text-sm text-gray-500">{note.enseignement.matiere.nom}</p>
                                    </div>
                                    <Badge variant={note.valeur >= 10 ? "default" : "destructive"}>
                                        {note.valeur}/20
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link href="/notes">
                                <Button variant="outline" size="sm">Voir toutes les notes</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Bulletins récents */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bulletins Récents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recent_activities.recent_bulletins.map((bulletin: any) => (
                                <div key={bulletin.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{bulletin.eleve.user.name}</p>
                                        <p className="text-sm text-gray-500">{bulletin.trimestre.nom}</p>
                                    </div>
                                    <Badge variant={bulletin.est_valide ? "default" : "secondary"}>
                                        {bulletin.est_valide ? "Validé" : "En attente"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link href="/bulletins">
                                <Button variant="outline" size="sm">Voir tous les bulletins</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}