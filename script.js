function openTab(evt, tabName) {
    var i, tabContent, tabButtons;

    tabContent = document.getElementsByClassName("tab-content");
    tabButtons = document.getElementsByClassName("tab-button");

    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active");
    }

    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    const selectedTab = document.getElementById(tabName);

    setTimeout(function() {
        selectedTab.classList.add("active");

        const headings = selectedTab.querySelectorAll('h2, h3');
        const paragraphs = selectedTab.querySelectorAll('p');
        const listItems = selectedTab.querySelectorAll('li');

        headings.forEach((heading, index) => {
            heading.style.animation = 'none';
            heading.offsetHeight;
            heading.style.animation = `slideInLeft ${0.6 + index * 0.1}s ease forwards`;
        });

        paragraphs.forEach((paragraph, index) => {
            paragraph.style.animation = 'none';
            paragraph.offsetHeight;
            paragraph.style.animation = `slideInLeft ${0.8 + index * 0.1}s ease forwards`;
        });

        listItems.forEach((item, index) => {
            item.style.animation = 'none';
            item.offsetHeight;
            item.style.animation = `slideInRight ${0.9 + index * 0.05}s ease forwards`;
        });
    }, 50);
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("info").classList.add("active");
    document.querySelector(".tab-button").classList.add("active");

    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';

    setTimeout(function() {
        container.style.transition = 'all 0.8s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 200);

    const themeToggle = document.getElementById('theme-toggle');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Populate footer dates: current year, today's date, and last modified
    try {
        const now = new Date();
        const yearEl = document.getElementById('current-year');
        if (yearEl) yearEl.textContent = String(now.getFullYear());

        const todayEl = document.getElementById('today-date');
        if (todayEl) {
            function updateToday() {
                const nowTick = new Date();
                todayEl.setAttribute('datetime', nowTick.toISOString());
                todayEl.textContent = nowTick.toLocaleString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                });
            }
            updateToday();
            // Keep the clock updated every second
            setInterval(updateToday, 1000);
        }

        const lastModEl = document.getElementById('last-modified');
        if (lastModEl) {
            // document.lastModified is a localized string; parse defensively
            const lm = new Date(document.lastModified);
            if (!isNaN(lm.getTime())) {
                lastModEl.setAttribute('datetime', lm.toISOString());
                lastModEl.textContent = lm.toLocaleString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                });
            } else {
                // Fallback to now if parse fails
                lastModEl.setAttribute('datetime', now.toISOString());
                lastModEl.textContent = now.toLocaleString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                });
            }
        }
    } catch (_) { /* ignore */ }

    try {
        document.querySelectorAll('img:not(.lcp)').forEach(img => {
            if (!img.hasAttribute('loading')) img.loading = 'lazy';
            if (!img.hasAttribute('decoding')) img.decoding = 'async';
        });
    } catch (e) {
        //
    }

    function generateFavicon() {
        const canvas = document.createElement('canvas');
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const colors = [
            '#4a9eff',
            '#2ecc71',
            '#e74c3c',
            '#f1c40f',
            '#9b59b6'
        ];
        const color1 = colors[Math.floor(Math.random() * colors.length)];
        const color2 = colors[Math.floor(Math.random() * colors.length)];

        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('O', size/2, size/2);

        const favicon = document.getElementById('dynamic-favicon');
        favicon.href = canvas.toDataURL('image/png');
    }

    // Defer favicon generation to idle time and reduce update frequency
    let faviconIntervalId = null;
    function scheduleFavicon() {
        if (document.hidden) return;
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                generateFavicon();
            }, { timeout: 2000 });
        } else {
            setTimeout(generateFavicon, 200);
        }
    }

    function startFaviconUpdates() {
        if (faviconIntervalId) return;
        scheduleFavicon();
        faviconIntervalId = setInterval(() => {
            scheduleFavicon();
        }, 30000);
    }

    function stopFaviconUpdates() {
        if (!faviconIntervalId) return;
        clearInterval(faviconIntervalId);
        faviconIntervalId = null;
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopFaviconUpdates();
        } else {
            generateFavicon();
            startFaviconUpdates();
        }
    }, { passive: true });

    startFaviconUpdates();
});
