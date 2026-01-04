import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

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
    stats_sequences: Record<number, number>;
    profil_classe: ProfilClasse;
};

type Eleve = {
    id: number;
    user: { name: string };
    classe: {
        nom: string;
        enseignantPrincipal?: {
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

export default function BulletinShow({ bulletin, eleve, trimestre, moyennesMatieres, profilClasse }: ShowProps) {
    // Regrouper les matières par groupe
    const matieresParGroupe = moyennesMatieres.reduce((acc, matiere) => {
        if (!acc[matiere.groupe]) {
            acc[matiere.groupe] = [];
        }
        acc[matiere.groupe].push(matiere);
        return acc;
    }, {} as Record<number, MoyenneMatiere[]>);

    // Calculer les totaux par groupe
    const totauxParGroupe = Object.entries(matieresParGroupe).map(([groupe, matieres]) => {
        const totalCoeff = matieres.reduce((sum, m) => sum + m.coeff, 0);
        const totalPoints = matieres.reduce((sum, m) => sum + m.total, 0);
        const moyenneGroupe = totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : '0.00';
        
        return {
            groupe: parseInt(groupe),
            totalCoeff,
            totalPoints,
            moyenneGroupe
        };
    });

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Évaluation', href: '#' },
                { title: 'Bulletins', href: '/bulletins' },
                { title: `Bulletin de ${eleve.user.name}`, href: `/bulletins/${eleve.id}/${trimestre.id}` },
            ]}
        >
            <Head title={`Bulletin de ${eleve.user.name} - ${trimestre.nom}`} />
            
            <div className="flex justify-between items-center mb-4 px-6">
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

            <div className="bg-gray-100 min-h-screen py-8 print:p-0 print:bg-white flex justify-center">
                {/* Container A4 principal avec flex-col pour étirer les blocs */}
                <div className="bg-white w-[210mm] min-h-[297mm] p-6 shadow-xl text-[9px] font-sans border border-gray-400 flex flex-col">
                    
                    {/* EN-TÊTE BILINGUE */}
                    <div className="flex justify-between text-center leading-tight mb-4">
                        <div className="w-[40%] uppercase">
                            <p className="font-bold">République du Cameroun</p>
                            <p className="italic text-[7px] lowercase">Paix-Travail-Patrie</p>
                            <p className="mt-1 text-[8px]">Ministère des Enseignements Secondaires</p>
                            <p className="font-bold">Collège Catholique Bilingue Saint Benoit</p>
                            <p className="italic text-[7px]">Le savoir sur la colline</p>
                            <p className="text-[7px]">BP : 4018 Yaoundé - Tel : 222 317 747</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-14 h-14 border-2 border-black flex items-center justify-center font-bold">LOGO</div>
                            <p className="mt-1 font-bold italic border-b border-black text-[10px]">Année scolaire : {trimestre.annee_scolaire}</p>
                        </div>
                        <div className="w-[40%] uppercase">
                            <p className="font-bold">Republic of Cameroon</p>
                            <p className="italic text-[7px] lowercase">Peace-Work-Fatherland</p>
                            <p className="mt-1 text-[8px]">Ministry of Secondary Education</p>
                            <p className="font-bold">Saint Benedict Catholic Bilingual College</p>
                            <p className="italic text-[7px]">Knowledge on the hill</p>
                            <p className="text-[7px]">PO Box: 4018 Yaoundé / Phone: 222 317 747</p>
                        </div>
                    </div>

                    {/* SECTION INFOS ÉLÈVE */}
                    <div className="border-2 border-black mb-4 relative">
                        <h2 className="text-center font-bold text-[14px] border-b-2 border-black py-1 uppercase italic bg-gray-50">
                            Bulletin de notes du {trimestre.nom}
                        </h2>
                        <div className="grid grid-cols-12 p-2 gap-2 text-[10px]">
                            <div className="col-span-4 leading-relaxed">
                                <p><strong>Classe :</strong> {eleve.classe.nom}</p>
                                <p><strong>Matricule :</strong> 24SB552</p>
                                <p><strong>Né le :</strong> 10/05/2012 à YAOUNDE</p>
                            </div>
                            <div className="col-span-5 leading-relaxed border-l border-gray-300 pl-4">
                                <p><strong>Effectif :</strong> {bulletin.effectif_classe}</p>
                                <p><strong>Nom & prénom :</strong> <span className="uppercase font-black text-[12px]">{eleve.user.name}</span></p>
                            </div>
                            <div className="col-span-3 leading-relaxed border-l border-gray-300 pl-4">
                                <p><strong>Prof. Principal :</strong> {eleve.classe.enseignantPrincipal?.user?.name || 'Non défini'}</p>
                                <p><strong>Tél parent :</strong> 6XX XX XX XX</p>
                            </div>
                        </div>
                    </div>

                    {/* TABLEAU DES NOTES */}
                    <table className="w-full border-collapse border-2 border-black text-center text-[9px]">
                        <thead className="bg-gray-100 font-bold">
                            <tr className="h-8">
                                <th className="border border-black p-1 text-left w-[20%]">Matières</th>
                                <th className="border border-black">S5</th>
                                <th className="border border-black">S6</th>
                                <th className="border border-black">Moy</th>
                                <th className="border border-black w-[4%]">Cf</th>
                                <th className="border border-black">Total</th>
                                <th className="border border-black">Rg</th>
                                <th className="border border-black">MGC</th>
                                <th className="border border-black">Min</th>
                                <th className="border border-black">Max</th>
                                <th className="border border-black w-[15%]">Enseignants</th>
                                <th className="border border-black w-[12%]">Appréciations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(matieresParGroupe).map(([groupe, matieres]) => (
                                <React.Fragment key={groupe}>
                                    {matieres.map((matiere, index) => (
                                        <tr key={matiere.matiere} className="h-7 border-b border-gray-300">
                                            <td className="border-x border-black text-left pl-2 font-bold uppercase">{matiere.matiere}</td>
                                            <td className="border-x border-black">{bulletin.stats_sequences[5] || '-'}</td>
                                            <td className="border-x border-black">{bulletin.stats_sequences[6] || '-'}</td>
                                            <td className="border-x border-black font-bold text-[10px]">{matiere.moyenne}</td>
                                            <td className="border-x border-black font-bold">{matiere.coeff}</td>
                                            <td className="border-x border-black font-bold">{matiere.total}</td>
                                            <td className="border-x border-black italic">{matiere.rang}e</td>
                                            <td className="border-x border-black">{matiere.mgc}</td>
                                            <td className="border-x border-black text-red-600">{matiere.min}</td>
                                            <td className="border-x border-black text-green-700">{matiere.max}</td>
                                            <td className="border-x border-black text-[7px] uppercase leading-none">{matiere.enseignant}</td>
                                            <td className="border-x border-black italic font-medium">
                                                {matiere.moyenne >= 14 ? 'Excellent' : 
                                                 matiere.moyenne >= 12 ? 'Très Bien' : 
                                                 matiere.moyenne >= 10 ? 'Bien' : 
                                                 matiere.moyenne >= 8 ? 'Passable' : 'Insuffisant'}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-100 font-bold italic border-y-2 border-black h-7">
                                        <td colSpan={4} className="border border-black text-right pr-2">Résumé Groupe {groupe} :</td>
                                        <td className="border border-black">{totauxParGroupe.find(t => t.groupe === parseInt(groupe))?.totalCoeff}</td>
                                        <td className="border border-black">{totauxParGroupe.find(t => t.groupe === parseInt(groupe))?.totalPoints}</td>
                                        <td colSpan={5} className="border border-black text-right pr-4 uppercase">Moyenne Groupe {groupe} :</td>
                                        <td className="border border-black font-black text-[10px]">{totauxParGroupe.find(t => t.groupe === parseInt(groupe))?.moyenneGroupe}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    {/* SECTION STATISTIQUES (Disciplines / Travail / Profil) */}
                    <div className="mt-4 flex gap-2 h-36">
                        <div className="w-[35%] border border-black overflow-hidden">
                            <table className="w-full text-[8px] h-full">
                                <thead className="bg-gray-100 font-bold border-b border-black">
                                    <tr><th className="p-1 text-left uppercase">Disciplines</th><th className="border-l border-black">S5</th><th className="border-l border-black">S6</th><th className="border-l border-black">Total</th></tr>
                                </thead>
                                <tbody className="divide-y divide-black">
                                    <tr><td className="pl-1">Absences non j.</td><td className="text-center border-l border-black">0</td><td className="text-center border-l border-black">0</td><td className="text-center border-l border-black">0</td></tr>
                                    <tr className="font-bold"><td className="pl-1">Blâmes conduite</td><td colSpan={3} className="text-center border-l border-black italic">NON</td></tr>
                                    <tr className="font-bold"><td className="pl-1 uppercase">Avert. conduite</td><td colSpan={3} className="text-center border-l border-black italic">NON</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="w-[35%] border-2 border-black flex flex-col text-center">
                            <div className="bg-gray-100 border-b-2 border-black font-bold p-1 uppercase">Travail de l'élève</div>
                            <div className="p-2 flex-grow flex flex-col justify-center space-y-2">
                                <p className="text-[12px] font-black uppercase italic text-blue-900 leading-none">Moyenne : {bulletin.moyenne_generale} / 20</p>
                                <p className="text-[11px] font-bold">Rang : {bulletin.rang}e / {bulletin.effectif_classe}</p>
                            </div>
                        </div>

                        <div className="w-[30%] border border-black flex flex-col">
                            <div className="bg-gray-100 border-b border-black font-bold p-1 uppercase text-center">Profil de la classe</div>
                            <div className="p-2 space-y-1 text-[8px]">
                                <div className="flex justify-between"><span>Moy gen :</span> <span>{profilClasse.moy_gen}</span></div>
                                <div className="flex justify-between"><span>Moy premier :</span> <span>{profilClasse.moy_premier}</span></div>
                                <div className="flex justify-between font-bold"><span>Taux réussite :</span> <span>{profilClasse.taux_reussite}%</span></div>
                            </div>
                        </div>
                    </div>

                    {/* BLOCS SIGNATURES - Prend l'espace restant */}
                    <div className="mt-4 grid grid-cols-3 border-2 border-black divide-x-2 divide-black flex-grow min-h-[160px]">
                        <div className="p-3 flex flex-col">
                            <p className="font-black underline uppercase italic text-[10px] mb-2">Appréciation du travail</p>
                            <div className="flex-grow text-blue-800 italic text-[12px] font-medium leading-relaxed">
                                {bulletin.appreciation_generale || 'Aucune appréciation'}
                            </div>
                        </div>

                        <div className="p-3">
                            <p className="font-black underline uppercase italic text-[10px] text-center">Visa du professeur principal</p>
                        </div>

                        <div className="p-3 text-center relative flex flex-col justify-between">
                            <p className="font-black underline uppercase italic text-[10px]">Signature du Chef d'Établissement</p>
                            <div className="mb-6">
                                <p className="text-[11px] italic font-bold">Yaoundé, le {new Date(bulletin.date_generation).toLocaleDateString()}</p>
                                {/* Cachet institutionnel */}
                                <div className="absolute bottom-6 right-6 w-28 h-28 border-4 border-red-600 rounded-full opacity-25 flex items-center justify-center text-red-700 text-[10px] rotate-12 font-black border-double uppercase p-2">
                                    <span className="text-center italic">Collège Catholique<br/>St Benoit</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VISA PARENT - Collé tout en bas */}
                    <div className="mt-4 border-2 border-black p-4 text-[11px] font-black italic uppercase min-h-[80px]">
                        Visa du parent :
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}