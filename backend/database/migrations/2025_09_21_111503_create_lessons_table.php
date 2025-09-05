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
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->string('title');
            $table->longText('content')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('duration')->nullable(); // minutes
            $table->unsignedInteger('order_index')->default(0);
            $table->timestamps();

            $table->index(['module_id', 'order_index']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('lessons');
    }
}