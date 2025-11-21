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
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // creator (for offline entries)

            $table->string('donor_name');
            $table->string('donor_name_bn')->nullable();
            $table->string('donor_id_number')->nullable();
            $table->string('donor_phone')->nullable();
            $table->string('donor_email')->nullable();

            $table->enum('source', ['online', 'offline'])->default('online');
            $table->enum('method', ['sslcommerz', 'bkash', 'nagad', 'stripe', 'cash', 'bank', 'cheque'])->nullable();
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('BDT');

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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
