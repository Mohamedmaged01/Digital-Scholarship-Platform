<section class="grid grid-cols-1 gap-6 lg:grid-cols-3">

    <div class="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-8 lg:col-span-2">
        <header class="space-y-1">
            <h2 class="text-lg font-bold text-slate-900">{{ __('pages.help.appointment_form.title') }}</h2>
            <p class="text-xs leading-relaxed text-slate-600">{{ __('pages.help.appointment_form.intro') }}</p>
        </header>

        @if (session('appointment_reference'))
            <div class="flex items-start gap-3 rounded-2xl border border-saudi-200 bg-saudi-50 p-4" role="status">
                <x-lucide-circle-check class="mt-0.5 size-5 shrink-0 text-saudi-600" aria-hidden="true" />
                <div class="space-y-1 text-xs">
                    <p class="font-bold text-saudi-900">{{ __('pages.help.appointment_form.success') }}</p>
                    <p class="text-saudi-800">
                        {{ __('pages.help.appointment_form.reference') }}:
                        <code class="numeric rounded bg-white px-1.5 py-0.5 font-mono font-bold">{{ session('appointment_reference') }}</code>
                    </p>
                </div>
            </div>
        @endif

        @if ($errors->any())
            <div class="space-y-1 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800" role="alert">
                <p class="flex items-center gap-2 font-bold">
                    <x-lucide-circle-alert class="size-4 shrink-0" aria-hidden="true" />
                    {{ __('common.error') }}
                </p>
                <ul class="list-disc space-y-0.5 ps-5">
                    @foreach ($errors->all() as $message)
                        <li>{{ $message }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="post" action="{{ route('appointments.store') }}" class="space-y-4">
            @csrf

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label class="space-y-1.5">
                    <span class="block text-xs font-bold text-slate-700">{{ __('pages.help.appointment_form.name') }} <span class="text-rose-600" aria-hidden="true">*</span></span>
                    <input type="text" name="requester_name" value="{{ old('requester_name') }}" required maxlength="160"
                           class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20">
                </label>

                <label class="space-y-1.5">
                    <span class="block text-xs font-bold text-slate-700">{{ __('pages.help.appointment_form.national_id') }}</span>
                    <input type="text" name="requester_national_id" value="{{ old('requester_national_id') }}"
                           inputmode="numeric" pattern="[0-9]{10}" maxlength="10" dir="ltr"
                           class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20">
                </label>

                <label class="space-y-1.5">
                    <span class="block text-xs font-bold text-slate-700">{{ __('pages.help.appointment_form.email') }} <span class="text-rose-600" aria-hidden="true">*</span></span>
                    <input type="email" name="requester_email" value="{{ old('requester_email') }}" required dir="ltr"
                           class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20">
                </label>

                <label class="space-y-1.5">
                    <span class="block text-xs font-bold text-slate-700">{{ __('pages.help.appointment_form.phone') }} <span class="text-rose-600" aria-hidden="true">*</span></span>
                    <input type="tel" name="requester_phone" value="{{ old('requester_phone', '+966') }}" required dir="ltr"
                           class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20">
                </label>

                <label class="space-y-1.5">
                    <span class="block text-xs font-bold text-slate-700">{{ __('pages.help.appointment_form.mission') }}</span>
                    <select name="cultural_mission_id"
                            class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20">
                        <option value="">{{ __('pages.help.appointment_form.mission_any') }}</option>
                        @foreach ($missions as $mission)
                            <option value="{{ $mission->id }}" @selected(old('cultural_mission_id') === $mission->id)>
                                {{ $mission->country }} — {{ $mission->city }}
                            </option>
                        @endforeach
                    </select>
                </label>

                <label class="space-y-1.5">
                    <span class="block text-xs font-bold text-slate-700">{{ __('pages.help.appointment_form.type') }} <span class="text-rose-600" aria-hidden="true">*</span></span>
                    <select name="type" required
                            class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20">
                        @foreach ($appointmentTypes as $value => $label)
                            <option value="{{ $value }}" @selected(old('type') === $value)>{{ $label }}</option>
                        @endforeach
                    </select>
                </label>

                <label class="space-y-1.5">
                    <span class="block text-xs font-bold text-slate-700">{{ __('pages.help.appointment_form.date') }} <span class="text-rose-600" aria-hidden="true">*</span></span>
                    <input type="date" name="preferred_date" value="{{ old('preferred_date', now()->addDay()->toDateString()) }}"
                           min="{{ now()->toDateString() }}" required
                           class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20">
                </label>

                <label class="space-y-1.5">
                    <span class="block text-xs font-bold text-slate-700">{{ __('pages.help.appointment_form.time') }} <span class="text-rose-600" aria-hidden="true">*</span></span>
                    <input type="time" name="preferred_time" value="{{ old('preferred_time', '10:00') }}" required
                           class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20">
                </label>
            </div>

            <label class="block space-y-1.5">
                <span class="block text-xs font-bold text-slate-700">{{ __('pages.help.appointment_form.subject') }} <span class="text-rose-600" aria-hidden="true">*</span></span>
                <input type="text" name="subject" value="{{ old('subject') }}" required maxlength="190"
                       class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20">
            </label>

            <label class="block space-y-1.5">
                <span class="block text-xs font-bold text-slate-700">{{ __('pages.help.appointment_form.description') }}</span>
                <textarea name="description" rows="4" maxlength="2000"
                          class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs leading-relaxed text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20">{{ old('description') }}</textarea>
            </label>

            <button type="submit"
                    class="flex w-full items-center justify-center gap-2 rounded-xl bg-saudi-700 px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-saudi-800">
                <x-lucide-calendar-check class="size-4" aria-hidden="true" />
                <span>{{ __('pages.help.appointment_form.submit') }}</span>
            </button>
        </form>
    </div>

    <aside class="space-y-4">
        <section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
            <h2 class="text-sm font-bold text-slate-900">{{ __('pages.help.channels') }}</h2>
            <dl class="space-y-3 text-xs">
                <div>
                    <dt class="font-semibold text-slate-400">{{ __('pages.help.hotline') }}</dt>
                    <dd><a href="tel:{{ $settings['support_phone'] ?? config('kasp.support.phone') }}" class="numeric font-bold text-saudi-700 hover:underline">{{ $settings['support_phone'] ?? config('kasp.support.phone') }}</a></dd>
                </div>
                <div>
                    <dt class="font-semibold text-slate-400">{{ __('pages.help.email') }}</dt>
                    <dd><a href="mailto:{{ $settings['support_email'] ?? config('kasp.support.email') }}" class="font-bold text-saudi-700 hover:underline">{{ $settings['support_email'] ?? config('kasp.support.email') }}</a></dd>
                </div>
                <div>
                    <dt class="font-semibold text-slate-400">{{ __('pages.help.response_time') }}</dt>
                    <dd class="font-bold text-slate-800">{{ __('pages.help.response_time_value') }}</dd>
                </div>
            </dl>
        </section>

        <section class="space-y-2 rounded-3xl border border-sand-200 bg-sand-100/60 p-6">
            <h2 class="flex items-center gap-1.5 text-sm font-bold text-sand-500">
                <x-lucide-info class="size-4" aria-hidden="true" />
                {{ __('admin.login.applicant_notice_title') }}
            </h2>
            <p class="text-xs leading-relaxed text-slate-700">{{ __('admin.login.applicant_notice_body') }}</p>
            <a href="{{ $settings['official_apply_url'] ?? config('kasp.apply_url') }}" target="_blank" rel="noopener"
               class="inline-flex items-center gap-1.5 text-xs font-extrabold text-saudi-700 hover:underline">
                <span>{{ __('admin.login.applicant_notice_link') }}</span>
                <x-lucide-external-link class="size-3.5" aria-hidden="true" />
            </a>
        </section>
    </aside>
</section>
