import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Users, Shield, RefreshCw } from 'lucide-react';
import TableUser from '../user/tableUser';

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
    flash?: { success?: string; error?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Manage Roles', href: '/admin/permissions' },
];

export default function IndexPermissions({ users, roles, flash }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            setShowErrorAlert(true);
            const timer = setTimeout(() => setShowErrorAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.error]);

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage User Roles" />
            
            <div className="space-y-6 p-6">
                {/* Alert Messages */}
                {showSuccessAlert && (
                    <Alert className="border-green-200 bg-green-50">
                        <AlertDescription>{flash?.success}</AlertDescription>
                    </Alert>
                )}
                
                {showErrorAlert && (
                    <Alert className="border-red-200 bg-red-50">
                        <AlertDescription>{flash?.error}</AlertDescription>
                    </Alert>
                )}

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage User Roles</h1>
                        <p className="text-muted-foreground">
                            Assign and manage roles for system users
                        </p>
                    </div>
                    <Button onClick={handleRefresh} variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Roles</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{roles.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Page</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.current_page} of {users.last_page}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="search">Search Users</Label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search by name or email..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role-filter">Filter by Role</Label>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="none">No Role</SelectItem>
                                        {roles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TableUser 
                            users={users} 
                            roles={roles} 
                            searchTerm={searchTerm}
                            roleFilter={roleFilter}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}