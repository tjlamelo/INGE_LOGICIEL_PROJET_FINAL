import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, Save, X, Shield, User } from 'lucide-react';

type User = {
    id: number;
    name: string;
    email: string;
    role: string | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    roles: string[];
    searchTerm?: string;
    roleFilter?: string;
};

export default function TableUser({ users, roles, searchTerm = '', roleFilter = 'all' }: Props) {
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Filter users based on search term and role filter
    const filteredUsers = useMemo(() => {
        return users.data.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 user.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesRole = roleFilter === 'all' || 
                               (roleFilter === 'none' && !user.role) || 
                               user.role === roleFilter;
            
            return matchesSearch && matchesRole;
        });
    }, [users.data, searchTerm, roleFilter]);

    const startEditing = (userId: number, currentRole: string | null) => {
        setEditingUserId(userId);
        setSelectedRole(currentRole || '');
    };

    const cancelEditing = () => {
        setEditingUserId(null);
        setSelectedRole('');
    };

    const handleSave = async (userId: number) => {
        setIsLoading(true);
        try {
            await router.put(`/admin/users/${userId}/role`, { role: selectedRole }, {
                onSuccess: () => {
                    setEditingUserId(null);
                },
                onError: (errors) => {
                    console.error(errors);
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const handleRemove = async (userId: number, userName: string) => {
        if (confirm(`Are you sure you want to remove the role from ${userName}?`)) {
            setIsLoading(true);
            try {
                await router.put(`/admin/users/${userId}/role`, { role: null }, {
                    onSuccess: () => {
                        setEditingUserId(null);
                    },
                    onError: (errors) => {
                        console.error(errors);
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    }
                });
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        }
    };

    const getRoleBadgeVariant = (role: string | null) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'teacher':
                return 'default';
            case 'student':
                return 'secondary';
            case 'form_teacher':
                return 'outline';
            case 'general_supervisor':
                return 'default';
            case 'censor':
                return 'secondary';
            case 'principal':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="space-y-4">
            {/* Users List - Custom Table */}
            <div className="rounded-md border">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                    <div className="col-span-3">User</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Created</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>
                
                {/* Table Body */}
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
                            {/* User Name */}
                            <div className="col-span-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <span className="font-medium">{user.name}</span>
                                </div>
                            </div>
                            
                            {/* Email */}
                            <div className="col-span-3 text-sm text-gray-600">
                                {user.email}
                            </div>
                            
                            {/* Role */}
                            <div className="col-span-2">
                                {user.role ? (
                                    <Badge variant={getRoleBadgeVariant(user.role)}>
                                        {user.role}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">No Role</Badge>
                                )}
                            </div>
                            
                            {/* Created Date */}
                            <div className="col-span-2 text-sm text-gray-600">
                                {formatDate(user.created_at)}
                            </div>
                            
                            {/* Actions */}
                            <div className="col-span-2 text-right">
                                {editingUserId === user.id ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="border rounded px-2 py-1 text-sm"
                                        >
                                            <option value="">No role</option>
                                            {roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSave(user.id)}
                                            disabled={isLoading}
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={cancelEditing}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => startEditing(user.id, user.role)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRemove(user.id, user.name)}
                                            disabled={!user.role || isLoading}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No users found matching your criteria.
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {filteredUsers.length} of {users.total} users
                </div>
                <div className="flex items-center space-x-2">
                    {users.links.map((link, index) => (
                        <Button
                            key={index}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                        >
                            {link.label.replace('&laquo;', '').replace('&raquo;', '').trim() || index + 1}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}