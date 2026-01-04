import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

// --- Types ---
type MoyenneMatiere = {
    matiere: string;
    groupe: number;
    coeff: number;
    moyenne: number;
    total: number;
    mgc: number;
    min: number;
    max: number;
    rang: number;
    enseignant: string;
    matiere_id?: number;
};

type SequenceMatiere = {
    matiere_id: number;
    matiere: string;
    moyenne: number;
    coefficient: number;
};

type StatsSequences = {
    [sequenceId: number]: { [matiereId: number]: SequenceMatiere };
};

type ProfilClasse = {
    moy_gen: number;
    moy_premier: number;
    moy_dernier: number;
    taux_reussite: number;
    ecart_type: number;
};

type Bulletin = {
    id: number;
    moyenne_generale: number;
    rang: number;
    effectif_classe: number;
    appreciation_generale: string | null;
    est_valide: boolean;
    date_generation: string;
    moyennes_matieres: MoyenneMatiere[];
    stats_sequences: StatsSequences | null;
    profil_classe: ProfilClasse;
};

type Eleve = {
    id: number;
    user: { name: string };
    classe: {
        nom: string;
        titulaire?: {
            user: { name: string };
        };
    };
};

type Trimestre = {
    id: number;
    nom: string;
    annee_scolaire: string;
};

type ShowProps = {
    bulletin: Bulletin;
    eleve: Eleve;
    trimestre: Trimestre;
    moyennesMatieres: MoyenneMatiere[];
    profilClasse: ProfilClasse;
};

export default function BulletinShow({
    bulletin,
    eleve,
    trimestre,
    moyennesMatieres,
    profilClasse,
}: ShowProps) {
    console.log('Bulletin reçu:', bulletin);
    console.log('Stats sequences:', bulletin.stats_sequences);
    console.log('Trimestre:', trimestre);
    console.log('Moyennes matières:', moyennesMatieres);

    // Sécuriser les données des séquences
    const statsSequences = bulletin.stats_sequences || {};

    // Déterminer les séquences à afficher pour ce trimestre
    const getSequencesByTrimestre = (nomTrimestre: string): number[] => {
        switch (nomTrimestre) {
            case '1er Trimestre':
                return [1, 2];
            case '2ème Trimestre':
                return [3, 4];
            case '3ème Trimestre':
                return [5, 6];
            default:
                return [1, 2];
        }
    };

    const sequences = getSequencesByTrimestre(trimestre.nom);
    console.log('Séquences à afficher:', sequences);

    // Fonction pour récupérer la note d'une matière pour une séquence donnée
    const getNoteBySequenceAndMatiere = (
        sequenceId: number,
        matiereId: number,
    ): string => {
        if (
            !statsSequences[sequenceId] ||
            !statsSequences[sequenceId][matiereId]
        ) {
            return '-';
        }

        const noteVal = statsSequences[sequenceId][matiereId].moyenne;

        // Vérifie si c'est un nombre valide avant le toFixed
        return typeof noteVal === 'number'
            ? noteVal.toFixed(2)
            : parseFloat(noteVal).toFixed(2);
    };

    // Regrouper les matières par groupe
    const matieresParGroupe = moyennesMatieres.reduce(
        (acc, matiere) => {
            if (!acc[matiere.groupe]) {
                acc[matiere.groupe] = [];
            }
            acc[matiere.groupe].push(matiere);
            return acc;
        },
        {} as Record<number, MoyenneMatiere[]>,
    );

    // Calculer les totaux par groupe
    const totauxParGroupe = Object.entries(matieresParGroupe).map(
        ([groupe, matieres]) => {
            const totalCoeff = matieres.reduce((sum, m) => sum + m.coeff, 0);
            const totalPoints = matieres.reduce((sum, m) => sum + m.total, 0);
            const moyenneGroupe =
                totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : '0.00';

            return {
                groupe: parseInt(groupe),
                totalCoeff,
                totalPoints,
                moyenneGroupe,
            };
        },
    );

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Évaluation', href: '#' },
                { title: 'Bulletins', href: '/bulletins' },
                {
                    title: `Bulletin de ${eleve.user.name}`,
                    href: `/bulletins/${eleve.id}/${trimestre.id}`,
                },
            ]}
        >
            <Head title={`Bulletin de ${eleve.user.name} - ${trimestre.nom}`} />

            <div className="mb-4 flex items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <Link href="/bulletins">
                        <Button variant="outline">Retour</Button>
                    </Link>
                    <Link href={`/bulletins/${bulletin.id}/edit`}>
                        <Button variant="outline">Modifier</Button>
                    </Link>
                </div>
                <Link href={`/bulletins/${eleve.id}/${trimestre.id}/pdf`}>
                    <Button>Télécharger PDF</Button>
                </Link>
            </div>

            <div className="flex min-h-screen justify-center bg-gray-100 py-8 print:bg-white print:p-0">
                {/* Container A4 principal avec flex-col pour étirer les blocs */}
                <div className="flex min-h-[297mm] w-[210mm] flex-col border border-gray-400 bg-white p-6 font-sans text-[9px] shadow-xl">
                    {/* EN-TÊTE BILINGUE */}
                    <div className="mb-4 flex justify-between text-center leading-tight">
                        <div className="w-[40%] uppercase">
                            <p className="font-bold">République du Cameroun</p>
                            <p className="text-[7px] lowercase italic">
                                Paix-Travail-Patrie
                            </p>
                            <p className="mt-1 text-[8px]">
                                Ministère des Enseignements Secondaires
                            </p>
                            <p className="font-bold">
                                Collège Catholique Bilingue Saint Benoit
                            </p>
                            <p className="text-[7px] italic">
                                Le savoir sur la colline
                            </p>
                            <p className="text-[7px]">
                                BP : 4018 Yaoundé - Tel : 222 317 747
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex h-14 w-14 items-center justify-center border-2 border-black font-bold">
                                LOGO
                            </div>
                            <p className="mt-1 border-b border-black text-[10px] font-bold italic">
                                Année scolaire : {trimestre.annee_scolaire}
                            </p>
                        </div>
                        <div className="w-[40%] uppercase">
                            <p className="font-bold">Republic of Cameroon</p>
                            <p className="text-[7px] lowercase italic">
                                Peace-Work-Fatherland
                            </p>
                            <p className="mt-1 text-[8px]">
                                Ministry of Secondary Education
                            </p>
                            <p className="font-bold">
                                Saint Benedict Catholic Bilingual College
                            </p>
                            <p className="text-[7px] italic">
                                Knowledge on the hill
                            </p>
                            <p className="text-[7px]">
                                PO Box: 4018 Yaoundé / Phone: 222 317 747
                            </p>
                        </div>
                    </div>

                    {/* SECTION INFOS ÉLÈVE */}
                    <div className="relative mb-4 border-2 border-black">
                        <h2 className="border-b-2 border-black bg-gray-50 py-1 text-center text-[14px] font-bold uppercase italic">
                            Bulletin de notes du {trimestre.nom}
                        </h2>
                        <div className="grid grid-cols-12 gap-2 p-2 text-[10px]">
                            <div className="col-span-4 leading-relaxed">
                                <p>
                                    <strong>Classe :</strong> {eleve.classe.nom}
                                </p>
                                <p>
                                    <strong>Matricule :</strong> 24SB552
                                </p>
                                <p>
                                    <strong>Né le :</strong> 10/05/2012 à
                                    YAOUNDE
                                </p>
                            </div>
                            <div className="col-span-5 border-l border-gray-300 pl-4 leading-relaxed">
                                <p>
                                    <strong>Effectif :</strong>{' '}
                                    {bulletin.effectif_classe}
                                </p>
                                <p>
                                    <strong>Nom & prénom :</strong>{' '}
                                    <span className="text-[12px] font-black uppercase">
                                        {eleve.user.name}
                                    </span>
                                </p>
                            </div>
                            <div className="col-span-3 border-l border-gray-300 pl-4 leading-relaxed">
                                <p>
                                    <strong>Prof. Principal :</strong>{' '}
                                    {eleve.classe.titulaire?.user?.name ||
                                        'Non défini'}
                                </p>
                                <p>
                                    <strong>Tél parent :</strong> 6XX XX XX XX
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TABLEAU DES NOTES */}
                    <table className="w-full border-collapse border-2 border-black text-center text-[9px]">
                        <thead className="bg-gray-100 font-bold">
                            <tr className="h-8">
                                <th className="w-[20%] border border-black p-1 text-left">
                                    Matières
                                </th>
                                {/* Afficher dynamiquement les séquences du trimestre */}
                                {sequences.map((seqId) => (
                                    <th
                                        key={seqId}
                                        className="border border-black"
                                    >
                                        S{seqId}
                                    </th>
                                ))}
                                <th className="border border-black">Moy</th>
                                <th className="w-[4%] border border-black">
                                    Cf
                                </th>
                                <th className="border border-black">Total</th>
                                <th className="border border-black">Rg</th>
                                <th className="border border-black">MGC</th>
                                <th className="border border-black">Min</th>
                                <th className="border border-black">Max</th>
                                <th className="w-[15%] border border-black">
                                    Enseignants
                                </th>
                                <th className="w-[12%] border border-black">
                                    Appréciations
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(matieresParGroupe).map(
                                ([groupe, matieres]) => (
                                    <React.Fragment key={groupe}>
                                        {matieres.map((matiere) => (
                                            <tr
                                                key={matiere.matiere}
                                                className="h-7 border-b border-gray-300"
                                            >
                                                <td className="border-x border-black pl-2 text-left font-bold uppercase">
                                                    {matiere.matiere}
                                                </td>
                                                {/* Afficher dynamiquement les notes pour chaque séquence du trimestre */}
                                                {sequences.map((seqId) => (
                                                    <td
                                                        key={seqId}
                                                        className="border-x border-black"
                                                    >
                                                        {getNoteBySequenceAndMatiere(
                                                            seqId,
                                                            matiere.matiere_id ||
                                                                0,
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="border-x border-black text-[10px] font-bold">
                                                    {matiere.moyenne}
                                                </td>
                                                <td className="border-x border-black font-bold">
                                                    {matiere.coeff}
                                                </td>
                                                <td className="border-x border-black font-bold">
                                                    {matiere.total}
                                                </td>
                                                <td className="border-x border-black italic">
                                                    {matiere.rang}e
                                                </td>
                                                <td className="border-x border-black">
                                                    {matiere.mgc}
                                                </td>
                                                <td className="border-x border-black text-red-600">
                                                    {matiere.min}
                                                </td>
                                                <td className="border-x border-black text-green-700">
                                                    {matiere.max}
                                                </td>
                                                <td className="border-x border-black text-[7px] leading-none uppercase">
                                                    {matiere.enseignant}
                                                </td>
                                                <td className="border-x border-black font-medium italic">
                                                    {matiere.moyenne >= 14
                                                        ? 'Excellent'
                                                        : matiere.moyenne >= 12
                                                          ? 'Très Bien'
                                                          : matiere.moyenne >=
                                                              10
                                                            ? 'Bien'
                                                            : matiere.moyenne >=
                                                                8
                                                              ? 'Passable'
                                                              : 'Insuffisant'}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="h-7 border-y-2 border-black bg-gray-100 font-bold italic">
                                            <td
                                                colSpan={1 + sequences.length}
                                                className="border border-black pr-2 text-right"
                                            >
                                                Résumé Groupe {groupe} :
                                            </td>
                                            <td className="border border-black">
                                                {
                                                    totauxParGroupe.find(
                                                        (t) =>
                                                            t.groupe ===
                                                            parseInt(groupe),
                                                    )?.totalCoeff
                                                }
                                            </td>
                                            <td className="border border-black">
                                                {Number(
                                                    totauxParGroupe.find(
                                                        (t) =>
                                                            t.groupe ===
                                                            parseInt(groupe),
                                                    )?.totalPoints || 0,
                                                ).toFixed(2)}
                                            </td>
                                            <td
                                                colSpan={5}
                                                className="border border-black pr-4 text-right uppercase"
                                            >
                                                Moyenne Groupe {groupe} :
                                            </td>
                                            <td className="border border-black text-[10px] font-black">
                                                {
                                                    totauxParGroupe.find(
                                                        (t) =>
                                                            t.groupe ===
                                                            parseInt(groupe),
                                                    )?.moyenneGroupe
                                                }
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ),
                            )}
                            {Object.keys(matieresParGroupe).length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8 + sequences.length}
                                        className="px-6 py-10 text-center text-gray-500"
                                    >
                                        Aucune matière trouvée pour ce bulletin.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* SECTION STATISTIQUES (Disciplines / Travail / Profil) */}
                    <div className="mt-4 flex h-36 gap-2">
                        <div className="w-[35%] overflow-hidden border border-black">
                            <table className="h-full w-full text-[8px]">
                                <thead className="border-b border-black bg-gray-100 font-bold">
                                    <tr>
                                        <th className="p-1 text-left uppercase">
                                            Disciplines
                                        </th>
                                        {/* Afficher dynamiquement les séquences du trimestre */}
                                        {sequences.map((seqId) => (
                                            <th
                                                key={seqId}
                                                className="border-l border-black"
                                            >
                                                S{seqId}
                                            </th>
                                        ))}
                                        <th className="border-l border-black">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black">
                                    <tr>
                                        <td className="pl-1">
                                            Absences non j.
                                        </td>
                                        {sequences.map((seqId) => (
                                            <td
                                                key={seqId}
                                                className="border-l border-black text-center"
                                            >
                                                0
                                            </td>
                                        ))}
                                        <td className="border-l border-black text-center">
                                            0
                                        </td>
                                    </tr>
                                    <tr className="font-bold">
                                        <td className="pl-1">
                                            Blâmes conduite
                                        </td>
                                        <td
                                            colSpan={sequences.length + 1}
                                            className="border-l border-black text-center italic"
                                        >
                                            NON
                                        </td>
                                    </tr>
                                    <tr className="font-bold">
                                        <td className="pl-1 uppercase">
                                            Avert. conduite
                                        </td>
                                        <td
                                            colSpan={sequences.length + 1}
                                            className="border-l border-black text-center italic"
                                        >
                                            NON
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex w-[35%] flex-col border-2 border-black text-center">
                            <div className="border-b-2 border-black bg-gray-100 p-1 font-bold uppercase">
                                Travail de l'élève
                            </div>
                            <div className="flex flex-grow flex-col justify-center space-y-2 p-2">
                                <p className="text-[12px] leading-none font-black text-blue-900 uppercase italic">
                                    Moyenne : {bulletin.moyenne_generale} / 20
                                </p>
                                <p className="text-[11px] font-bold">
                                    Rang : {bulletin.rang}e /{' '}
                                    {bulletin.effectif_classe}
                                </p>
                            </div>
                        </div>

                        <div className="flex w-[30%] flex-col border border-black">
                            <div className="border-b border-black bg-gray-100 p-1 text-center font-bold uppercase">
                                Profil de la classe
                            </div>
                            <div className="space-y-1 p-2 text-[8px]">
                                <div className="flex justify-between">
                                    <span>Moy gen :</span>{' '}
                                    <span>{profilClasse?.moy_gen || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Moy premier :</span>{' '}
                                    <span>
                                        {profilClasse?.moy_premier || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Taux réussite :</span>{' '}
                                    <span>
                                        {profilClasse?.taux_reussite || 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BLOCS SIGNATURES - Prend l'espace restant */}
                    <div className="mt-4 grid min-h-[160px] flex-grow grid-cols-3 divide-x-2 divide-black border-2 border-black">
                        <div className="flex flex-col p-3">
                            <p className="mb-2 text-[10px] font-black uppercase italic underline">
                                Appréciation du travail
                            </p>
                            <div className="flex-grow text-[12px] leading-relaxed font-medium text-blue-800 italic">
                                {bulletin.appreciation_generale ||
                                    'Aucune appréciation'}
                            </div>
                        </div>

                        <div className="p-3">
                            <p className="text-center text-[10px] font-black uppercase italic underline">
                                Visa du professeur principal
                            </p>
                        </div>

                        <div className="relative flex flex-col justify-between p-3 text-center">
                            <p className="text-[10px] font-black uppercase italic underline">
                                Signature du Chef d'Établissement
                            </p>
                            <div className="mb-6">
                                <p className="text-[11px] font-bold italic">
                                    Yaoundé, le{' '}
                                    {new Date(
                                        bulletin.date_generation,
                                    ).toLocaleDateString()}
                                </p>
                                {/* Cachet institutionnel */}
                                <div className="absolute right-6 bottom-6 flex h-28 w-28 rotate-12 items-center justify-center rounded-full border-4 border-double border-red-600 p-2 text-[10px] font-black text-red-700 uppercase opacity-25">
                                    <span className="text-center italic">
                                        Collège Catholique
                                        <br />
                                        St Benoit
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VISA PARENT - Collé tout en bas */}
                    <div className="mt-4 min-h-[80px] border-2 border-black p-4 text-[11px] font-black uppercase italic">
                        Visa du parent :
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
