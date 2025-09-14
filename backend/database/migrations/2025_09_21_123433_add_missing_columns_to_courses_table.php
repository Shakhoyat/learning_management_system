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
        Schema::table('courses', function (Blueprint $table) {
            $table->string('slug')->unique()->after('title');
            $table->string('short_description')->nullable()->after('slug');
            $table->decimal('discount_price', 10, 2)->nullable()->after('price');
            $table->string('level')->default('beginner')->after('description');
            $table->integer('duration_hours')->nullable()->after('level');
            $table->integer('max_students')->nullable()->after('duration_hours');
            $table->boolean('is_featured')->default(false)->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'short_description',
                'discount_price',
                'level',
                'duration_hours',
                'max_students',
                'is_featured'
            ]);
        });
    }
};
