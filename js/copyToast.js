(function () {
    let toast = null;
    let toastTimeout = null;

    function getOrCreateToast() {
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'copyToastNotification';
            document.body.appendChild(toast);
        }
        return toast;
    }

    function showToast(message) {
        const el = getOrCreateToast();
        el.textContent = message;
        el.classList.add('visible');

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toastTimeout = setTimeout(() => {
            el.classList.remove('visible');
        }, 2400);
    }

    async function copyToClipboard(text, label) {
        try {
            await navigator.clipboard.writeText(text);
            showToast(`✓ Copied ${label || text} to clipboard!`);
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showToast(`✓ Copied ${label || text} to clipboard!`);
            } catch (e) {
                console.error('Copy failed:', e);
            }
            document.body.removeChild(textarea);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const copyElements = document.querySelectorAll('[data-copy]');
        copyElements.forEach((el) => {
            el.style.cursor = 'pointer';

            el.addEventListener('click', (e) => {
                const copyVal = el.getAttribute('data-copy');
                const label = el.getAttribute('data-copy-label') || copyVal;
                if (copyVal) {
                    copyToClipboard(copyVal, label);
                }
            });
        });
    });
})();
