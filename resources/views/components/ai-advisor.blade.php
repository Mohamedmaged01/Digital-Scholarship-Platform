@php
    $advisor = app(\App\Services\Ai\AiAdvisor::class);
    $enabled = \App\Models\SiteSetting::get('allow_public_ai_chat', true);
    $config = [
        'endpoint' => route('ai.chat'),
        'suggestions' => $advisor->suggestions(),
        'greetingHtml' => \App\Support\AdvisorMarkdown::toHtml($advisor->greeting()),
        'labels' => ['error' => __('common.error')],
    ];
@endphp

@if ($enabled)
    <div x-data="chatWidget(@js($config))" class="no-print">

        {{-- Floating trigger --}}
        <button type="button"
                x-show="!open"
                @click="show()"
                class="fixed bottom-6 end-6 z-40 flex items-center gap-2 rounded-2xl bg-gradient-to-br from-saudi-700 to-saudi-900 px-4 py-3.5 text-xs font-bold text-white shadow-2xl shadow-saudi-950/30 transition hover:-translate-y-0.5 hover:from-saudi-600"
                aria-label="{{ __('ai_chat.title') }}">
            <span class="relative flex size-6 items-center justify-center">
                <span class="absolute inline-flex size-6 animate-ping rounded-full bg-sand-300/40" aria-hidden="true"></span>
                <x-lucide-bot class="relative size-5 text-sand-300" aria-hidden="true" />
            </span>
            <span class="hidden sm:inline">{{ __('ai_chat.title') }}</span>
        </button>

        {{-- Panel --}}
        <section x-show="open" x-cloak x-transition.opacity
                 :class="expanded ? 'sm:h-[85vh] sm:w-[34rem]' : 'sm:h-[36rem] sm:w-[26rem]'"
                 class="fixed inset-0 z-50 flex h-full w-full flex-col overflow-hidden border-slate-200 bg-white shadow-2xl sm:inset-auto sm:bottom-6 sm:end-6 sm:rounded-3xl sm:border"
                 role="dialog" aria-modal="true" aria-label="{{ __('ai_chat.title') }}">

            <header class="flex items-start justify-between gap-3 bg-gradient-to-l from-saudi-900 via-saudi-800 to-slate-900 p-4 text-white">
                <div class="flex items-center gap-3">
                    <span class="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                        <x-lucide-bot class="size-5 text-sand-300" aria-hidden="true" />
                    </span>
                    <div>
                        <h2 class="text-sm font-bold">{{ __('ai_chat.title') }}</h2>
                        <p class="text-[11px] text-saudi-200">{{ __('ai_chat.subtitle') }}</p>
                    </div>
                </div>

                <div class="flex items-center gap-1">
                    <button type="button" @click="reset()" class="rounded-lg p-1.5 text-saudi-200 transition hover:bg-white/10 hover:text-white"
                            aria-label="{{ __('ai_finder.recalculate') }}">
                        <x-lucide-rotate-ccw class="size-4" aria-hidden="true" />
                    </button>
                    <button type="button" @click="expanded = !expanded" class="hidden rounded-lg p-1.5 text-saudi-200 transition hover:bg-white/10 hover:text-white sm:block"
                            aria-label="{{ __('common.view') }}">
                        <x-lucide-maximize-2 class="size-4" x-show="!expanded" aria-hidden="true" />
                        <x-lucide-minimize-2 class="size-4" x-show="expanded" x-cloak aria-hidden="true" />
                    </button>
                    <button type="button" @click="hide()" class="rounded-lg p-1.5 text-saudi-200 transition hover:bg-white/10 hover:text-white"
                            aria-label="{{ __('common.close') }}">
                        <x-lucide-x class="size-4" aria-hidden="true" />
                    </button>
                </div>
            </header>

            <div x-ref="thread" class="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4">
                <template x-for="message in messages" :key="message.id">
                    <div :class="message.role === 'user' ? 'items-end' : 'items-start'" class="flex flex-col gap-1">
                        <div :class="message.role === 'user'
                                ? 'bg-saudi-700 text-white rounded-2xl rounded-ee-md'
                                : 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-ss-md'"
                             class="prose-portal max-w-[88%] px-4 py-3 text-xs leading-relaxed shadow-xs sm:text-[13px]">
                            <template x-if="message.html">
                                <div x-html="message.html"></div>
                            </template>
                            <template x-if="!message.html">
                                <p x-text="message.text"></p>
                            </template>
                        </div>
                        <span class="numeric px-1 text-[10px] text-slate-400" x-text="message.time"></span>
                    </div>
                </template>

                <div x-show="sending" class="flex items-center gap-2 px-1 text-xs text-slate-500">
                    <span class="flex gap-1" aria-hidden="true">
                        <span class="size-1.5 animate-bounce rounded-full bg-saudi-600 [animation-delay:-0.2s]"></span>
                        <span class="size-1.5 animate-bounce rounded-full bg-saudi-600 [animation-delay:-0.1s]"></span>
                        <span class="size-1.5 animate-bounce rounded-full bg-saudi-600"></span>
                    </span>
                    <span>{{ __('common.loading') }}</span>
                </div>
            </div>

            <div x-show="suggestions.length > 0" class="border-t border-slate-100 bg-white px-4 pt-3">
                <p class="mb-2 text-[11px] font-bold text-slate-500">{{ __('ai_chat.suggested_title') }}</p>
                <div class="flex flex-wrap gap-1.5 pb-1">
                    <template x-for="prompt in suggestions" :key="prompt">
                        <button type="button" @click="send(prompt)" :disabled="sending"
                                class="rounded-xl border border-saudi-200 bg-saudi-50 px-2.5 py-1.5 text-[11px] font-semibold text-saudi-800 transition hover:bg-saudi-100 disabled:opacity-50"
                                x-text="prompt"></button>
                    </template>
                </div>
            </div>

            <form @submit.prevent="send()" class="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
                <label class="flex-1">
                    <span class="sr-only">{{ __('ai_chat.placeholder') }}</span>
                    <input x-ref="input" x-model="draft" type="text" autocomplete="off"
                           placeholder="{{ __('ai_chat.placeholder') }}"
                           class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 transition focus:border-saudi-600 focus:bg-white focus:outline-none">
                </label>
                <button type="submit" :disabled="sending || draft.trim() === ''"
                        class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-saudi-700 text-white transition hover:bg-saudi-800 disabled:opacity-40"
                        aria-label="{{ __('ai_chat.send') }}">
                    <x-lucide-send class="size-4 flip-rtl" aria-hidden="true" />
                </button>
            </form>

            <p class="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center text-[10px] text-slate-400">
                {{ __('footer.gov_platform_note') }}
            </p>
        </section>
    </div>
@endif
