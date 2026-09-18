<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A run of the rule-based eligibility engine, kept for transparency.
 */
class EligibilityEvaluation extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'candidate_data' => 'array',
            'matched_rules' => 'array',
            'failed_rules' => 'array',
            'warnings' => 'array',
        ];
    }
}
