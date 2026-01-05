import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';

// --- Types ---
type Certificat = {
    id: number;
    eleve_id: number;
    annee_scolaire: string;
    numero_certificat: string;
    statut: 'brouillon' | 'valide';
    date_generation: string;
    date_signature: string | null;
    signe_par: string | null; // Correction: signe_par au lieu de signe_par
    chemin_pdf: string | null;
    eleve: {
        id: number;
        user: {
            name: string;
            email: string;
        };
    };
    statut_formatted: string;
    pdf_url: string | null;
};

type PaginationLinks = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedCertificats = {
    data: Certificat[];
    links: PaginationLinks[];
    from: number | null;
    to: number | null;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

type IndexProps = {
    certificats: PaginatedCertificats; // Utiliser le type paginé
    filters: {
        statut?: string;
        annee_scolaire?: string;
        search?: string;
    };
    anneesScolaires: string[];
};

export default function CertificatIndex({ certificats, filters, anneesScolaires }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statutFilter, setStatutFilter] = useState(filters.statut || '');
    const [anneeFilter, setAnneeFilter] = useState(filters.annee_scolaire || '');

    const handleSearch = () => {
        router.get('/certificats', {
            search: searchTerm,
            statut: statutFilter,
            annee_scolaire: anneeFilter,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce certificat ?')) {
            router.delete(`/certificats/${id}`);
        }
    };

    const handleValidate = (id: number) => {
        const signePar = prompt('Veuillez entrer le nom du signataire :');
        if (signePar) {
            router.post(`/certificats/${id}/valider`, { signePar });
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Académique', href: '#' },
                { title: 'Certificats', href: '/certificats' },
            ]}
        >
            <Head title="Certificats de scolarité" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Certificats de scolarité</h1>
                        <Link href="/certificats/create">
                            <Button>Nouveau certificat</Button>
                        </Link>
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Filtrer les certificats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Rechercher un élève..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-48">
                                    <Select value={statutFilter} onValueChange={setStatutFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Tous</SelectItem>
                                            <SelectItem value="brouillon">Brouillon</SelectItem>
                                            <SelectItem value="valide">Validé</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full md:w-48">
                                    <Select value={anneeFilter} onValueChange={setAnneeFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Année scolaire" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Toutes</SelectItem>
                                            {anneesScolaires.map((annee) => (
                                                <SelectItem key={annee} value={annee}>{annee}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleSearch}>Filtrer</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Numéro</th>
                                            <th scope="col" className="px-6 py-3">Élève</th>
                                            <th scope="col" className="px-6 py-3">Année scolaire</th>
                                            <th scope="col" className="px-6 py-3">Statut</th>
                                            <th scope="col" className="px-6 py-3">Date de génération</th>
                                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {certificats.data.map((certificat) => (
                                            <tr key={certificat.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {certificat.numero_certificat}
                                                </td>
                                                <td className="px-6 py-4">{certificat.eleve.user.name}</td>
                                                <td className="px-6 py-4">{certificat.annee_scolaire}</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={certificat.statut === 'valide' ? 'default' : 'secondary'}>
                                                        {certificat.statut_formatted}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(certificat.date_generation).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <Link href={`/certificats/${certificat.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/certificats/${certificat.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {certificat.statut === 'brouillon' ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleValidate(certificat.id)}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <Link href={`/certificats/${certificat.id}/download`}>
                                                            <Button variant="outline" size="sm">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(certificat.id)}
                                                        disabled={certificat.statut === 'valide'}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {certificats.links && (
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-700">
                                Affichage de {certificats.from || 0} à {certificats.to || 0} sur {certificats.total} résultats
                            </div>
                            <div className="flex space-x-1">
                                {certificats.links.map((link, index) => (
                                    link.url ? (
                                        <Link key={index} href={link.url} className={`px-3 py-2 text-sm leading-tight border rounded ${link.active ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ) : (
                                        <span key={index} className="px-3 py-2 text-sm leading-tight text-gray-500 border border-gray-300 rounded cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}