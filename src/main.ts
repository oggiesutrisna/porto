import './styles/global.css';
import { getProjects } from './data/projects';

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
   2. Mobile Navigation Controller
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('mobile-nav-menu');
    const iconOpen = document.getElementById('mobile-nav-icon-open');
    const iconClose = document.getElementById('mobile-nav-icon-close');

    if (!toggleBtn || !menu) return;

    const setOpen = (open: boolean) => {
        menu.classList.toggle('hidden', !open);
        menu.classList.toggle('flex', open);
        toggleBtn.setAttribute('aria-expanded', String(open));
        iconOpen?.classList.toggle('hidden', open);
        iconClose?.classList.toggle('hidden', !open);
    };

    toggleBtn.addEventListener('click', () => {
        const isOpen = !menu.classList.contains('hidden');
        setOpen(!isOpen);
    });

    menu.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });
}

/* ==========================================================================
   3. Project Modal Dialog Controller
   ========================================================================== */
function initProjectModals() {
    const projDialog = document.getElementById('project-modal') as HTMLDialogElement | null;
    const closeBtn = document.getElementById('close-proj-modal');
    const projBadge = document.getElementById('proj-badge');
    const projTitle = document.getElementById('proj-title');
    const projDesc = document.getElementById('proj-desc');
    const projStack = document.getElementById('proj-stack');
    const projDemo = document.getElementById('proj-demo') as HTMLAnchorElement | null;
    const projGithub = document.getElementById('proj-github') as HTMLAnchorElement | null;

    if (!projDialog) return;

    closeBtn?.addEventListener('click', () => projDialog.close());
    projDialog.addEventListener('click', (e) => {
        const rect = projDialog.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            projDialog.close();
        }
    });

    document.querySelectorAll('[data-project-trigger]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projId = btn.getAttribute('data-project-trigger');
            if (!projId) return;

            const proj = getProjects().find((p) => p.id === projId);
            if (!proj) return;

            if (projTitle) projTitle.textContent = proj.title;
            if (projDesc) projDesc.textContent = proj.description;
            if (projBadge) projBadge.textContent = proj.stack && proj.stack.length > 0 ? proj.stack[0] : 'PROJECT';

            if (projStack) {
                projStack.innerHTML = (proj.stack || []).map((t) => `
                    <span class="px-2.5 py-1 text-xs bg-brand-cream-light text-brand-dark rounded border-2 border-brand-dark font-bold font-mono">${t}</span>
                `).join('');
            }

            if (projDemo) {
                if (proj.demoUrl) {
                    projDemo.style.display = 'inline-flex';
                    projDemo.href = proj.demoUrl;
                } else {
                    projDemo.style.display = 'none';
                }
            }

            if (projGithub) {
                if (proj.githubUrl) {
                    projGithub.style.display = 'inline-flex';
                    projGithub.href = proj.githubUrl;
                } else {
                    projGithub.style.display = 'none';
                }
            }

            projDialog.showModal();
        });
    });
}

/* ==========================================================================
   4. Smooth Scrolling for Navigation Links
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
   5. Application Bootloader
   ========================================================================== */
function bootApp() {
    updateBaliTime();
    setInterval(updateBaliTime, 10000);

    initMobileNav();
    initProjectModals();
    initSmoothScroll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}
