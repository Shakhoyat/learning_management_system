<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateReviewsTable extends Migration
{
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->index(['course_id', 'rating']);
        });

        // Postgres CHECK constraint to ensure rating 1..5 (safe because you're using Postgres)
        DB::statement('ALTER TABLE reviews ADD CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)');
    }

    public function down()
    {
        Schema::dropIfExists('reviews');
    }
}