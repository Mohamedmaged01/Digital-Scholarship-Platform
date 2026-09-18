@props(['action', 'label' => null])

{{-- A real DELETE form, guarded by a confirm dialog rather than a link. --}}
<form method="post" action="{{ $action }}"
      onsubmit="return confirm(@js(__('common.confirm_delete')));"
      class="inline">
    @csrf
    @method('DELETE')
    <button type="submit"
            class="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100">
        <x-lucide-trash-2 class="size-3.5" aria-hidden="true" />
        <span>{{ $label ?: __('common.delete') }}</span>
    </button>
</form>
