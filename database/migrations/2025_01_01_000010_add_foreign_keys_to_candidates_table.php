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
        Schema::table('candidates', function (Blueprint $table) {
            $table->foreign('party_id')
                ->references('id')
                ->on('parties')
                ->nullOnDelete();
            
            $table->foreign('constituency_id')
                ->references('id')
                ->on('constituencies')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropForeign(['party_id']);
            $table->dropForeign(['constituency_id']);
        });
    }
};

