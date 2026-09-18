/** Condenses the masthead once the page scrolls away from the top. */
export default () => ({
    scrolled: false,
    mobileMenuOpen: false,

    init() {
        this.onScroll();
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    },

    onScroll() {
        this.scrolled = window.scrollY > 24;
    },

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    },
});
