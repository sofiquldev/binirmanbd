<?php

namespace Database\Seeders;

use HasinHayder\Tyro\Models\Privilege;
use HasinHayder\Tyro\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class TyroPrivilegesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define all privileges for the application
        $privileges = [
            // Candidates
            ['slug' => 'candidates.view', 'name' => 'View Candidates'],
            ['slug' => 'candidates.create', 'name' => 'Create Candidates'],
            ['slug' => 'candidates.update', 'name' => 'Update Candidates'],
            ['slug' => 'candidates.delete', 'name' => 'Delete Candidates'],
            
            // Parties
            ['slug' => 'parties.view', 'name' => 'View Parties'],
            ['slug' => 'parties.create', 'name' => 'Create Parties'],
            ['slug' => 'parties.update', 'name' => 'Update Parties'],
            ['slug' => 'parties.delete', 'name' => 'Delete Parties'],
            
            // Constituencies
            ['slug' => 'constituencies.view', 'name' => 'View Constituencies'],
            ['slug' => 'constituencies.create', 'name' => 'Create Constituencies'],
            ['slug' => 'constituencies.update', 'name' => 'Update Constituencies'],
            ['slug' => 'constituencies.delete', 'name' => 'Delete Constituencies'],
            
            // Users
            ['slug' => 'users.view', 'name' => 'View Users'],
            ['slug' => 'users.create', 'name' => 'Create Users'],
            ['slug' => 'users.update', 'name' => 'Update Users'],
            ['slug' => 'users.delete', 'name' => 'Delete Users'],
            
            // Templates
            ['slug' => 'templates.view', 'name' => 'View Templates'],
            ['slug' => 'templates.create', 'name' => 'Create Templates'],
            ['slug' => 'templates.update', 'name' => 'Update Templates'],
            ['slug' => 'templates.delete', 'name' => 'Delete Templates'],
            
            // Donations
            ['slug' => 'donations.view', 'name' => 'View Donations'],
            ['slug' => 'donations.create', 'name' => 'Create Donations'],
            ['slug' => 'donations.update', 'name' => 'Update Donations'],
            ['slug' => 'donations.delete', 'name' => 'Delete Donations'],
            
            // Feedback
            ['slug' => 'feedback.view', 'name' => 'View Feedback'],
            ['slug' => 'feedback.create', 'name' => 'Create Feedback'],
            ['slug' => 'feedback.update', 'name' => 'Update Feedback'],
            ['slug' => 'feedback.delete', 'name' => 'Delete Feedback'],
            
            // Contacts
            ['slug' => 'contacts.view', 'name' => 'View Contacts'],
            ['slug' => 'contacts.create', 'name' => 'Create Contacts'],
            ['slug' => 'contacts.update', 'name' => 'Update Contacts'],
            ['slug' => 'contacts.delete', 'name' => 'Delete Contacts'],
            
            // Events
            ['slug' => 'events.view', 'name' => 'View Events'],
            ['slug' => 'events.create', 'name' => 'Create Events'],
            ['slug' => 'events.update', 'name' => 'Update Events'],
            ['slug' => 'events.delete', 'name' => 'Delete Events'],
            
            // Polls
            ['slug' => 'polls.view', 'name' => 'View Polls'],
            ['slug' => 'polls.create', 'name' => 'Create Polls'],
            ['slug' => 'polls.update', 'name' => 'Update Polls'],
            ['slug' => 'polls.delete', 'name' => 'Delete Polls'],
            
            // Announcements
            ['slug' => 'announcements.view', 'name' => 'View Announcements'],
            ['slug' => 'announcements.create', 'name' => 'Create Announcements'],
            ['slug' => 'announcements.update', 'name' => 'Update Announcements'],
            ['slug' => 'announcements.delete', 'name' => 'Delete Announcements'],
            
            // Appointments
            ['slug' => 'appointments.view', 'name' => 'View Appointments'],
            ['slug' => 'appointments.create', 'name' => 'Create Appointments'],
            ['slug' => 'appointments.update', 'name' => 'Update Appointments'],
            ['slug' => 'appointments.delete', 'name' => 'Delete Appointments'],
            
            // Knowledge Base
            ['slug' => 'knowledge.view', 'name' => 'View Knowledge Base'],
            ['slug' => 'knowledge.create', 'name' => 'Create Knowledge Base'],
            ['slug' => 'knowledge.update', 'name' => 'Update Knowledge Base'],
            ['slug' => 'knowledge.delete', 'name' => 'Delete Knowledge Base'],
            
            // Engagement
            ['slug' => 'engagement.view', 'name' => 'View Engagement'],
            ['slug' => 'engagement.create', 'name' => 'Create Engagement'],
            ['slug' => 'engagement.update', 'name' => 'Update Engagement'],
            ['slug' => 'engagement.delete', 'name' => 'Delete Engagement'],
            
            // Manifestos
            ['slug' => 'manifestos.view', 'name' => 'View Manifestos'],
            ['slug' => 'manifestos.create', 'name' => 'Create Manifestos'],
            ['slug' => 'manifestos.update', 'name' => 'Update Manifestos'],
            ['slug' => 'manifestos.delete', 'name' => 'Delete Manifestos'],
            
            // Payment Methods
            ['slug' => 'payment-methods.view', 'name' => 'View Payment Methods'],
            ['slug' => 'payment-methods.create', 'name' => 'Create Payment Methods'],
            ['slug' => 'payment-methods.update', 'name' => 'Update Payment Methods'],
            ['slug' => 'payment-methods.delete', 'name' => 'Delete Payment Methods'],
            ['slug' => 'payment-methods.activate', 'name' => 'Activate/Deactivate Payment Methods'],
            
            // Settings
            ['slug' => 'settings.view', 'name' => 'View Settings'],
            ['slug' => 'settings.general', 'name' => 'Manage General Settings'],
            ['slug' => 'settings.system', 'name' => 'Manage System Settings'],
            ['slug' => 'settings.roles', 'name' => 'Manage Roles & Permissions'],
            ['slug' => 'settings.email', 'name' => 'Manage Email Settings'],
        ];

        // Create privileges
        foreach ($privileges as $privilegeData) {
            Privilege::firstOrCreate(
                ['slug' => $privilegeData['slug']],
                ['name' => $privilegeData['name']]
            );
        }

        $this->command->info('Privileges created successfully!');

        // Attach all privileges to super-admin role
        $superAdminRole = Role::where('slug', User::ROLE_SUPER_ADMIN)->first();
        if ($superAdminRole) {
            $allPrivileges = Privilege::all();
            $superAdminRole->privileges()->sync($allPrivileges->pluck('id'));
            $this->command->info('All privileges attached to super-admin role!');
        }

        // Attach view privileges to candidate-admin role
        $candidateAdminRole = Role::where('slug', User::ROLE_CANDIDATE_ADMIN)->first();
        if ($candidateAdminRole) {
            $viewPrivileges = Privilege::whereIn('slug', [
                'candidates.view',
                'donations.view',
                'feedback.view',
                'contacts.view',
                'events.view',
                'polls.view',
                'announcements.view',
                'appointments.view',
                'knowledge.view',
                'engagement.view',
                'templates.view',
                'manifestos.view',
                'payment-methods.view',
            ])->get();
            $candidateAdminRole->privileges()->sync($viewPrivileges->pluck('id'));
            $this->command->info('View privileges attached to candidate-admin role!');
        }

        // Attach view privileges to team-member role
        $teamMemberRole = Role::where('slug', User::ROLE_TEAM_MEMBER)->first();
        if ($teamMemberRole) {
            $viewPrivileges = Privilege::whereIn('slug', [
                'candidates.view',
                'donations.view',
                'feedback.view',
                'contacts.view',
                'events.view',
                'polls.view',
                'announcements.view',
                'appointments.view',
                'knowledge.view',
                'engagement.view',
                'templates.view',
                'manifestos.view',
                'payment-methods.view',
            ])->get();
            $teamMemberRole->privileges()->sync($viewPrivileges->pluck('id'));
            $this->command->info('View privileges attached to team-member role!');
        }

        $this->command->info('Tyro privileges seeded successfully!');
    }
}

