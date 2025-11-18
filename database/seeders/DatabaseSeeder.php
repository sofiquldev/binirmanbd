<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create core roles
        $superAdmin     = Role::firstOrCreate(['name' => User::ROLE_SUPER_ADMIN, 'guard_name' => 'web']);
        $candidateAdmin = Role::firstOrCreate(['name' => User::ROLE_CANDIDATE_ADMIN, 'guard_name' => 'web']);
        $teamMember     = Role::firstOrCreate(['name' => User::ROLE_TEAM_MEMBER, 'guard_name' => 'web']);
        $volunteer      = Role::firstOrCreate(['name' => User::ROLE_VOLUNTEER, 'guard_name' => 'web']);

        $this->call(TemplateSeeder::class);

        // Create initial Super Admin
        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@binirmanbd.com'],
            [
                'name' => 'Binirman BD Super Admin',
                'password' => Hash::make('password'),
            ]
        );

        if (! $admin->hasRole($superAdmin->name)) {
            $admin->assignRole($superAdmin);
        }
    }
}
