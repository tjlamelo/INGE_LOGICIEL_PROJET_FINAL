import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GuestDashboardProps {
    data: any;
    userName: string;
}

export default function GuestDashboard({ data, userName }: GuestDashboardProps) {
    const { general_info, public_info } = data;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tableau de bord invité</h1>
                <Badge variant="outline" className="text-sm">
                    Bienvenue, {userName}
                </Badge>
            </div>

            {/* Informations générales */}
            <Card>
                <CardHeader>
                    <CardTitle>Informations Générales</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Établissement</p>
                            <p className="font-medium">{general_info.school_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Trimestre Actif</p>
                            <p className="font-medium">{general_info.active_trimestre?.nom || 'N/A'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Informations publiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{public_info.total_classes}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Matières</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{public_info.total_subjects}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Accès Limité</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">
                        Vous êtes actuellement connecté en tant qu'invité avec un accès limité. 
                        Pour accéder à plus d'informations, veuillez contacter l'administrateur.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}