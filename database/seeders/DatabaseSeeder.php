<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Tyro roles first
        $this->call(TyroRolesSeeder::class);
        
        // Seed Tyro privileges and attach to roles
        $this->call(TyroPrivilegesSeeder::class);
        
        // Seed users
        $this->call(UserSeeder::class);

        // Seed payment methods
        $this->call(PaymentMethodsSeeder::class);

        // Then seed other data
        $this->call(DistrictsSeeder::class);
        $this->call(TemplateSeeder::class);
        $this->call(CandidatesSeeder::class);
        $this->call(DonationsSeeder::class);
        $this->call(ObjectionsSeeder::class);
        $this->call(EventsSeeder::class);
        $this->call(PollsSeeder::class);
        $this->call(ContactsSeeder::class);
        $this->call(TestimonialsSeeder::class);
        $this->call(ElectionManifestosSeeder::class);
        $this->call(CandidatePageContentSeeder::class);
    }
}
