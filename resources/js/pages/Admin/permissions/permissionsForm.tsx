import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, Save, X, Trash2, Shield, User } from "lucide-react";

type User = {
    id: number;
    name: string;
    email: string;
    role: string | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    user: User;
    roles: string[];
};

export default function PermissionsForm({ user, roles }: Props) {
    const [editing, setEditing] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user.role || "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            await router.put(`/admin/users/${user.id}/role`, { role: selectedRole }, {
                onSuccess: () => {
                    setEditing(false);
                },
                onError: (errors) => {
                    setError(errors.role || 'Failed to update role');
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        } catch (err) {
            setError('An unexpected error occurred');
            setIsLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!user.role) return;
        
        if (confirm(`Are you sure you want to remove the role from ${user.name}?`)) {
            setIsLoading(true);
            setError(null);
            
            try {
                await router.put(`/admin/users/${user.id}/role`, { role: null }, {
                    onSuccess: () => {
                        setSelectedRole("");
                        setEditing(false);
                    },
                    onError: (errors) => {
                        setError(errors.role || 'Failed to remove role');
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    }
                });
            } catch (err) {
                setError('An unexpected error occurred');
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

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {user.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Current Role</p>
                        <div className="mt-1">
                            {user.role ? (
                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                    {user.role}
                                </Badge>
                            ) : (
                                <Badge variant="outline">No Role</Badge>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {editing ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Role</label>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">No Role</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleSave} disabled={isLoading} size="sm">
                                <Save className="mr-2 h-4 w-4" />
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                            <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Role
                        </Button>
                        <Button 
                            onClick={handleRemove} 
                            variant="outline" 
                            size="sm"
                            disabled={!user.role || isLoading}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Role
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}