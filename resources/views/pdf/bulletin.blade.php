<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Bulletin de {{ $eleve->user->name }} - {{ $trimestre->nom }}</title>
    <style>
        @page { 
            size: a4 portrait; 
            margin: 5mm;
        }
        * {
            box-sizing: border-box;
        }
        body { 
            font-family: Arial, sans-serif; 
            font-size: 7.5pt; 
            line-height: 1.1;
            color: #333; 
            margin: 0;
            padding: 0;
            width: 200mm; /* Largeur A4 - marges */
        }
        table {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
        }
        td, th {
            border: 1px solid black;
            vertical-align: top;
            padding: 0.5mm;
        }
        .no-border td, .no-border th {
            border: none;
        }
        .header-table td {
            padding: 0.5mm;
            font-size: 6pt;
            line-height: 1.0;
            border: none;
            vertical-align: top;
        }
        .header-table td:first-child, .header-table td:last-child {
            width: 39%;
        }
        .header-table td:nth-child(2) {
            width: 22%;
            text-align: center;
        }
        .logo-box {
            width: 8mm;
            height: 8mm;
            border: 1px solid black;
            font-weight: bold;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 5pt;
        }
        .year-box {
            margin-top: 0.5mm;
            border-bottom: 1px solid black;
            font-size: 6pt;
            font-weight: bold;
            font-style: italic;
            width: 100%;
            text-align: center;
        }
        .student-info {
            margin-bottom: 2mm;
            border: 1px solid black;
        }
        .student-info-title {
            background-color: #f5f5f5;
            padding: 0.5mm 0;
            text-align: center;
            font-size: 12pt;
            font-weight: bold;
            font-style: italic;
            text-transform: uppercase;
            border-bottom: 1px solid black;
        }
        .student-info td {
            padding: 0.5mm;
            font-size: 6pt;
        }
        .student-info td:first-child {
            width: 33%;
        }
        .student-info td:nth-child(2) {
            width: 42%;
            border-left: 1px solid #ccc;
        }
        .student-info td:last-child {
            width: 25%;
            border-left: 1px solid #ccc;
        }
        .student-name {
            font-size: 7pt;
            font-weight: 900;
            text-transform: uppercase;
        }
        .grades-table {
            margin-bottom: 2mm;
            border: 2px solid black;
            text-align: center;
            font-size: 7pt; /* Augmenté de 5pt à 7pt */
        }
        .grades-table th {
            background-color: #f5f5f5;
            padding: 0.6mm; /* Augmenté de 0.3mm à 1mm */
            font-weight: bold;
            font-size: 7pt; /* Augmenté de 5pt à 8pt */
        }
        .grades-table td {
            padding: 0.6mm; /* Augmenté de 0.3mm à 1mm */
            font-size: 7pt; /* Augmenté de 5pt à 7pt */
        }
        .subject-name {
            text-align: left;
            padding-left: 166mm; /* Augmenté de 1mm à 2mm */
            font-weight: bold;
            text-transform: uppercase;
            font-size: 8pt; /* Augmenté de 6pt à 8pt */
        }
        .teacher-name {
            font-size: 6pt; /* Augmenté de 4pt à 6pt */
            text-transform: uppercase;
        }
        .group-row {
            background-color: #f5f5f5;
            font-weight: bold;
            font-style: italic;
        }
        .group-row td {
            border-top: 2px solid black;
            border-bottom: 2px solid black;
            padding: 1mm; /* Augmenté pour correspondre aux autres cellules */
        }
        .stats-section {
            margin-bottom: 2mm;
        }
        .stats-table td {
            padding: 0.5mm;
            border: 1px solid black;
            vertical-align: top;
        }
        .stats-table td:first-child {
            width: 35%;
        }
        .stats-table td:nth-child(2) {
            width: 35%;
        }
        .stats-table td:last-child {
            width: 30%;
        }
        .stats-title {
            background-color: #f5f5f5;
            padding: 0.3mm 0;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 6pt;
            border-bottom: 1px solid black;
        }
        .discipline-table {
            font-size: 5pt;
        }
        .discipline-table th {
            padding: 0.3mm;
            text-align: left;
            text-transform: uppercase;
            font-size: 5pt;
            border-bottom: 1px solid black;
        }
        .discipline-table td {
            padding: 0.3mm;
            text-align: center;
            font-size: 5pt;
        }
        .discipline-table td:first-child {
            border-left: none;
        }
        .work-content {
            text-align: center;
            padding: 1mm 0;
        }
        .average {
            font-size: 8pt;
            font-weight: 900;
            color: #003366;
            text-transform: uppercase;
            font-style: italic;
        }
        .rank {
            font-size: 7pt;
            font-weight: bold;
            margin-top: 0.5mm;
        }
        .profile-content {
            font-size: 8pt;
        }
        .profile-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.3mm;
        }
        .signature-section {
            margin-bottom: 2mm;
            border: 1px solid black;
            height: 30mm; /* Hauteur fixe pour garantir l'espace de signature */
        }
        .signature-table td {
            width: 33.33%;
            padding: 1mm;
            vertical-align: top;
            font-size: 6pt;
        }
        .signature-table td:not(:last-child) {
            border-right: 1px solid black;
        }
        .signature-title {
            font-size: 7pt;
            font-weight: 900;
            text-transform: uppercase;
            font-style: italic;
            text-decoration: underline;
            margin-bottom: 2mm;
        }
        .appreciation {
            font-size: 6pt;
            line-height: 1.1;
            font-weight: 500;
            color: #003366;
            font-style: italic;
            height: 15mm; /* Hauteur fixe pour l'appréciation */
        }
        .signature-space {
            height: 15mm; /* Hauteur fixe pour l'espace de signature */
            border-bottom: 1px dashed #ccc;
            margin-top: 1mm;
        }
        .signature-date {
            font-size: 6pt;
            font-weight: bold;
            font-style: italic;
            margin-top: 1mm;
            text-align: right;
        }
        .stamp {
            position: absolute;
            right: 8mm;
            bottom: 12mm;
            width: 18mm;
            height: 18mm;
            border: 2px double rgba(200, 0, 0, 0.3);
            border-radius: 50%;
            padding: 1mm;
            font-size: 4pt;
            font-weight: bold;
            color: rgba(200, 0, 0, 0.3);
            text-transform: uppercase;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .parent-signature {
            height: 15mm; /* Hauteur fixe pour le visa parent */
            border: 1px ;
            padding: 1mm;
            font-size: 7pt;
            font-weight: 900;
            text-transform: uppercase;
            font-style: italic;
        }
        .min-grade {
            color: #cc0000;
        }
        .max-grade {
            color: #006600;
        }
        .bold {
            font-weight: bold;
        }
        .italic {
            font-style: italic;
        }
        .uppercase {
            text-transform: uppercase;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .text-left {
            text-align: left;
        }
        .header-table td:first-child {
    width: 39%;
    vertical-align: middle;
    text-align: left;
}
.header-table td:nth-child(2) {
    width: 22%;
    vertical-align: middle;
    text-align: center;
}
.header-table td:last-child {
    width: 39%;
    vertical-align: middle;
    text-align: right;
}
.logo-box {
    width: 10mm;
    height: 10mm;
    border: 1px solid black;
    font-weight: bold;
    margin: 0 auto 1mm auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5pt;
}
    </style>
</head>
<body>
    <!-- EN-TÊTE COMPACT -->
 
<table class="header-table no-border">
    <tr>
        <td style="vertical-align: middle; text-align: left;">
            <p class="bold">République du Cameroun</p>
            <p class="italic">Paix-Travail-Patrie</p>
            <p class="bold">Collège Catholique Bilingue Saint Benoit</p>
            <p>BP : 4018 Yaoundé - Tel : 222 317 747</p>
        </td>
        <td style="vertical-align: middle; text-align: center;">
            <div style="width: 100%; text-align: center;">
                <div class="logo-box">LOGO</div>
                <div class="year-box">{{ $trimestre->annee_scolaire }}</div>
            </div>
        </td>
        <td style="vertical-align: middle; text-align: right;">
            <p class="bold">Republic of Cameroon</p>
            <p class="italic">Peace-Work-Fatherland</p>
            <p class="bold">Saint Benedict Catholic Bilingual College</p>
            <p>PO Box: 4018 Yaounde / Phone: 222 317 747</p>
        </td>
    </tr>
</table>

    <!-- SECTION INFOS ÉLÈVE COMPACTE -->
    <table class="student-info">
        <tr>
            <td colspan="3" class="student-info-title">Bulletin du {{ $trimestre->nom }}</td>
        </tr>
        <tr>
            <td>
                <p><span class="bold">Classe:</span> {{ $eleve->classe->nom }}</p>
                <p><span class="bold">Mat:</span> 24SB552</p>
                <p><span class="bold">Né:</span> 10/05/2012</p>
            </td>
            <td>
                <p><span class="bold">Effectif:</span> {{ $bulletin->effectif_classe }}</p>
                <p><span class="bold">Nom:</span> <span class="student-name">{{ $eleve->user->name }}</span></p>
            </td>
            <td>
                <p><span class="bold">Prof. Principal:</span> {{ $eleve->classe->titulaire->user->name ?? 'Non défini' }}</p>
                <p><span class="bold">Tél parent:</span> 6XX XX XX XX</p>
            </td>
        </tr>
    </table>

    <!-- TABLEAU DES NOTES AGRANDI -->
    <table class="grades-table">
        <thead>
            <tr>
                <th class="text-left" style="width: 18%;">Matières</th>
                @php
                    $sequences = [];
                    switch($trimestre->nom) {
                        case '1er Trimestre':
                            $sequences = [1, 2];
                            break;
                        case '2ème Trimestre':
                            $sequences = [3, 4];
                            break;
                        case '3ème Trimestre':
                            $sequences = [5, 6];
                            break;
                        default:
                            $sequences = [1, 2];
                    }
                @endphp
                @foreach($sequences as $seqId)
                    <th style="width: 5%;">S{{ $seqId }}</th>
                @endforeach
                <th style="width: 5%;">Moy</th>
                <th style="width: 5%;">Cf</th>
                <th style="width: 6%;">Total</th>
                <th style="width: 4%;">Rg</th>
                <th style="width: 5%;">MGC</th>
                <th style="width: 5%;">Min</th>
                <th style="width: 5%;">Max</th>
                <th style="width: 14%;">Enseignants</th>
                <th style="width: 10%;">Appréciations</th>
            </tr>
        </thead>
        <tbody>
            @php
                $matieresParGroupe = [];
                foreach($matieres as $matiere) {
                    $matieresParGroupe[$matiere['groupe']][] = $matiere;
                }
                ksort($matieresParGroupe);
                
                $totauxParGroupe = [];
                foreach($matieresParGroupe as $groupe => $matieres) {
                    $totalCoeff = 0;
                    $totalPoints = 0;
                    foreach($matieres as $m) {
                        $totalCoeff += $m['coeff'];
                        $totalPoints += $m['total'];
                    }
                    $moyenneGroupe = $totalCoeff > 0 ? round($totalPoints / $totalCoeff, 2) : '0.00';
                    $totauxParGroupe[$groupe] = [
                        'totalCoeff' => $totalCoeff,
                        'totalPoints' => $totalPoints,
                        'moyenneGroupe' => $moyenneGroupe
                    ];
                }
            @endphp
            
            @foreach($matieresParGroupe as $groupe => $matieres)
                @foreach($matieres as $matiere)
                    <tr>
                        <td class="subject-name">{{ $matiere['matiere'] }}</td>
                        @foreach($sequences as $seqId)
                            <td>
                                @php
                                    $note = '-';
                                    if(isset($bulletin->stats_sequences[$seqId][$matiere['matiere_id']])) {
                                        $note = number_format($bulletin->stats_sequences[$seqId][$matiere['matiere_id']]['moyenne'], 2);
                                    }
                                @endphp
                                {{ $note }}
                            </td>
                        @endforeach
                        <td>{{ number_format($matiere['moyenne'], 2) }}</td>
                        <td>{{ $matiere['coeff'] }}</td>
                        <td>{{ number_format($matiere['total'], 2) }}</td>
                        <td>{{ $matiere['rang'] }}e</td>
                        <td>{{ number_format($matiere['mgc'], 2) }}</td>
                        <td class="min-grade">{{ number_format($matiere['min'], 2) }}</td>
                        <td class="max-grade">{{ number_format($matiere['max'], 2) }}</td>
                        <td class="teacher-name">{{ $matiere['enseignant'] }}</td>
                        <td>
                            @php
                                $appreciation = 'Insuffisant';
                                if($matiere['moyenne'] >= 14) $appreciation = 'Excellent';
                                elseif($matiere['moyenne'] >= 12) $appreciation = 'Très Bien';
                                elseif($matiere['moyenne'] >= 10) $appreciation = 'Bien';
                                elseif($matiere['moyenne'] >= 8) $appreciation = 'Passable';
                            @endphp
                            {{ $appreciation }}
                        </td>
                    </tr>
                @endforeach
                <tr class="group-row">
                    <td colspan="{{ 1 + count($sequences) }}" class="text-right" style="padding-right: 2mm;">
                        Groupe {{ $groupe }} :
                    </td>
                    <td>{{ $totauxParGroupe[$groupe]['totalCoeff'] }}</td>
                    <td>{{ number_format($totauxParGroupe[$groupe]['totalPoints'], 2) }}</td>
                    <td colspan="5" class="text-right" style="padding-right: 3mm; text-transform: uppercase;">
                        Moy Groupe {{ $groupe }} :
                    </td>
                    <td style="font-size: 8pt; font-weight: 900;">
                        {{ $totauxParGroupe[$groupe]['moyenneGroupe'] }}
                    </td>
                </tr>
            @endforeach
            
            @if(empty($matieresParGroupe))
                <tr>
                    <td colspan="{{ 8 + count($sequences) }}" style="padding: 5mm; text-align: center; color: #777;">
                        Aucune matière trouvée pour ce bulletin.
                    </td>
                </tr>
            @endif
        </tbody>
    </table>

    <!-- SECTION STATISTIQUES -->
    <table class="stats-section">
        <tr>
            <td>
                <div class="stats-title">Disciplines</div>
                <table class="discipline-table">
                    <thead>
                        <tr>
                            <th style="width: 40%;"></th>
                            @foreach($sequences as $seqId)
                                <th style="width: 20%;">S{{ $seqId }}</th>
                            @endforeach
                            <th style="width: 20%;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding-left: 1mm;">Absences non j.</td>
                            @foreach($sequences as $seqId)
                                <td>0</td>
                            @endforeach
                            <td>0</td>
                        </tr>
                        <tr class="bold">
                            <td style="padding-left: 1mm;">Blâmes conduite</td>
                            <td colspan="{{ count($sequences) + 1 }}" style="font-style: italic;">NON</td>
                        </tr>
                        <tr class="bold">
                            <td style="padding-left: 1mm; text-transform: uppercase;">Avert. conduite</td>
                            <td colspan="{{ count($sequences) + 1 }}" style="font-style: italic;">NON</td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td>
                <div class="stats-title">Travail de l'élève</div>
                <div class="work-content">
                    <p class="average">Moyenne : {{ number_format($bulletin->moyenne_generale, 2) }} / 20</p>
                    <p class="rank">Rang : {{ $bulletin->rang }}e / {{ $bulletin->effectif_classe }}</p>
                </div>
            </td>
            <td>
                <div class="stats-title">Profil de la classe</div>
                <div class="profile-content">
                    <div class="profile-row">
                        <span>Moy gen :</span> <span>{{ number_format($profil['moy_gen'] ?? 0, 2) }}</span>
                    </div>
                    <div class="profile-row">
                        <span>Moy premier :</span> <span>{{ number_format($profil['moy_premier'] ?? 0, 2) }}</span>
                    </div>
                    <div class="profile-row bold">
                        <span>Taux réussite :</span> <span>{{ number_format($profil['taux_reussite'] ?? 0, 2) }}%</span>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- BLOCS SIGNATURES -->
    <table class="signature-section">
        <tr>
            <td>
                <p class="signature-title">Appréciation du travail</p>
                <div class="appreciation">
                    {{ $bulletin->appreciation_generale ?? 'Aucune appréciation' }}
                </div>
            </td>
            <td>
                <p class="signature-title">Visa du professeur principal</p>
                <div class="signature-space"></div>
            </td>
            <td style="position: relative;">
                <p class="signature-title">Signature du Chef d'Établissement</p>
                <div class="signature-space"></div>
                <p class="signature-date">Yaoundé, le {{ date('d/m/Y', strtotime($bulletin->date_generation)) }}</p>
                <div class="stamp">
                    <span class="italic">
                        Collège Catholique<br>
                        St Benoit
                    </span>
                </div>
            </td>
        </tr>
    </table>

    <!-- VISA PARENT -->
    <table class="parent-signature">
        <tr>
            <td>
                Visa du parent :
                <div style="margin-top: 1mm; border-bottom: 1px dashed #ccc; height: 10mm;"></div>
            </td>
        </tr>
    </table>
</body>
</html>