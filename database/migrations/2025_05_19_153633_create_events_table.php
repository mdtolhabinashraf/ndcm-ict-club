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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable()->default(null);
            $table->string('image')->nullable()->default(null);
            $table->string('terms_condition')->nullable()->default(null);
            $table->string('folder_path')->nullable()->default(null);
            $table->string('location');
            $table->decimal('registration_fee', 10, 2)->default(0.00);
            $table->string('registration_for');
            $table->timestamp('registration_start')->nullable()->default(null);
            $table->timestamp('registration_end')->nullable()->default(null);
            $table->timestamp('start');
            $table->timestamp('end')->nullable()->default(null);
            $table->json('contact_details')->nullable()->default(null);
            $table->enum('status', ['Hidden', 'Publish']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
