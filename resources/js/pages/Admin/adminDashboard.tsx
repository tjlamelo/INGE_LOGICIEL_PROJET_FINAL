import React from "react";
import AppLayout from "@/layouts/app-layout";
import TableUser from "./user/tableUser";
import { Head } from "@inertiajs/react";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type Props = {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function AdminDashboard({ users }: Props) {
    const breadcrumbs = [
        { title: "Admin Dashboard", href: "/admin/dashboard" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-6">
                <TableUser users={users} roles={[]} />
            </div>
        </AppLayout>
    );
}
