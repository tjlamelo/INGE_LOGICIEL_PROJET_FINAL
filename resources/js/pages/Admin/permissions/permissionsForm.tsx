import React, { useState } from "react";
import { router } from "@inertiajs/react";

type User = {
    id: number;
    name: string;
    email: string;
    role: string | null;
};

type Props = {
    user: User;
    roles: string[];
};

export default function PermissionsForm({ user, roles }: Props) {
    const [editing, setEditing] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user.role || "");

    const handleSave = () => {
        router.put(`/admin/users/${user.id}/role`, { role: selectedRole }, { preserveState: true });
        setEditing(false);
    };

    const handleRemove = () => {
        if (confirm(`Are you sure you want to remove the role from ${user.name}?`)) {
            router.put(`/admin/users/${user.id}/role`, { role: null }, { preserveState: true });
        }
    };

    return editing ? (
        <div className="flex gap-2">
            <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border px-2 py-1 rounded"
            >
                <option value="">No role</option>
                {roles.map((role) => (
                    <option key={role} value={role}>
                        {role}
                    </option>
                ))}
            </select>
            <button onClick={handleSave} className="px-2 py-1 bg-green-500 text-white rounded">
                Save
            </button>
            <button onClick={() => setEditing(false)} className="px-2 py-1 bg-gray-400 text-white rounded">
                Cancel
            </button>
        </div>
    ) : (
        <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="px-2 py-1 bg-blue-500 text-white rounded">
                Edit
            </button>
            <button onClick={handleRemove} className="px-2 py-1 bg-red-500 text-white rounded">
                Remove Role
            </button>
        </div>
    );
}
