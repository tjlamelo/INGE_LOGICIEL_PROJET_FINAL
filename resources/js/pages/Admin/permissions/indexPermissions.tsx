import AppLayout from '@/layouts/app-layout';
import TableUser from '../user/tableUser';

type User = {
    id: number;
    name: string;
    email: string;
    role: string | null;
};

type Props = {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    roles: string[];
    flash?: { success?: string; error?: string };
};

export default function IndexPermissions({ users, roles, flash }: Props) {
    const breadcrumbs = [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Manage Roles', href: '/admin/permissions' },
    ];

    return (
        <AppLayout>
            {flash?.success && (
                <div className="mb-4 rounded bg-green-100 p-2 text-green-800">
                    {flash.success}
                </div>
            )}
            <TableUser users={users} roles={roles} />
        </AppLayout>
    );
}
