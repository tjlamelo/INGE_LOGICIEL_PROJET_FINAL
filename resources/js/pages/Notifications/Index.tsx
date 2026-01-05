import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, BellRing, Check, CheckCheck, Trash2, Send } from "lucide-react";

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

type Classe = { id: number; nom: string; };
type Role = { id: number; name: string; };
type User = { id: number; name: string; email: string; };
type FlashMessage = { success?: string; error?: string; };
type IndexProps = {
    unreadNotifications: Notification[];
    recentNotifications: Notification[];
    unreadCount: number;
    classes: Classe[];
    roles: Role[];
    users: User[];
    flash: FlashMessage;
};

export default function NotificationIndex({ 
    unreadNotifications, 
    recentNotifications, 
    unreadCount, 
    classes, 
    roles,
    users,
    flash
}: IndexProps) {
    const [activeTab, setActiveTab] = useState<'unread' | 'recent'>('unread');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showAlert, setShowAlert] = useState(!!flash?.success || !!flash?.error);
    const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        message: '',
        target_type: 'user',
        target_id: '',
        url: '', // Plus de valeur par défaut
        send_email: false,
    });

    const notifications = activeTab === 'unread' ? unreadNotifications : recentNotifications;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/notifications', {
            onSuccess: () => {
                reset();
                setShowCreateForm(false);
            },
        });
    };

    // Masquer l'alerte après 3 secondes
    React.useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    // Marquer une notification comme lue
    const handleMarkAsRead = (id: string) => {
        setMarkingAsRead(id);
        router.post(`/notifications/${id}/read`, {}, {
            onSuccess: (page) => {
                // Mettre à jour l'état local pour refléter le changement
                const updatedNotifications = notifications.map(n => 
                    n.id === id ? { ...n, read_at: new Date().toISOString() } : n
                );
                
                // Mettre à jour les notifications non lues
                const updatedUnreadNotifications = unreadNotifications.filter(n => n.id !== id);
                
                // Utiliser usePage pour mettre à jour les données
                const pageProps = page.props;
                pageProps.unreadNotifications = updatedUnreadNotifications;
                pageProps.unreadCount = updatedUnreadNotifications.length;
                
                if (activeTab === 'unread') {
                    pageProps.unreadNotifications = updatedNotifications;
                } else {
                    pageProps.recentNotifications = updatedNotifications;
                }
            },
            onFinish: () => setMarkingAsRead(null),
        });
    };

    // Marquer toutes les notifications comme lues
    const handleMarkAllAsRead = () => {
        setMarkingAllAsRead(true);
        router.post('/notifications/read-all', {}, {
            onSuccess: (page) => {
                // Mettre à jour l'état local
                const pageProps = page.props;
                pageProps.unreadNotifications = [];
                pageProps.unreadCount = 0;
                
                // Mettre à jour toutes les notifications comme lues
                const updatedNotifications = notifications.map(n => 
                    ({ ...n, read_at: new Date().toISOString() })
                );
                
                if (activeTab === 'unread') {
                    pageProps.unreadNotifications = updatedNotifications;
                } else {
                    pageProps.recentNotifications = updatedNotifications;
                }
            },
            onFinish: () => setMarkingAllAsRead(false),
        });
    };

    // Supprimer une notification
    const handleDelete = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
            setDeleting(id);
            router.delete(`/notifications/${id}`, {
                onSuccess: (page) => {
                    // Mettre à jour l'état local
                    const pageProps = page.props;
                    
                    // Filtrer la notification supprimée
                    const updatedNotifications = notifications.filter(n => n.id !== id);
                    const updatedUnreadNotifications = unreadNotifications.filter(n => n.id !== id);
                    
                    // Mettre à jour les données
                    pageProps.unreadNotifications = updatedUnreadNotifications;
                    pageProps.unreadCount = updatedUnreadNotifications.length;
                    
                    if (activeTab === 'unread') {
                        pageProps.unreadNotifications = updatedNotifications;
                    } else {
                        pageProps.recentNotifications = updatedNotifications;
                    }
                },
                onFinish: () => setDeleting(null),
            });
        }
    };

    return (
        <AppLayout 
            breadcrumbs={[
                { title: "Notifications", href: "/notifications" }, 
                { title: "Mes notifications", href: "/notifications" }
            ]}
        >
            <Head title="Notifications" />

            <div className="p-6">
                {showAlert && (
                    <Alert className="mb-6" variant={flash?.success ? "default" : "destructive"}>
                        <AlertDescription>
                            {flash?.success || flash?.error}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <div className="flex space-x-2">
                        <Button onClick={() => setShowCreateForm(!showCreateForm)} variant="outline">
                            <Send className="h-4 w-4 mr-2" />
                            Envoyer une notification
                        </Button>
                        {unreadCount > 0 && (
                            <Button 
                                onClick={handleMarkAllAsRead} 
                                variant="outline"
                                disabled={markingAllAsRead}
                            >
                                <CheckCheck className="h-4 w-4 mr-2" />
                                {markingAllAsRead ? 'Traitement...' : 'Tout marquer comme lu'}
                            </Button>
                        )}
                    </div>
                </div>

                {showCreateForm && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Envoyer une nouvelle notification</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Titre
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="target_type" className="block text-sm font-medium text-gray-700">
                                            Type de destinataire
                                        </label>
                                        <select
                                            id="target_type"
                                            value={data.target_type}
                                            onChange={(e) => setData('target_type', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="user">Utilisateur spécifique</option>
                                            <option value="role">Rôle</option>
                                            <option value="class">Classe</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="target_id" className="block text-sm font-medium text-gray-700">
                                            Destinataire
                                        </label>
                                        {data.target_type === 'user' && (
                                            <select
                                                id="target_id"
                                                value={data.target_id}
                                                onChange={(e) => setData('target_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="">Sélectionner un utilisateur</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} ({user.email})
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {data.target_type === 'role' && (
                                            <select
                                                id="target_id"
                                                value={data.target_id}
                                                onChange={(e) => setData('target_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="">Sélectionner un rôle</option>
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.id}>{role.name}</option>
                                                ))}
                                            </select>
                                        )}
                                        {data.target_type === 'class' && (
                                            <select
                                                id="target_id"
                                                value={data.target_id}
                                                onChange={(e) => setData('target_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="">Sélectionner une classe</option>
                                                {classes.map((classe) => (
                                                    <option key={classe.id} value={classe.id}>{classe.nom}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                        URL (optionnel)
                                    </label>
                                    <input
                                        id="url"
                                        type="text"
                                        value={data.url}
                                        onChange={(e) => setData('url', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Laissez vide pour n'afficher que les détails de la notification"
                                    />
                                    {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="send_email"
                                        type="checkbox"
                                        checked={data.send_email}
                                        onChange={(e) => setData('send_email', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="send_email" className="ml-2 block text-sm text-gray-900">
                                        Envoyer également par e-mail
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button type="button" onClick={() => setShowCreateForm(false)} variant="outline">
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Envoi en cours...' : 'Envoyer'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="flex space-x-1 mb-4">
                    <Button
                        variant={activeTab === 'unread' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('unread')}
                        className="flex items-center"
                    >
                        <BellRing className="h-4 w-4 mr-2" />
                        Non lues
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>
                        )}
                    </Button>
                    <Button
                        variant={activeTab === 'recent' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('recent')}
                    >
                        <Bell className="h-4 w-4 mr-2" />
                        Récentes
                    </Button>
                </div>

                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Bell className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {activeTab === 'unread' ? 'Aucune notification non lue' : 'Aucune notification récente'}
                                </h3>
                                <p className="text-gray-500">
                                    {activeTab === 'unread' 
                                        ? 'Toutes vos notifications ont été lues.' 
                                        : 'Vous n\'avez reçu aucune notification récemment.'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        notifications.map((notification) => (
                            <Card key={notification.id} className={notification.read_at ? 'opacity-75' : ''}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-1">
                                                <h3 className="font-medium text-gray-900">{notification.data.title}</h3>
                                                {!notification.read_at && (
                                                    <Badge variant="secondary" className="ml-2">Nouveau</Badge>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-2">{notification.data.message}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <Link href={`/notifications/${notification.id}`}>
                                                <Button variant="outline" size="sm">
                                                    Voir
                                                </Button>
                                            </Link>
                                            {!notification.read_at && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    disabled={markingAsRead === notification.id}
                                                >
                                                    {markingAsRead === notification.id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                    ) : (
                                                        <Check className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(notification.id)}
                                                disabled={deleting === notification.id}
                                            >
                                                {deleting === notification.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}