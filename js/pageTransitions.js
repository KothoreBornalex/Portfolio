// Smooth, Hardware-Accelerated Page Transitions
(function () {
    const TRANSITION_DURATION = 180; // milliseconds

    function initPageTransitions() {
        // Ensure body is visible on initial load and handle browser back/forward cache (bfcache)
        document.body.classList.remove('page-is-exiting');

        window.addEventListener('pageshow', (event) => {
            document.body.classList.remove('page-is-exiting');
        });

        // Intercept internal relative links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');

            // Skip if:
            // 1. No href or hash link (#)
            // 2. Opens in new tab/target="_blank"
            // 3. Download link or PDF
            // 4. External link (http/https/mailto/tel)
            // 5. Modifier key held (Ctrl, Cmd, Shift, Alt, middle click)
            if (
                !href ||
                href.startsWith('#') ||
                href.startsWith('javascript:') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                link.target === '_blank' ||
                link.hasAttribute('download') ||
                href.endsWith('.pdf') ||
                href.endsWith('.zip') ||
                href.startsWith('http://') ||
                href.startsWith('https://') ||
                e.ctrlKey ||
                e.metaKey ||
                e.shiftKey ||
                e.altKey ||
                e.button !== 0
            ) {
                return;
            }

            // Internal page transition
            e.preventDefault();
            document.body.classList.add('page-is-exiting');

            setTimeout(() => {
                window.location.href = href;
            }, TRANSITION_DURATION);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageTransitions);
    } else {
        initPageTransitions();
    }
})();
