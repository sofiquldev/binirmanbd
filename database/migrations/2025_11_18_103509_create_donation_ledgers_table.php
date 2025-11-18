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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_ledgers');
    }
};
