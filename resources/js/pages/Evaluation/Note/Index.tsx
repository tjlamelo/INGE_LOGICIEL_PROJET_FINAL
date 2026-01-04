import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { create as createNote } from '@/routes/notes';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { BarChart3, TrendingUp, Users, FileText, Plus } from 'lucide-react';

// --- Types ---
type Note = {
    id: number;
    valeur: number;
    type_evaluation: string | null;
    eleve_name: string; // Vient de la jointure
    matiere_nom: string; // Vient de la jointure
    classe_nom: string; // Vient de la jointure
    trimestre_nom: string; // Vient de la jointure
    sequence: number; // Vient de la jointure
    annee_scolaire: string; // Vient de la jointure
};

type PaginationLinks = { url: string | null; label: string; active: boolean };
type PaginatedNotes = {
    data: Note[];
    links: PaginationLinks[];
    from: number | null;
    to: number | null;
    total: number;
};

type NoteStats = {
    total_notes: number;
    average_grade: number;
    highest_grade: number;
    lowest_grade: number;
    passing_rate: number;
    notes_by_subject: Array<{ matiere_nom: string; count: number; average: number }>;
    notes_by_class: Array<{ classe_nom: string; count: number; average: number }>;
    notes_by_sequence: Array<{ sequence: number; count: number; average: number }>;
    notes_by_type: Array<{ type_evaluation: string; count: number; average: number }>;
    grade_distribution: {
        excellent: number; // 16-20
        good: number;       // 14-15.99
        satisfactory: number; // 12-13.99
        fair: number;       // 10-11.99
        insufficient: number; // 0-9.99
    };
};

type PageProps = {
    notes: PaginatedNotes;
    stats: NoteStats;
    flash: { success?: string; error?: string };
};

export default function NoteIndex() {
    const { notes, stats, flash } = usePage<PageProps>().props;
    const [showSuccessAlert, setShowSuccessAlert] =
        React.useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
        React.useState<boolean>(false);
    const [noteToDelete, setNoteToDelete] = React.useState<Note | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const openDeleteDialog = (note: Note) => {
        setNoteToDelete(note);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (noteToDelete) {
            router.delete(`/notes/${noteToDelete.id}`, {
                onSuccess: () => setIsDeleteDialogOpen(false),
                preserveScroll: true,
            });
        }
    };

    const getGradeBadgeVariant = (grade: number) => {
        if (grade >= 16) return "default";
        if (grade >= 14) return "secondary";
        if (grade >= 12) return "outline";
        if (grade >= 10) return "outline";
        return "destructive";
    };

    const getGradeLabel = (grade: number) => {
        if (grade >= 16) return "Excellent";
        if (grade >= 14) return "Bien";
        if (grade >= 12) return "Assez Bien";
        if (grade >= 10) return "Passable";
        return "Insuffisant";
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Évaluation', href: '#' },
                { title: 'Notes', href: '/notes' },
            ]}
        >
            <Head title="Mes Notes Saisies" />

            <div className="space-y-6 p-6">
                {showSuccessAlert && (
                    <Alert className="border-green-200 bg-green-50">
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Gestion des Notes
                        </h1>
                        <p className="text-sm text-gray-500">
                            Affichage de vos cours et évaluations uniquement.
                        </p>
                    </div>

                    <Link href={createNote()}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Saisir une Note
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_notes}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.average_grade.toFixed(2)}/20</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Note la + haute</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.highest_grade}/20</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Note la + basse</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.lowest_grade}/20</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.passing_rate.toFixed(1)}%</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Grade Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Répartition des Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="default">Excellent (16-20)</Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {stats.grade_distribution.excellent} notes
                                        </span>
                                    </div>
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${stats.total_notes > 0 ? (stats.grade_distribution.excellent / stats.total_notes) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="secondary">Bien (14-15.99)</Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {stats.grade_distribution.good} notes
                                        </span>
                                    </div>
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full" 
                                            style={{ width: `${stats.total_notes > 0 ? (stats.grade_distribution.good / stats.total_notes) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">Assez Bien (12-13.99)</Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {stats.grade_distribution.satisfactory} notes
                                        </span>
                                    </div>
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-yellow-600 h-2 rounded-full" 
                                            style={{ width: `${stats.total_notes > 0 ? (stats.grade_distribution.satisfactory / stats.total_notes) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">Passable (10-11.99)</Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {stats.grade_distribution.fair} notes
                                        </span>
                                    </div>
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-orange-600 h-2 rounded-full" 
                                            style={{ width: `${stats.total_notes > 0 ? (stats.grade_distribution.fair / stats.total_notes) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="destructive">Insuffisant (0-9.99)</Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {stats.grade_distribution.insufficient} notes
                                        </span>
                                    </div>
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-red-600 h-2 rounded-full" 
                                            style={{ width: `${stats.total_notes > 0 ? (stats.grade_distribution.insufficient / stats.total_notes) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes by Subject */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes par Matière</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.notes_by_subject.slice(0, 5).map((subject) => (
                                    <div key={subject.matiere_nom} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline">{subject.matiere_nom}</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {subject.count} note{subject.count > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">Moy: {subject.average.toFixed(2)}</span>
                                            <Badge variant={getGradeBadgeVariant(subject.average)}>
                                                {getGradeLabel(subject.average)}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {stats.notes_by_subject.length === 0 && (
                                    <p className="text-sm text-muted-foreground">Aucune matière trouvée</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Notes by Class */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes par Classe</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.notes_by_class.slice(0, 5).map((classe) => (
                                    <div key={classe.classe_nom} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline">{classe.classe_nom}</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {classe.count} note{classe.count > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">Moy: {classe.average.toFixed(2)}</span>
                                            <Badge variant={getGradeBadgeVariant(classe.average)}>
                                                {getGradeLabel(classe.average)}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {stats.notes_by_class.length === 0 && (
                                    <p className="text-sm text-muted-foreground">Aucune classe trouvée</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes by Sequence */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes par Séquence</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.notes_by_sequence.map((sequence) => (
                                    <div key={sequence.sequence} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline">Séquence {sequence.sequence}</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {sequence.count} note{sequence.count > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">Moy: {sequence.average.toFixed(2)}</span>
                                            <Badge variant={getGradeBadgeVariant(sequence.average)}>
                                                {getGradeLabel(sequence.average)}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {stats.notes_by_sequence.length === 0 && (
                                    <p className="text-sm text-muted-foreground">Aucune séquence trouvée</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader><CardTitle>Toutes les notes</CardTitle></CardHeader>
                    <CardContent className="pt-6">
                        <div className="relative overflow-x-auto rounded-lg border">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-gray-50 text-xs text-gray-700 uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Élève</th>
                                        <th className="px-6 py-3">Classe</th>
                                        <th className="px-6 py-3">Matière</th>
                                        <th className="px-6 py-3">Seq.</th>
                                        <th className="px-6 py-3 text-center">
                                            Note / 20
                                        </th>
                                        <th className="px-6 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notes.data.map((note) => (
                                        <tr
                                            key={note.id}
                                            className="border-b bg-white hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {note.eleve_name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {note.classe_nom}
                                            </td>
                                            <td className="px-6 py-4">
                                                {note.matiere_nom}
                                            </td>
                                            <td className="px-6 py-4">
                                                S{note.sequence}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`rounded px-2 py-1 font-bold ${note.valeur < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                                                >
                                                    {note.valeur}
                                                </span>
                                            </td>
                                            <td className="space-x-1 px-6 py-4 text-right">
                                                <Link
                                                    href={`/notes/${note.id}/edit`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        Modifier
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() =>
                                                        openDeleteDialog(note)
                                                    }
                                                >
                                                    Supprimer
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {notes.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-10 text-center text-gray-500"
                                            >
                                                Aucune note enregistrée pour vos
                                                cours.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {notes.links && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Affichage de {notes.from || 0} à{' '}
                                    {notes.to || 0} sur {notes.total} résultats
                                </div>
                                <div className="flex space-x-1">
                                    {notes.links.map(
                                        (
                                            link: PaginationLinks,
                                            index: number,
                                        ) =>
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`rounded border px-3 py-2 text-sm leading-tight ${link.active ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="cursor-not-allowed rounded border border-gray-300 px-3 py-2 text-sm leading-tight text-gray-500"
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ),
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}