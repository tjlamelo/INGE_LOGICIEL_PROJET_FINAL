import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface StudentDashboardProps {
    data: any;
    userName: string;
}

export default function StudentDashboard({ data, userName }: StudentDashboardProps) {
    const { student_info, academic_info, attendance_info } = data;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Mon Tableau de bord</h1>
                <Badge variant="outline" className="text-sm">
                    Bienvenue, {userName}
                </Badge>
            </div>

            {/* Informations de l'élève */}
            <Card>
                <CardHeader>
                    <CardTitle>Mes Informations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Nom</p>
                            <p className="font-medium">{student_info.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Classe</p>
                            <p className="font-medium">{student_info.class}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Matricule</p>
                            <p className="font-medium">{student_info.matricule}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notes récentes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mes Notes Récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {academic_info.recent_notes.map((note: any) => (
                                <div key={note.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{note.enseignement.matiere.nom}</p>
                                        <p className="text-sm text-gray-500">{note.trimestre.nom}</p>
                                    </div>
                                    <Badge variant={note.valeur >= 10 ? "default" : "destructive"}>
                                        {note.valeur}/20
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link href="/mes-notes">
                                <Button variant="outline" size="sm">Voir toutes mes notes</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Absences récentes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mes Absences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Total d'heures manquées</p>
                            <p className="text-xl font-bold text-red-600">{attendance_info.total_absences}h</p>
                        </div>
                        <div className="space-y-4">
                            {attendance_info.recent_absences.map((absence: any) => (
                                <div key={absence.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{new Date(absence.date_absence).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-500">{absence.nombre_d_heures_manquees}h</p>
                                    </div>
                                    <Badge variant={absence.est_justifiee ? "default" : "destructive"}>
                                        {absence.est_justifiee ? "Justifiée" : "Non justifiée"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dernier bulletin */}
            {academic_info.latest_bulletin && (
                <Card>
                    <CardHeader>
                        <CardTitle>Dernier Bulletin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{academic_info.latest_bulletin.trimestre.nom}</p>
                                <p className="text-sm text-gray-500">
                                    Moyenne générale: {academic_info.latest_bulletin.moyenne_generale}/20
                                </p>
                            </div>
                            <Badge variant={academic_info.latest_bulletin.est_valide ? "default" : "secondary"}>
                                {academic_info.latest_bulletin.est_valide ? "Validé" : "En attente"}
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <Link href={`/bulletins/${academic_info.latest_bulletin.id}`}>
                                <Button variant="outline" size="sm">Voir le bulletin</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}