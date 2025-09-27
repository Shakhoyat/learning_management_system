<?php<?php



namespace App\Models;namespace App\Models;



use Illuminate\Database\Eloquent\Model;use Illuminate\Database\Eloquent\Model;



class QuizQuestion extends Modelclass QuizQuestion extends Model

{{

    protected $fillable = [    protected $fillable = [

        'quiz_id', 'type', 'question', 'options', 'correct_answers',        'quiz_id', 'type', 'question', 'options', 'correct_answers',

        'explanation', 'points', 'order_position', 'case_sensitive'        'explanation', 'points', 'order_position', 'case_sensitive'

    ];    ];



    protected $casts = [    protected $casts = [

        'options' => 'array',        'options' => 'array',

        'correct_answers' => 'array',        'correct_answers' => 'array',

        'points' => 'decimal:2',        'points' => 'decimal:2',

        'case_sensitive' => 'boolean',        'case_sensitive' => 'boolean',

    ];    ];



    public function quiz()    public function quiz()

    {    {

        return $this->belongsTo(Quiz::class);        return $this->belongsTo(Quiz::class);

    }    }

}}space App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    //
}
