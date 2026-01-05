import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing, Check, ExternalLink, X } from "lucide-react";
import axios from "axios";

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

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/notifications/unread');
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Rafraîchir les notifications toutes les 60 secondes
        const interval = setInterval(fetchNotifications, 60000);
        
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            setMarkingAsRead(id);
            await axios.post(`/notifications/${id}/read`);
            setNotifications(prev => 
                prev.filter(n => n.id !== id)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
        } finally {
            setMarkingAsRead(null);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/notifications/read-all');
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Erreur lors du marquage de toutes comme lues:', error);
        }
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Notifications</h3>
                            <div className="flex space-x-2">
                                {unreadCount > 0 && (
                                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                                        <Check className="h-4 w-4 mr-1" />
                                        Tout lire
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                                <p className="mt-2 text-sm text-gray-500">Chargement...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center">
                                <BellRing className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Aucune notification non lue</p>
                            </div>
                        ) : (
                            <ul>
                                {notifications.map((notification) => (
                                    <li key={notification.id} className="border-b border-gray-100 last:border-b-0">
                                        <div className="p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                                                        {notification.data.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {notification.data.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-1 ml-2">
                                                    <Link href={`/notifications/${notification.id}`}>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => markAsRead(notification.id)}
                                                        disabled={markingAsRead === notification.id}
                                                    >
                                                        {markingAsRead === notification.id ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                        ) : (
                                                            <Check className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="p-2 border-t border-gray-200">
                        <Link href="/notifications">
                            <Button variant="ghost" className="w-full justify-center">
                                Voir toutes les notifications
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}