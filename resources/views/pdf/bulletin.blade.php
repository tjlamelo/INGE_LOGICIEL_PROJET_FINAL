<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Bulletin de {{ $eleve->user->name }} - {{ $trimestre->nom }}</title>
    <style>
        @page { 
            size: a4 portrait; 
            margin: 5mm;  /* Marges réduites pour maximiser l'espace */
        }
        * {
            box-sizing: border-box;
        }
        html, body { 
            font-family: Arial, sans-serif; 
            font-size: 9pt; 
            line-height: 1.1;  /* Ligne plus serrée pour économiser de l'espace */
            color: #333; 
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }
        .bulletin-container {
            width: 100%;
            height: 100%;
            min-height: 287mm;  /* Hauteur A4 - marges */
            background-color: white;
            display: flex;
            flex-direction: column;
            padding: 0;
        }
        .header {
            display: flex;
            justify-content: space-between;
            text-align: center;
            margin-bottom: 3mm;
            line-height: 1.0;
            height: 18%;
        }
        .header-col {
            width: 40%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .header-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 20%;
        }
        .logo-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 14mm;
            height: 14mm;
            border: 2px solid black;
            font-weight: bold;
            margin: 0 auto;
        }
        .year-box {
            margin-top: 1mm;
            border-bottom: 1px solid black;
            font-size: 10pt;
            font-weight: bold;
            font-style: italic;
            width: 100%;
            text-align: center;
        }
        .student-info {
            position: relative;
            margin-bottom: 3mm;
            border: 2px solid black;
            height: 10%;
        }
        .student-info-title {
            border-bottom: 2px solid black;
            background-color: #f5f5f5;
            padding: 1mm 0;
            text-align: center;
            font-size: 12pt;  /* Réduit de 14pt à 12pt */
            font-weight: bold;
            font-style: italic;
            text-transform: uppercase;
        }
        .student-info-grid {
            display: grid;
            grid-template-columns: 33% 42% 25%;
            gap: 2mm;
            padding: 2mm;
            font-size: 9pt;  /* Réduit de 10pt à 9pt */
            height: calc(100% - 10mm);
        }
        .student-info-col {
            line-height: 1.3;
        }
        .student-name {
            font-size: 11pt;  /* Réduit de 12pt à 11pt */
            font-weight: 900;
            text-transform: uppercase;
        }
        .border-left {
            border-left: 1px solid #ccc;
            padding-left: 4mm;
        }
        .grades-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid black;
            text-align: center;
            font-size: 7pt;  /* Réduit de 8pt à 7pt */
            margin-bottom: 3mm;
            flex-grow: 1;  /* Permet au tableau de prendre l'espace nécessaire */
        }
        .grades-table th {
            background-color: #f5f5f5;
            border: 1px solid black;
            padding: 0.5mm;  /* Réduit de 1mm à 0.5mm */
            font-weight: bold;
        }
        .grades-table td {
            border: 1px solid black;
            padding: 0.5mm;  /* Réduit de 1mm à 0.5mm */
        }
        .subject-name {
            text-align: left;
            padding-left: 2mm;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 8pt;  /* Légèrement plus grand que le reste */
        }
        .teacher-name {
            font-size: 6pt;  /* Réduit de 7pt à 6pt */
            line-height: 1;
            text-transform: uppercase;
        }
        .group-row {
            background-color: #f5f5f5;
            font-weight: bold;
            font-style: italic;
            border-top: 2px solid black;
            border-bottom: 2px solid black;
        }
        .stats-section {
            display: flex;
            height: 25mm;  /* Réduit de 30mm à 25mm */
            gap: 2mm;
            margin-bottom: 3mm;
        }
        .stats-box {
            border: 1px solid black;
            overflow: hidden;
        }
        .discipline-box {
            width: 35%;
        }
        .work-box {
            width: 35%;
            display: flex;
            flex-direction: column;
        }
        .profile-box {
            width: 30%;
        }
        .stats-title {
            border-bottom: 1px solid black;
            background-color: #f5f5f5;
            padding: 1mm 0;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 8pt;
        }
        .discipline-table {
            width: 100%;
            height: 100%;
            font-size: 7pt;  /* Réduit de 8pt à 7pt */
            border-collapse: collapse;
        }
        .discipline-table th {
            border-bottom: 1px solid black;
            padding: 0.5mm;  /* Réduit de 1mm à 0.5mm */
            text-align: left;
            text-transform: uppercase;
        }
        .discipline-table td {
            border-left: 1px solid black;
            padding: 0.5mm;  /* Réduit de 1mm à 0.5mm */
            text-align: center;
        }
        .work-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            padding: 2mm;
            gap: 2mm;
        }
        .average {
            font-size: 11pt;  /* Réduit de 12pt à 11pt */
            font-weight: 900;
            color: #003366;
            text-transform: uppercase;
            font-style: italic;
        }
        .rank {
            font-size: 10pt;  /* Réduit de 11pt à 10pt */
            font-weight: bold;
        }
        .profile-content {
            padding: 2mm;
            font-size: 7pt;  /* Réduit de 8pt à 7pt */
        }
        .profile-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1mm;
        }
        .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            min-height: 35mm;  /* Réduit de 40mm à 35mm */
            flex-grow: 1;
            border: 2px solid black;
            margin-bottom: 3mm;
        }
        .signature-col {
            padding: 2mm;  /* Réduit de 3mm à 2mm */
        }
        .signature-col:not(:last-child) {
            border-right: 2px solid black;
        }
        .signature-title {
            font-size: 9pt;  /* Réduit de 10pt à 9pt */
            font-weight: 900;
            text-transform: uppercase;
            font-style: italic;
            text-decoration: underline;
            margin-bottom: 2mm;
        }
        .appreciation {
            font-size: 9pt;  /* Réduit de 10pt à 9pt */
            line-height: 1.3;
            font-weight: 500;
            color: #003366;
            font-style: italic;
        }
        .signature-date {
            font-size: 9pt;  /* Réduit de 10pt à 9pt */
            font-weight: bold;
            font-style: italic;
            margin-top: 4mm;  /* Réduit de 6mm à 4mm */
        }
        .stamp {
            position: absolute;
            right: 6mm;
            bottom: 6mm;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 25mm;  /* Réduit de 28mm à 25mm */
            height: 25mm;  /* Réduit de 28mm à 25mm */
            border: 4px double rgba(200, 0, 0, 0.3);
            border-radius: 50%;
            padding: 2mm;
            font-size: 6pt;  /* Réduit de 7pt à 6pt */
            font-weight: bold;
            color: rgba(200, 0, 0, 0.3);
            text-transform: uppercase;
            transform: rotate(12deg);
            opacity: 0.25;
        }
        .parent-signature {
            min-height: 15mm;  /* Réduit de 20mm à 15mm */
            border: 2px solid black;
            padding: 3mm;  /* Réduit de 4mm à 3mm */
            font-size: 9pt;  /* Réduit de 10pt à 9pt */
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
        .mt-1 {
            margin-top: 1mm;
        }
        .text-6 {
            font-size: 6pt;
        }
        .text-7 {
            font-size: 7pt;
        }
        .text-8 {
            font-size: 8pt;
        }
        .text-9 {
            font-size: 9pt;
        }
        .text-10 {
            font-size: 10pt;
        }
        .text-11 {
            font-size: 11pt;
        }
        .text-12 {
            font-size: 12pt;
        }
    </style>
</head>
<body>
    <div class="bulletin-container">
        <!-- EN-TÊTE BILINGUE -->
        <div class="header">
            <div class="header-col">
                <p class="bold">République du Cameroun</p>
                <p class="text-6 italic lowercase">Paix-Travail-Patrie</p>
                <p class="mt-1 text-7">Ministère des Enseignements Secondaires</p>
                <p class="bold">Collège Catholique Bilingue Saint Benoit</p>
                <p class="text-6 italic">Le savoir sur la colline</p>
                <p class="text-6">BP : 4018 Yaoundé - Tel : 222 317 747</p>
            </div>
            <div class="header-center">
                <div class="logo-box">LOGO</div>
                <div class="year-box">Année scolaire : {{ $trimestre->annee_scolaire }}</div>
            </div>
            <div class="header-col">
                <p class="bold">Republic of Cameroon</p>
                <p class="text-6 italic lowercase">Peace-Work-Fatherland</p>
                <p class="mt-1 text-7">Ministry of Secondary Education</p>
                <p class="bold">Saint Benedict Catholic Bilingual College</p>
                <p class="text-6 italic">Knowledge on the hill</p>
                <p class="text-6">PO Box: 4018 Yaounde / Phone: 222 317 747</p>
            </div>
        </div>

        <!-- SECTION INFOS ÉLÈVE -->
        <div class="student-info">
            <div class="student-info-title">Bulletin de notes du {{ $trimestre->nom }}</div>
            <div class="student-info-grid">
                <div class="student-info-col">
                    <p><span class="bold">Classe :</span> {{ $eleve->classe->nom }}</p>
                    <p><span class="bold">Matricule :</span> 24SB552</p>
                    <p><span class="bold">Né le :</span> 10/05/2012 à YAOUNDE</p>
                </div>
                <div class="student-info-col border-left">
                    <p><span class="bold">Effectif :</span> {{ $bulletin->effectif_classe }}</p>
                    <p><span class="bold">Nom & prénom :</span> <span class="student-name">{{ $eleve->user->name }}</span></p>
                </div>
                <div class="student-info-col border-left">
                    <p><span class="bold">Prof. Principal :</span> {{ $eleve->classe->titulaire->user->name ?? 'Non défini' }}</p>
                    <p><span class="bold">Tél parent :</span> 6XX XX XX XX</p>
                </div>
            </div>
        </div>

        <!-- TABLEAU DES NOTES -->
        <table class="grades-table">
            <thead>
                <tr>
                    <th class="text-left" style="width: 20%;">Matières</th>
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
                        <th>S{{ $seqId }}</th>
                    @endforeach
                    <th>Moy</th>
                    <th style="width: 4%;">Cf</th>
                    <th>Total</th>
                    <th>Rg</th>
                    <th>MGC</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th style="width: 15%;">Enseignants</th>
                    <th style="width: 12%;">Appréciations</th>
                </tr>
            </thead>
            <tbody>
                @php
                    // Utiliser $matieres au lieu de $moyennesMatieres
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
                            Résumé Groupe {{ $groupe }} :
                        </td>
                        <td>{{ $totauxParGroupe[$groupe]['totalCoeff'] }}</td>
                        <td>{{ number_format($totauxParGroupe[$groupe]['totalPoints'], 2) }}</td>
                        <td colspan="5" class="text-right" style="padding-right: 4mm; text-transform: uppercase;">
                            Moyenne Groupe {{ $groupe }} :
                        </td>
                        <td style="font-size: 9pt; font-weight: 900;">
                            {{ $totauxParGroupe[$groupe]['moyenneGroupe'] }}
                        </td>
                    </tr>
                @endforeach
                
                @if(empty($matieresParGroupe))
                    <tr>
                        <td colspan="{{ 8 + count($sequences) }}" style="padding: 10mm; text-align: center; color: #777;">
                            Aucune matière trouvée pour ce bulletin.
                        </td>
                    </tr>
                @endif
            </tbody>
        </table>

        <!-- SECTION STATISTIQUES -->
        <div class="stats-section">
            <div class="stats-box discipline-box">
                <div class="stats-title">Disciplines</div>
                <table class="discipline-table">
                    <thead>
                        <tr>
                            <th></th>
                            @foreach($sequences as $seqId)
                                <th style="border-left: 1px solid black;">S{{ $seqId }}</th>
                            @endforeach
                            <th style="border-left: 1px solid black;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding-left: 1mm;">Absences non j.</td>
                            @foreach($sequences as $seqId)
                                <td style="border-left: 1px solid black;">0</td>
                            @endforeach
                            <td style="border-left: 1px solid black;">0</td>
                        </tr>
                        <tr class="bold">
                            <td style="padding-left: 1mm;">Blâmes conduite</td>
                            <td colspan="{{ count($sequences) + 1 }}" style="border-left: 1px solid black; font-style: italic;">NON</td>
                        </tr>
                        <tr class="bold">
                            <td style="padding-left: 1mm; text-transform: uppercase;">Avert. conduite</td>
                            <td colspan="{{ count($sequences) + 1 }}" style="border-left: 1px solid black; font-style: italic;">NON</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="stats-box work-box">
                <div class="stats-title">Travail de l'élève</div>
                <div class="work-content">
                    <p class="average">Moyenne : {{ number_format($bulletin->moyenne_generale, 2) }} / 20</p>
                    <p class="rank">Rang : {{ $bulletin->rang }}e / {{ $bulletin->effectif_classe }}</p>
                </div>
            </div>
            
            <div class="stats-box profile-box">
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
            </div>
        </div>

        <!-- BLOCS SIGNATURES -->
        <div class="signature-section">
            <div class="signature-col">
                <p class="signature-title">Appréciation du travail</p>
                <div class="appreciation">
                    {{ $bulletin->appreciation_generale ?? 'Aucune appréciation' }}
                </div>
            </div>
            
            <div class="signature-col">
                <p class="signature-title">Visa du professeur principal</p>
            </div>
            
            <div class="signature-col" style="position: relative; display: flex; flex-direction: column; justify-content: space-between;">
                <p class="signature-title">Signature du Chef d'Établissement</p>
                <div style="margin-bottom: 4mm;">
                    <p class="signature-date">Yaoundé, le {{ date('d/m/Y', strtotime($bulletin->date_generation)) }}</p>
                    <div class="stamp">
                        <span class="text-center italic">
                            Collège Catholique<br>
                            St Benoit
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- VISA PARENT -->
        <div class="parent-signature">
            Visa du parent :
        </div>
    </div>
</body>
</html>