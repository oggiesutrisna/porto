import './styles/global.css';

/* ==========================================================================
   1. Live Bali WITA Clock (UTC+8)
   ========================================================================== */
function updateBaliTime() {
    const timeDisplay = document.getElementById('bali-time');
    if (!timeDisplay) return;

    try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Makassar',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        timeDisplay.textContent = `BALI TIME (WITA): ${timeStr}`;
    } catch {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeDisplay.textContent = `BALI TIME (WITA): ${hours}:${minutes}`;
    }
}

/* ==========================================================================
   2. Smooth Scrolling for Navigation Links
   ========================================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#' || href.length <= 1) return;

            const targetEl = document.querySelector(href);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* ==========================================================================
   3. Application Bootloader
   ========================================================================== */
function bootApp() {
    updateBaliTime();
    setInterval(updateBaliTime, 10000);
    initSmoothScroll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}
