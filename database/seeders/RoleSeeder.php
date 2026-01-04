<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'admin',
            'student',
            'teacher',
            'form_teacher', // Ajouté ici : Enseignant Titulaire
            'general_supervisor',
            'censor',
            'principal',
            'guest'
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }
    }
}