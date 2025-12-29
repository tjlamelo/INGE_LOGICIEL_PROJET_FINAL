<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupération des rôles existants
        $roles = Role::all()->pluck('name')->toArray();

        // Crée un admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        // Crée un teacher
        $teacher = User::firstOrCreate(
            ['email' => 'teacher@example.com'],
            [
                'name' => 'Teacher User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $teacher->assignRole('teacher');

        // Crée des élèves (plus nombreux)
        for ($i = 1; $i <= 15; $i++) {
            $student = User::firstOrCreate(
                ['email' => "student{$i}@example.com"],
                [
                    'name' => "Student {$i}",
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $student->assignRole('student');
        }

        // Crée d'autres rôles si besoin
        $otherRoles = ['general_supervisor', 'censor', 'principal', 'guest'];
        foreach ($otherRoles as $role) {
            $user = User::firstOrCreate(
                ['email' => "{$role}@example.com"],
                [
                    'name' => ucfirst(str_replace('_', ' ', $role)),
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole($role);
        }
    }
}
