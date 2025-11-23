<?php

namespace Database\Seeders;

use App\Models\User;
use HasinHayder\Tyro\Models\Role;
use Illuminate\Database\Seeder;

class TyroRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles using Tyro's Role model
        $roles = [
            [
                'name' => 'Super Admin',
                'slug' => User::ROLE_SUPER_ADMIN,
            ],
            [
                'name' => 'Candidate Admin',
                'slug' => User::ROLE_CANDIDATE_ADMIN,
            ],
            [
                'name' => 'Team Member',
                'slug' => User::ROLE_TEAM_MEMBER,
            ],
            [
                'name' => 'Volunteer',
                'slug' => User::ROLE_VOLUNTEER,
            ],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['slug' => $roleData['slug']],
                ['name' => $roleData['name']]
            );
        }

        $this->command->info('Tyro roles seeded successfully!');
    }
}
