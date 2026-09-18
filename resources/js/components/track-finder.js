/**
 * The three-step track recommender on the home page.
 *
 * Scoring happens on the server (App\Services\Ai\TrackRecommender) so the same
 * logic serves the JSON API. The form also posts normally when JavaScript is
 * unavailable, in which case the server renders the result page instead.
 */
export default (config = {}) => ({
    step: 1,
    running: false,
    error: null,
    result: null,
    endpoint: config.endpoint,
    labels: config.labels ?? {},

    answers: {
        degree: 'Master',
        field: 'ai_tech',
        gpa: 4.5,
        english: 7,
        goal: 'national_megaprojects',
        destination: 'us_uk',
    },

    get progress() {
        return Math.min(100, Math.round((this.step / 3) * 100));
    },

    next() {
        if (this.step < 3) {
            this.step += 1;
        }
    },

    back() {
        if (this.step > 1) {
            this.step -= 1;
        }
    },

    restart() {
        this.step = 1;
        this.result = null;
        this.error = null;
    },

    async run() {
        this.running = true;
        this.error = null;

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                body: JSON.stringify(this.answers),
            });

            if (!response.ok) {
                throw new Error(`Recommender responded with ${response.status}`);
            }

            this.result = await response.json();
            this.step = 4;
        } catch (error) {
            this.error = this.labels.error ?? 'We could not calculate a recommendation. Please try again.';
        } finally {
            this.running = false;
        }
    },
});
