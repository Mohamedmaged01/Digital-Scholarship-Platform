/** Copies a value and shows a short confirmation on the trigger. */
export default (value = '', confirmedLabel = 'Copied') => ({
    copied: false,
    value,
    confirmedLabel,

    async copy() {
        try {
            await navigator.clipboard.writeText(this.value);
        } catch (error) {
            // Older browsers and insecure origins: fall back to a hidden input.
            const input = document.createElement('input');
            input.value = this.value;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            input.remove();
        }

        this.copied = true;
        setTimeout(() => {
            this.copied = false;
        }, 1800);
    },
});
