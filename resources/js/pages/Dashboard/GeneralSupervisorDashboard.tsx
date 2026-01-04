import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface GeneralSupervisorDashboardProps {
    data: any;
    userName: string;
}

export default function GeneralSupervisorDashboard({ data, userName }: GeneralSupervisorDashboardProps) {
    const { statistics, academic_overview, recent_activities } = data;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tableau de bord superviseur général</h1>
                <Badge variant="outline" className="text-sm">
                    Bienvenue, {userName}
                </Badge>
            </div>

            {/* Statistiques générales */}
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
                        <CardTitle className="text-sm font-medium text-gray-500">Trimestre Actif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">{statistics.active_trimestre?.nom || 'N/A'}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Classes par niveau */}
                <Card>
                    <CardHeader>
                        <CardTitle>Classes par Niveau</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {academic_overview.classes_by_level.map((level: any) => (
                                <div key={level.niveau} className="flex justify-between">
                                    <p className="font-medium">{level.niveau}</p>
                                    <Badge variant="outline">{level.count}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Matières par groupe */}
                <Card>
                    <CardHeader>
                        <CardTitle>Matières par Groupe</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {academic_overview.subjects_by_group.map((group: any) => (
                                <div key={group.groupe} className="flex justify-between">
                                    <p className="font-medium">Groupe {group.groupe}</p>
                                    <Badge variant="outline">{group.count}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

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