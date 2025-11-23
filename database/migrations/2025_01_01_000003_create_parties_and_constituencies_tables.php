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
        Schema::create('parties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_bn')->nullable();
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->text('about')->nullable();
            $table->text('about_bn')->nullable();
            $table->text('history')->nullable();
            $table->text('history_bn')->nullable();
            $table->string('website')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('constituencies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_bn')->nullable();
            $table->string('slug')->unique();
            $table->string('district')->nullable();
            $table->string('district_bn')->nullable();
            $table->text('about')->nullable();
            $table->text('about_bn')->nullable();
            $table->text('history')->nullable();
            $table->text('history_bn')->nullable();
            $table->json('boundaries')->nullable();
            $table->integer('population')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('constituencies');
        Schema::dropIfExists('parties');
    }
};

