<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulesTable extends Migration
{
    public function up()
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('title');
            $table->unsignedInteger('order_index')->default(0);
            $table->timestamps();

            $table->index(['course_id', 'order_index']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('modules');
    }
}