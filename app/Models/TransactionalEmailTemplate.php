<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionalEmailTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_key',
        'subject',
        'body',
    ];
}
