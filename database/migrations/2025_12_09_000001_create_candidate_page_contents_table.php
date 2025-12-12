<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidate_page_contents', function (Blueprint $table) {
            $table->id();
            $table->uuid('tenant_id');
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->string('hero_photo')->nullable();
            $table->string('about_photo')->nullable();
            $table->string('signature_photo')->nullable();
            $table->text('mission')->nullable();
            $table->text('vision')->nullable();
            $table->json('funfacts')->nullable(); // array of {label, value}
            $table->string('video_url')->nullable();
            $table->string('video_thumb')->nullable();
            $table->longText('privacy_policy')->nullable();
            $table->longText('about_us')->nullable();
            $table->longText('custom_css')->nullable();
            $table->longText('custom_js')->nullable();
            $table->string('brand_logo')->nullable();
            $table->string('footer_banner')->nullable();
            $table->timestamps();

            $table->unique('candidate_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_page_contents');
    }
};

