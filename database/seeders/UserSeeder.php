<?php

namespace Database\Seeders;

use App\Models\User;
use HasinHayder\Tyro\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles using Tyro's Role model (by slug)
        $superAdminRole = Role::where('slug', User::ROLE_SUPER_ADMIN)->first();
        $candidateAdminRole = Role::where('slug', User::ROLE_CANDIDATE_ADMIN)->first();
        $teamMemberRole = Role::where('slug', User::ROLE_TEAM_MEMBER)->first();
        $volunteerRole = Role::where('slug', User::ROLE_VOLUNTEER)->first();

        // Create Super Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@binirmanbd.com'],
            [
                'name' => 'Binirman BD Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if ($superAdminRole && !$admin->hasRole(User::ROLE_SUPER_ADMIN)) {
            $admin->roles()->attach($superAdminRole->id);
        }

        // Create additional test users for different roles
        $candidateAdminUser = User::firstOrCreate(
            ['email' => 'candidate@binirmanbd.com'],
            [
                'name' => 'Candidate Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if ($candidateAdminRole && !$candidateAdminUser->hasRole(User::ROLE_CANDIDATE_ADMIN)) {
            $candidateAdminUser->roles()->attach($candidateAdminRole->id);
        }

        $teamMemberUser = User::firstOrCreate(
            ['email' => 'team@binirmanbd.com'],
            [
                'name' => 'Team Member',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if ($teamMemberRole && !$teamMemberUser->hasRole(User::ROLE_TEAM_MEMBER)) {
            $teamMemberUser->roles()->attach($teamMemberRole->id);
        }

        $this->command->info('Users seeded successfully!');
        $this->command->info('Super Admin: admin@binirmanbd.com / password');
        $this->command->info('Candidate Admin: candidate@binirmanbd.com / password');
        $this->command->info('Team Member: team@binirmanbd.com / password');
    }
}
