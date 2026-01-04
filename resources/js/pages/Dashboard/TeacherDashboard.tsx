import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface TeacherDashboardProps {
    data: any;
    userName: string;
}

export default function TeacherDashboard({ data, userName }: TeacherDashboardProps) {
    // Vérification si les données existent
    if (!data) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Chargement des données...</p>
            </div>
        );
    }

    const { teacher_info, teaching_info, recent_activities } = data;

    // Fonction pour afficher en toute sécurité une valeur ou un message par défaut
    const safeValue = (value: any, defaultValue: string = 'Non spécifié') => {
        return value !== undefined && value !== null ? value : defaultValue;
    };

    // Fonction pour afficher en toute sécurité un tableau ou un tableau vide
    const safeArray = (value: any) => {
        return Array.isArray(value) ? value : [];
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tableau de bord enseignant</h1>
                <Badge variant="outline" className="text-sm">
                    Bienvenue, {userName || 'Enseignant'}
                </Badge>
            </div>

            {/* Informations de l'enseignant */}
            <Card>
                <CardHeader>
                    <CardTitle>Mes Informations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Nom</p>
                            <p className="font-medium">{safeValue(teacher_info?.name)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Spécialité</p>
                            <p className="font-medium">{safeValue(teacher_info?.speciality)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Grade</p>
                            <p className="font-medium">{safeValue(teacher_info?.grade)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Informations d'enseignement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Mes Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {safeArray(teaching_info?.classes).length > 0 ? (
                                safeArray(teaching_info?.classes).map((className: string, index: number) => (
                                    <Badge key={index} variant="outline">{className}</Badge>
                                ))
                            ) : (
                                <p className="text-gray-500">Aucune classe assignée</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Mes Matières</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {safeArray(teaching_info?.subjects).length > 0 ? (
                                safeArray(teaching_info?.subjects).map((subjectName: string, index: number) => (
                                    <Badge key={index} variant="outline">{subjectName}</Badge>
                                ))
                            ) : (
                                <p className="text-gray-500">Aucune matière assignée</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notes récentes saisies */}
            <Card>
                <CardHeader>
                    <CardTitle>Notes Récemment Saisies</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {safeArray(recent_activities?.recent_notes).length > 0 ? (
                            safeArray(recent_activities?.recent_notes).map((note: any) => (
                                <div key={note.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">
                                            {safeValue(note?.eleve?.user?.name, 'Élève inconnu')}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {safeValue(note?.enseignement?.matiere?.nom, 'Matière inconnue')}
                                        </p>
                                    </div>
                                    <Badge variant={note?.valeur >= 10 ? "default" : "destructive"}>
                                        {note?.valeur || 0}/20
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Aucune note saisie récemment</p>
                        )}
                    </div>
                    <div className="mt-4">
                        <Link href="/notes">
                            <Button variant="outline" size="sm">Gérer toutes les notes</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
                <CardHeader>
                    <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/notes/create">
                            <Button>Saisir une note</Button>
                        </Link>
                        <Link href="/absences">
                            <Button variant="outline">Signaler une absence</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}