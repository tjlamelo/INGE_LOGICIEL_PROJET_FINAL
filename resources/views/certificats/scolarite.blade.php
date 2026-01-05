<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificat de Scolarité</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            font-size: 24px;
            margin: 0;
            font-weight: bold;
        }
        .header p {
            font-size: 14px;
            margin: 5px 0;
        }
        .content {
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .content p {
            margin: 10px 0;
        }
        .footer {
            margin-top: 60px;
            text-align: center;
        }
        .signature {
            margin-top: 80px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
            text-align: center;
        }
        .signature-line {
            border-bottom: 1px solid #000;
            margin-top: 60px;
        }
        .stamp {
            position: absolute;
            right: 50px;
            bottom: 50px;
            width: 120px;
            height: 120px;
            border: 2px solid #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            opacity: 0.7;
        }
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
                border: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CERTIFICAT DE SCOLARITÉ</h1>
            <p>N° {{ $certificat->numero_certificat }}</p>
            <p>Année scolaire: {{ $certificat->annee_scolaire }}</p>
        </div>

        <div class="content">
            <p>Le soussigné, Directeur de l'établissement, certifie que:</p>
            
            <p><strong>Nom et prénom:</strong> {{ $eleve->user->name }}</p>
            
            <p><strong>Né(e) le:</strong> {{ $eleve->date_naissance }} à {{ $eleve->lieu_naissance }}</p>
            
            <p><strong>Classe:</strong> {{ $eleve->classe->nom ?? 'Non spécifiée' }}</p>
            
            <p>A bien suivi sa scolarité pour l'année scolaire {{ $certificat->annee_scolaire }}.</p>
            
            <p>Ce certificat est délivré pour servir et valoir ce que de droit.</p>
        </div>

        <div class="footer">
            <p>Fait à Yaoundé, le {{ date('d/m/Y', strtotime($certificat->date_signature ?? now())) }}</p>
            
            <div class="signature">
                <div class="signature-box">
                    <p>Le Directeur</p>
                    <div class="signature-line">
                        <p>{{ $certificat->signe_par ?? 'Signature' }}</p>
                    </div>
                </div>
                
                <div class="signature-box">
                    <p>Le Parent/Tuteur</p>
                    <div class="signature-line">
                        <p>Signature</p>
                    </div>
                </div>
            </div>
        </div>
        
        @if($certificat->statut === 'valide')
            <div class="stamp">
                CACHET DE L'ÉTABLISSEMENT
            </div>
        @endif
    </div>
</body>
</html>