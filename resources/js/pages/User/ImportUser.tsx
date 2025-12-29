import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

export default function ImportUser() {
    const breadcrumbs = [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Import Users", href: "/import/users" },
    ];

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert("Veuillez sélectionner un fichier.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        // Appel Inertia ou fetch pour envoyer le fichier au backend
        router.post("/import/users", formData, {
            forceFormData: true,
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Importation des utilisateurs
                </h1>

                <div className="bg-white dark:bg-neutral-800 shadow rounded-lg p-6">
                    <form onSubmit={handleUpload}>
                        <div className="mb-4">
                            <label className="block font-medium mb-2">
                                Fichier CSV / Excel
                            </label>
                            <input
                                type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                className="border rounded-lg p-2 w-full"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setFile(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? "Importation..." : "Importer"}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
