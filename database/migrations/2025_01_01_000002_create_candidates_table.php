<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Stancl\Tenancy\Database\Models\Tenant;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Tenant::class, 'tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->string('name_bn')->nullable();
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->unsignedBigInteger('template_id')->nullable();
            $table->unsignedBigInteger('party_id')->nullable();
            $table->unsignedBigInteger('constituency_id')->nullable();
            $table->string('campaign_slogan')->nullable();
            $table->string('campaign_slogan_bn')->nullable();
            $table->text('campaign_goals')->nullable();
            $table->text('campaign_goals_bn')->nullable();
            $table->longText('about')->nullable();
            $table->longText('about_bn')->nullable();
            $table->longText('history')->nullable();
            $table->longText('history_bn')->nullable();
            $table->string('primary_domain')->nullable();
            $table->string('custom_domain')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->boolean('translator_enabled')->default(true);
            $table->json('supported_languages')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};

