<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'Notification' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .header h1 {
            margin: 0;
            color: #2c3e50;
        }
        .content {
            margin-bottom: 30px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 14px;
            color: #777;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $subject ?? 'Notification' }}</h1>
        </div>
        
        <div class="content">
            @if(isset($recipientName))
                <p>Bonjour {{ $recipientName }},</p>
            @endif
            
            {!! $content ?? 'Ceci est une notification automatique.' !!}
            
            @if(isset($actionUrl) && isset($actionText))
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{ $actionUrl }}" class="button">{{ $actionText }}</a>
                </div>
            @endif
        </div>
        
        <div class="footer">
            <p>Cet e-mail a été envoyé automatiquement par le système de gestion scolaire.</p>
            <p>&copy; {{ date('Y') }} Collège Catholique Bilingue Saint Benoit. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>