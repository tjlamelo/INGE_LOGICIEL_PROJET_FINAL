import React from "react";
import PermissionsForm from "../permissions/permissionsForm";
import { router } from "@inertiajs/react";

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
};

export default function TableUser({ users, roles }: Props) {
    return (
        <div>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Role</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.data.map((user) => (
                        <tr key={user.id}>
                            <td className="border px-4 py-2">{user.id}</td>
                            <td className="border px-4 py-2">{user.name}</td>
                            <td className="border px-4 py-2">{user.email}</td>
                            <td className="border px-4 py-2">{user.role || "No role"}</td>
                            <td className="border px-4 py-2">
                                <PermissionsForm user={user} roles={roles} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex justify-between">
                {users.current_page > 1 && (
                    <button
                        onClick={() =>
                            router.get("/admin/permissions", { page: users.current_page - 1 }, { preserveState: true })
                        }
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Previous
                    </button>
                )}
                {users.current_page < users.last_page && (
                    <button
                        onClick={() =>
                            router.get("/admin/permissions", { page: users.current_page + 1 }, { preserveState: true })
                        }
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}
