import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";

export default function Create() {
  const { data, setData, post, errors } = useForm({
    nom: "",
    capacite: "",
    type: ""
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("salles.store"));
  };

  return (
    <AppLayout>
      <Head title="Créer une salle" />
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Créer une nouvelle salle</h1>
        <form onSubmit={submit} className="space-y-4 max-w-md">
          <div>
            <label>Nom</label>
            <input
              type="text"
              value={data.nom}
              onChange={e => setData("nom", e.target.value)}
              className="w-full border p-2 rounded"
            />
            {errors.nom && <div className="text-red-500">{errors.nom}</div>}
          </div>

          <div>
            <label>Capacité</label>
            <input
              type="number"
              value={data.capacite}
              onChange={e => setData("capacite", e.target.value)}
              className="w-full border p-2 rounded"
            />
            {errors.capacite && <div className="text-red-500">{errors.capacite}</div>}
          </div>

          <div>
            <label>Type</label>
            <input
              type="text"
              value={data.type}
              onChange={e => setData("type", e.target.value)}
              className="w-full border p-2 rounded"
            />
            {errors.type && <div className="text-red-500">{errors.type}</div>}
          </div>

          <Button type="submit">Créer</Button>
        </form>
      </div>
    </AppLayout>
  );
}
