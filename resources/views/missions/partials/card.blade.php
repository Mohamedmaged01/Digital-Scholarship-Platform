<article class="flex h-full flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-saudi-300 hover:shadow-md">
    <div class="space-y-3">
        <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3">
                <span class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-saudi-200/80 bg-saudi-50">
                    <x-lucide-building-2 class="size-5 text-saudi-700" aria-hidden="true" />
                </span>
                <div>
                    <h3 class="text-sm font-bold leading-snug text-slate-900">
                        <a href="{{ route('missions.show', $mission) }}" class="transition hover:text-saudi-700">{{ $mission->title }}</a>
                    </h3>
                    <p class="text-[11px] text-slate-500">{{ $mission->city }} · {{ $mission->country }}</p>
                </div>
            </div>

            <x-badge tone="slate">{{ $mission->code }}</x-badge>
        </div>

        @if (filled($mission->attache_name))
            <p class="flex items-center gap-2 text-xs text-slate-700">
                <x-lucide-user class="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                <span><span class="font-semibold">{{ __('pages.missions.attache') }}:</span> {{ $mission->attache_name }}</span>
            </p>
        @endif

        <dl class="space-y-1.5 border-t border-slate-100 pt-3 text-[11.5px]">
            @if (filled($mission->working_hours))
                <div class="flex items-start gap-2">
                    <dt class="sr-only">{{ __('pages.missions.working_hours') }}</dt>
                    <x-lucide-clock class="mt-0.5 size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    <dd class="text-slate-600">{{ $mission->working_hours }}</dd>
                </div>
            @endif

            @if (filled($mission->address))
                <div class="flex items-start gap-2">
                    <dt class="sr-only">{{ __('pages.missions.address') }}</dt>
                    <x-lucide-map-pin class="mt-0.5 size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    <dd class="text-slate-600">{{ $mission->address }}</dd>
                </div>
            @endif
        </dl>
    </div>

    <div class="space-y-2 border-t border-slate-100 pt-3">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px]">
            @if (filled($mission->phone))
                <a href="tel:{{ $mission->phone }}" class="numeric flex items-center gap-1.5 font-bold text-slate-700 transition hover:text-saudi-700">
                    <x-lucide-phone class="size-3.5 text-saudi-600" aria-hidden="true" />
                    {{ $mission->phone }}
                </a>
            @endif

            @if (filled($mission->email))
                <a href="mailto:{{ $mission->email }}" class="flex items-center gap-1.5 font-bold text-slate-700 transition hover:text-saudi-700">
                    <x-lucide-mail class="size-3.5 text-saudi-600" aria-hidden="true" />
                    {{ $mission->email }}
                </a>
            @endif
        </div>

        <div class="flex items-center justify-between gap-3">
            @if (filled($mission->emergency_phone))
                <a href="tel:{{ $mission->emergency_phone }}"
                   class="numeric flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-800 transition hover:bg-rose-100">
                    <x-lucide-phone-call class="size-3" aria-hidden="true" />
                    <span>{{ __('pages.missions.emergency') }}: {{ $mission->emergency_phone }}</span>
                </a>
            @endif

            <span class="numeric flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                <x-lucide-users class="size-3.5 text-slate-400" aria-hidden="true" />
                {{ number_format($mission->active_students_count) }}
                <span class="font-normal">{{ __('pages.missions.active_scholars') }}</span>
            </span>
        </div>
    </div>
</article>
