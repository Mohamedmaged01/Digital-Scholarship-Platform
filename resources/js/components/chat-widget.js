/**
 * The AI scholarship advisor panel.
 *
 * Conversation state lives here; answers come from POST /ai/chat, which returns
 * pre-rendered HTML for the small Markdown subset the advisor uses. Without
 * JavaScript the FAQ page and the help centre cover the same ground, so nothing
 * is lost — this is an enhancement.
 */
export default (config = {}) => ({
    open: false,
    expanded: false,
    sending: false,
    draft: '',
    suggestions: config.suggestions ?? [],
    messages: [],
    endpoint: config.endpoint,
    greetingHtml: config.greetingHtml ?? '',
    labels: config.labels ?? {},

    init() {
        this.messages = [
            { id: 'welcome', role: 'assistant', html: this.greetingHtml, time: this.now() },
        ];

        // Any element can open the panel: window.dispatchEvent(new Event('open-advisor'))
        window.addEventListener('open-advisor', () => this.show());
    },

    show() {
        this.open = true;
        this.$nextTick(() => this.$refs.input?.focus());
    },

    hide() {
        this.open = false;
    },

    reset() {
        this.messages = [
            { id: 'welcome', role: 'assistant', html: this.greetingHtml, time: this.now() },
        ];
        this.suggestions = config.suggestions ?? [];
    },

    async send(text) {
        const message = (text ?? this.draft).trim();

        if (message === '' || this.sending) {
            return;
        }

        this.draft = '';
        this.sending = true;
        this.messages.push({ id: `u-${Date.now()}`, role: 'user', text: message, time: this.now() });
        this.scrollToEnd();

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                body: JSON.stringify({ message, history: this.history() }),
            });

            if (!response.ok) {
                throw new Error(`Advisor responded with ${response.status}`);
            }

            const payload = await response.json();

            this.messages.push({
                id: `a-${Date.now()}`,
                role: 'assistant',
                html: payload.html,
                source: payload.source,
                time: this.now(),
            });

            if (Array.isArray(payload.suggestions) && payload.suggestions.length > 0) {
                this.suggestions = payload.suggestions;
            }
        } catch (error) {
            this.messages.push({
                id: `e-${Date.now()}`,
                role: 'assistant',
                html: `<p>${this.labels.error ?? 'Something went wrong. Please try again.'}</p>`,
                time: this.now(),
            });
        } finally {
            this.sending = false;
            this.scrollToEnd();
        }
    },

    /** Last few turns, so follow-up questions keep their context. */
    history() {
        return this.messages
            .filter((message) => message.id !== 'welcome')
            .slice(-6)
            .map((message) => ({
                role: message.role,
                text: message.text ?? this.stripTags(message.html ?? ''),
            }));
    },

    stripTags(html) {
        const element = document.createElement('div');
        element.innerHTML = html;

        return element.textContent ?? '';
    },

    scrollToEnd() {
        this.$nextTick(() => {
            const panel = this.$refs.thread;

            if (panel) {
                panel.scrollTop = panel.scrollHeight;
            }
        });
    },

    now() {
        return new Date().toLocaleTimeString(document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });
    },
});
