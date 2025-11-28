<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Payment Methods Table (master table for all payment methods)
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('name_bn')->nullable();
            $table->text('description')->nullable();
            $table->text('description_bn')->nullable();
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('requires_credentials')->default(false);
            $table->boolean('is_online')->default(false);
            $table->json('config_fields')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 2. Donations Table
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Donor information
            $table->string('donor_name');
            $table->string('donor_name_bn')->nullable();
            $table->string('donor_id_number')->nullable();
            $table->string('donor_phone')->nullable();
            $table->string('donor_email')->nullable();

            // Payment information
            $table->enum('source', ['online', 'offline'])->default('online');
            $table->enum('method', ['sslcommerz', 'bkash', 'nagad', 'stripe', 'cash', 'bank', 'cheque', 'default'])->nullable();
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('BDT');

            // Status and tracking
            $table->enum('status', ['pending', 'processing', 'verified', 'rejected', 'refunded'])->default('pending');
            $table->string('payment_gateway')->nullable();
            $table->string('transaction_reference')->nullable()->unique();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->string('proof_path')->nullable();
            $table->text('notes')->nullable();
            $table->json('meta')->nullable();

            $table->timestamps();
        });

        // 3. Donation Ledgers Table
        Schema::create('donation_ledgers', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('donation_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();

            $table->enum('entry_type', ['credit', 'debit']);
            $table->enum('wallet', ['central', 'candidate'])->default('central');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('BDT');
            $table->decimal('balance_after', 12, 2)->nullable();
            $table->string('source')->nullable();
            $table->text('description')->nullable();
            $table->json('meta')->nullable();

            $table->timestamps();
        });

        // 4. Candidate Payment Methods Table (pivot: candidates <-> payment_methods)
        Schema::create('candidate_payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_method_id')->constrained()->cascadeOnDelete();

            // Method-specific configuration (JSON)
            $table->json('config')->nullable();

            // Status and ordering
            $table->boolean('is_enabled')->default(true);
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            // Unique constraint
            $table->unique(['candidate_id', 'payment_method_id']);
        });

        // 5. Candidate Donation Settings Table
        Schema::create('candidate_donation_settings', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->foreignId('candidate_id')->unique()->constrained()->cascadeOnDelete();

            // Donation enabled/disabled
            $table->boolean('donations_enabled')->default(true);

            // Form customization
            $table->string('form_title')->nullable();
            $table->string('form_title_bn')->nullable();
            $table->text('form_description')->nullable();
            $table->text('form_description_bn')->nullable();
            $table->text('success_message')->nullable();
            $table->text('success_message_bn')->nullable();

            // Amount settings
            $table->decimal('minimum_amount', 12, 2)->default(10.00);
            $table->decimal('maximum_amount', 12, 2)->nullable();
            $table->json('suggested_amounts')->nullable();

            // Currency settings
            $table->string('default_currency', 3)->default('BDT');
            $table->json('allowed_currencies')->nullable();

            // Field requirements
            $table->boolean('require_donor_id')->default(false);
            $table->boolean('require_donor_phone')->default(false);
            $table->boolean('require_donor_email')->default(false);
            $table->boolean('show_donor_name_bn')->default(true);

            // QR code
            $table->string('qr_code_path')->nullable();
            $table->string('qr_code_url')->nullable();

            // Thank you page
            $table->text('thank_you_message')->nullable();
            $table->text('thank_you_message_bn')->nullable();
            $table->string('thank_you_redirect_url')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_donation_settings');
        Schema::dropIfExists('candidate_payment_methods');
        Schema::dropIfExists('donation_ledgers');
        Schema::dropIfExists('donations');
        Schema::dropIfExists('payment_methods');
    }
};

