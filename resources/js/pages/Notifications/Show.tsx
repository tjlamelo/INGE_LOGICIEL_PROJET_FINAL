import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";

// --- Types ---
type Notification = {
    id: string;
    data: {
        title: string;
        message: string;
        url?: string;
    };
    read_at: string | null;
    created_at: string;
};

type FlashMessage = { success?: string; error?: string; };
type ShowProps = {
    notification: Notification;
    flash: FlashMessage;
};

export default function NotificationShow({ notification, flash }: ShowProps) {
    const [showAlert, setShowAlert] = React.useState(!!flash?.success || !!flash?.error);

    // Masquer l'alerte après 3 secondes
    React.useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    return (
        <AppLayout 
            breadcrumbs={[
                { title: "Notifications", href: "/notifications" }, 
                { title: "Détails de la notification", href: `/notifications/${notification.id}` }
            ]}
        >
            <Head title={notification.data.title} />

            <div className="p-6">
                {showAlert && (
                    <Alert className="mb-6" variant={flash?.success ? "default" : "destructive"}>
                        <AlertDescription>
                            {flash?.success || flash?.error}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="mb-6">
                    <Link href="/notifications">
                        <Button variant="outline" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour aux notifications
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{notification.data.title}</CardTitle>
                            {!notification.read_at && (
                                <Badge variant="secondary">Nouveau</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Message</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{notification.data.message}</p>
                            </div>

                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-2" />
                                Reçu le {new Date(notification.created_at).toLocaleString()}
                            </div>

                            {notification.read_at && (
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Lu le {new Date(notification.read_at).toLocaleString()}
                                </div>
                            )}

                            {notification.data.url && (
                                <div className="pt-4">
                                    <Link href={notification.data.url}>
                                        <Button>
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Voir les détails
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}