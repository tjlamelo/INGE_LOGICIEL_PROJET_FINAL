<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'admin',
            'student',
            'teacher',
            'general_supervisor',
            'censor',
            'principal',
            'guest'

        ];

        foreach ($roles as $roleName)
            Role::firstOrCreate(['name' => $roleName]);
    }
}
