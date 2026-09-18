<?php

namespace App\Services;

use App\Models\EligibilityEvaluation;
use App\Models\RequirementRule;
use App\Models\ScholarshipTrack;
use Illuminate\Support\Str;

/**
 * Evaluates a candidate profile against a track's configurable requirement rules.
 *
 * Thresholds live in requirement_rules, so an administrator can retune eligibility
 * from the control panel without touching this class.
 */
class EligibilityEngine
{
    /**
     * @param  array<string, mixed>  $candidate  keys match RequirementRule::field_name
     * @return array{
     *     decision: string,
     *     score: int,
     *     matched: list<array<string, mixed>>,
     *     failed: list<array<string, mixed>>,
     *     warnings: list<string>
     * }
     */
    public function evaluate(ScholarshipTrack $track, array $candidate, ?string $sessionId = null): array
    {
        $rules = $track->rules()->where('is_active', true)->get();

        $matched = [];
        $failed = [];
        $warnings = [];
        $earned = 0;
        $possible = 0;

        foreach ($rules as $rule) {
            $possible += $rule->weight;
            $provided = $candidate[$rule->field_name] ?? null;

            if ($provided === null || $provided === '') {
                $warnings[] = __('eligibility.missing_field', ['field' => $rule->title]);

                continue;
            }

            $entry = [
                'rule_code' => $rule->rule_code,
                'label' => $rule->title,
                'operator' => $rule->operator,
                'expected' => $rule->expected(),
                'provided' => $provided,
                'weight' => $rule->weight,
            ];

            if ($this->satisfies($rule, $provided)) {
                $earned += $rule->weight;
                $matched[] = $entry;

                continue;
            }

            $entry['message'] = $rule->error_message;
            $failed[] = $entry;
        }

        $score = $possible > 0 ? (int) round(($earned / $possible) * 100) : 0;
        $blocking = collect($failed)->filter(
            fn (array $entry): bool => $rules->firstWhere('rule_code', $entry['rule_code'])?->is_mandatory ?? true,
        );

        $decision = match (true) {
            $blocking->isEmpty() && $warnings === [] => 'eligible',
            $blocking->isEmpty() => 'conditionally_eligible',
            $score >= 60 => 'needs_review',
            default => 'not_eligible',
        };

        EligibilityEvaluation::create([
            'track_id' => $track->id,
            'university_id' => $candidate['university_id'] ?? null,
            'session_id' => $sessionId ?? 'anon-'.Str::lower(Str::random(8)),
            'decision' => $decision,
            'calculated_score' => $score,
            'candidate_data' => $candidate,
            'matched_rules' => $matched,
            'failed_rules' => $failed,
            'warnings' => $warnings,
        ]);

        return [
            'decision' => $decision,
            'score' => $score,
            'matched' => $matched,
            'failed' => $failed,
            'warnings' => $warnings,
        ];
    }

    protected function satisfies(RequirementRule $rule, mixed $provided): bool
    {
        $expected = $rule->expected();

        return match ($rule->operator) {
            '>=' => (float) $provided >= (float) $expected,
            '<=' => (float) $provided <= (float) $expected,
            '>' => (float) $provided > (float) $expected,
            '<' => (float) $provided < (float) $expected,
            '==' => $this->looselyEquals($provided, $expected),
            '!=' => ! $this->looselyEquals($provided, $expected),
            'IN' => in_array($provided, (array) $expected, false),
            'NOT_IN' => ! in_array($provided, (array) $expected, false),
            'CONTAINS' => Str::contains(Str::lower((string) $provided), Str::lower((string) $expected)),
            default => false,
        };
    }

    protected function looselyEquals(mixed $provided, mixed $expected): bool
    {
        if (is_bool($expected)) {
            return filter_var($provided, FILTER_VALIDATE_BOOLEAN) === $expected;
        }

        if (is_numeric($expected) && is_numeric($provided)) {
            return abs((float) $provided - (float) $expected) < 0.0001;
        }

        return Str::lower((string) $provided) === Str::lower((string) $expected);
    }
}
