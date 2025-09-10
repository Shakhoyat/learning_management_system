<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLessonsTable extends Migration
{
    public function up()
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('video_url')->nullable();
            $table->string('video_duration')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->integer('order')->default(0);
            $table->enum('type', ['video', 'text', 'quiz', 'assignment'])->default('video');
            $table->boolean('is_preview')->default(false);
            $table->boolean('is_published')->default(true);
            $table->json('resources')->nullable(); // downloadable files, links, etc.
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->timestamps();

            $table->index(['module_id', 'order']);
            $table->index(['type']);
            $table->index(['is_preview']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('lessons');
    }
}