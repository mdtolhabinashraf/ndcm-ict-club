<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image',
        'terms_condition',
        'folder_path',
        'location',
        'registration_for',
        'registration_fee',
        'registration_start',
        'registration_end',
        'start',
        'end',
        'contact_details',
        'status',
    ];
}
