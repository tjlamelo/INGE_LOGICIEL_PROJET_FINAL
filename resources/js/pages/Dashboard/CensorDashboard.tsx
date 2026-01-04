import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface CensorDashboardProps {
    data: any;
    userName: string;
}

export default function CensorDashboard({ data, userName }: CensorDashboardProps) {
    const { statistics, recent_activities, validation_queue } = data;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tableau de bord censeur</h1>
                <Badge variant="outline" className="text-sm">
                    Bienvenue, {userName}
                </Badge>
            </div>

            {/* Statistiques des bulletins */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Bulletins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.total_bulletins}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Bulletins Validés</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{statistics.validated_bulletins}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Bulletins en Attente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{statistics.pending_bulletins}</div>
                    </CardContent>
                </Card>
            </div>

            {/* File d'attente de validation */}
            <Card>
                <CardHeader>
                    <CardTitle>File d'Attente de Validation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {validation_queue.map((bulletin: any) => (
                            <div key={bulletin.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{bulletin.eleve.user.name}</p>
                                    <p className="text-sm text-gray-500">{bulletin.trimestre.nom}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/bulletins/${bulletin.id}/edit`}>
                                        <Button variant="outline" size="sm">Vérifier</Button>
                                    </Link>
                                    <Badge variant="secondary">En attente</Badge>
                                </div>
                            </div>
                        ))}
                        {validation_queue.length === 0 && (
                            <p className="text-center text-gray-500 py-4">Aucun bulletin en attente de validation</p>
                        )}
                    </div>
                    <div className="mt-4">
                        <Link href="/bulletins/validation">
                            <Button variant="outline" size="sm">Voir tous les bulletins en attente</Button>
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
    );
}