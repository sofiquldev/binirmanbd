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
        // Create election_manifesto_categories table first
        Schema::create('election_manifesto_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_bn')->nullable();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('description_bn')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Create election_manifestos table with foreign key to categories
        Schema::create('election_manifestos', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('election_manifesto_categories')->cascadeOnDelete();
            
            $table->string('title');
            $table->string('title_bn')->nullable();
            $table->text('description');
            $table->text('description_bn')->nullable();
            
            $table->json('meta')->nullable();
            $table->unsignedInteger('views')->default(0);
            $table->unsignedInteger('likes')->default(0);
            $table->unsignedInteger('dislikes')->default(0);
            $table->boolean('is_visible')->default(true);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('election_manifestos');
        Schema::dropIfExists('election_manifesto_categories');
    }
};
