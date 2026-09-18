<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    public function store(Request $request, AuditLogger $audit): RedirectResponse
    {
        $validated = $request->validate([
            'requester_name' => ['required', 'string', 'max:160'],
            'requester_national_id' => ['nullable', 'digits:10'],
            'requester_email' => ['required', 'email', 'max:190'],
            'requester_phone' => ['required', 'string', 'max:32'],
            'cultural_mission_id' => ['nullable', 'exists:cultural_missions,id'],
            'type' => ['required', Rule::in(array_keys(__('operations.appointment_types')))],
            'subject' => ['required', 'string', 'max:190'],
            'description' => ['nullable', 'string', 'max:2000'],
            'preferred_date' => ['required', 'date', 'after_or_equal:today'],
            'preferred_time' => ['required', 'string', 'max:16'],
        ]);

        $appointment = Appointment::create([
            ...$validated,
            'status' => 'pending',
        ]);

        $audit->record(
            action: 'CREATE',
            entityType: 'APPOINTMENT',
            entityId: $appointment->id,
            entityLabel: $appointment->subject,
            summary: 'طلب موعد استشاري جديد من '.$appointment->requester_name,
        );

        return back()
            ->with('appointment_reference', $appointment->id)
            ->with('status', __('pages.help.appointment_form.success'));
    }
}
