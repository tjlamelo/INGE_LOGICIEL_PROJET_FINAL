import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

interface Salle {
  id: number;
  nom: string;
  capacite?: number;
  type?: string;
}

interface Props {
  salles: {
    data: Salle[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function SalleIndex({ salles, flash }: Props) {
  return (
    <AppLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Liste des Salles</h1>

        {flash?.success && (
          <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">
            {flash.success}
          </div>
        )}

        <Link
          href="/salles/create"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
        >
          Ajouter une Salle
        </Link>

        <table className="min-w-full border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Capacité</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salles.data.map((salle) => (
              <tr key={salle.id}>
                <td className="border px-4 py-2">{salle.id}</td>
                <td className="border px-4 py-2">{salle.nom}</td>
                <td className="border px-4 py-2">{salle.capacite ?? '-'}</td>
                <td className="border px-4 py-2">{salle.type ?? '-'}</td>
                <td className="border px-4 py-2">
                  <Link
                    href={`/salles/${salle.id}/edit`}
                    className="text-blue-500 mr-2"
                  >
                    Modifier
                  </Link>
                  <Link
                    href={`/salles/${salle.id}`}
                    method="delete"
                    as="button"
                    className="text-red-500"
                  >
                    Supprimer
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
