import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface PrincipalDashboardProps {
    data: any;
    userName: string;
}

export default function PrincipalDashboard({ data, userName }: PrincipalDashboardProps) {
    const { statistics, academic_performance, recent_activities } = data;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tableau de bord principal</h1>
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
                        <CardTitle className="text-sm font-medium text-gray-500">Taux de Présence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{academic_performance.attendance_rate}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance académique */}
            <Card>
                <CardHeader>
                    <CardTitle>Moyenne par Classe</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {academic_performance.average_by_class.map((classAvg: any) => (
                            <div key={classAvg.class_id} className="flex justify-between">
                                <p className="font-medium">{classAvg.class_name}</p>
                                <Badge variant={classAvg.average >= 10 ? "default" : "destructive"}>
                                    {classAvg.average}/20
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                {/* Absences récentes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Absences Récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recent_activities.recent_absences.map((absence: any) => (
                                <div key={absence.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{absence.eleve.user.name}</p>
                                        <p className="text-sm text-gray-500">{absence.eleve.classe?.nom || 'N/A'}</p>
                                    </div>
                                    <Badge variant={absence.est_justifiee ? "default" : "destructive"}>
                                        {absence.est_justifiee ? "Justifiée" : "Non justifiée"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link href="/absences">
                                <Button variant="outline" size="sm">Voir toutes les absences</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}