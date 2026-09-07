import { getProjects } from '../data/projects';
import { getSkills } from '../data/skills';

/* ==========================================================================
   Modals and UI Controllers (2D Clean Portfolio)
   ========================================================================== */

export function openProjectModal(data: {
    id?: string;
    title: string;
    description: string;
    stack?: string[];
    demoUrl?: string;
    githubUrl?: string;
}) {
    const projDialog = document.getElementById('project-modal') as HTMLDialogElement | null;
    if (!projDialog) return;

    const projBadge = document.getElementById('proj-badge');
    const projTitle = document.getElementById('proj-title');
    const projDesc = document.getElementById('proj-desc');
    const projStack = document.getElementById('proj-stack');
    const projDemo = document.getElementById('proj-demo') as HTMLAnchorElement | null;
    const projGithub = document.getElementById('proj-github') as HTMLAnchorElement | null;
    const projPage = document.getElementById('proj-page') as HTMLButtonElement | null;

    if (projTitle) projTitle.textContent = data.title;
    if (projDesc) projDesc.textContent = data.description;
    if (projBadge) projBadge.textContent = data.stack && data.stack.length > 0 ? data.stack[0] : 'Project';

    if (projStack) {
        projStack.innerHTML = (data.stack || []).map(t => `
            <span class="px-2.5 py-1 text-xs bg-white/5 text-gray-300 rounded-full border border-white/10 font-mono">${t}</span>
        `).join('');
    }

    if (projDemo) {
        if (data.demoUrl) {
            projDemo.style.display = 'inline-flex';
            projDemo.href = data.demoUrl;
        } else {
            projDemo.style.display = 'none';
        }
    }

    if (projGithub) {
        if (data.githubUrl) {
            projGithub.style.display = 'inline-flex';
            projGithub.href = data.githubUrl;
        } else {
            projGithub.style.display = 'none';
        }
    }

    if (projPage) {
        if (data.id) {
            projPage.style.display = 'inline-flex';
            projPage.onclick = () => {
                projDialog.close();
                window.location.hash = `#project/${data.id}`;
            };
        } else {
            projPage.style.display = 'none';
        }
    }

    projDialog.showModal();
}

export function openSkillModal(data: {
    title: string;
    description: string;
    icon?: string;
    level?: string;
}) {
    const skillDialog = document.getElementById('skill-modal') as HTMLDialogElement | null;
    if (!skillDialog) return;

    const skillTitle = document.getElementById('skill-title');
    const skillDesc = document.getElementById('skill-desc');
    const skillIcon = document.getElementById('skill-icon-container');

    const skillEmojis: Record<string, string> = {
        laravel: '🐘',
        filament: '⚡',
        threejs: '📐',
        typescript: '🔷',
        javascript: '💛',
        api: '🔌',
        database: '🗄️',
        tailwind: '🎨',
        uiux: '🎨'
    };

    if (skillTitle) skillTitle.textContent = data.title;
    if (skillDesc) skillDesc.textContent = data.description;
    if (skillIcon) skillIcon.textContent = (data.icon && skillEmojis[data.icon]) ? skillEmojis[data.icon] : '🚀';

    skillDialog.showModal();
}

export function openContactPanel() {
    const contactDialog = document.getElementById('contact-panel') as HTMLDialogElement | null;
    if (!contactDialog) return;

    const contactTitle = document.getElementById('contact-title');
    const contactSubtitle = document.getElementById('contact-subtitle');
    const contactDesc = document.getElementById('contact-desc');
    const contactExtra = document.getElementById('contact-extra');

    if (contactTitle) contactTitle.textContent = "Let's Connect";
    if (contactSubtitle) contactSubtitle.textContent = 'Digital Gateways & Inquiry';
    if (contactDesc) contactDesc.textContent = 'I am open to full-time roles, freelance contracts, and architecture consulting.';

    if (contactExtra) {
        contactExtra.innerHTML = `
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a href="mailto:info@extensiacreativebali.com" class="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-300 hover:text-white transition-all text-sm font-semibold">
                    <span>📧</span> Email Inquiry
                </a>
                <a href="https://github.com/oggiesutrisna" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-300 hover:text-white transition-all text-sm font-semibold">
                    <span>💻</span> GitHub Profile
                </a>
                <a href="https://linkedin.com/in/oggiesutrisna" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-300 hover:text-white transition-all text-sm font-semibold">
                    <span>🔗</span> LinkedIn Connect
                </a>
                <a href="/i-putu-oggie-sutrisna-ady_20260227_2116.pdf" download class="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-300 hover:text-white transition-all text-sm font-semibold">
                    <span>📄</span> Download CV File
                </a>
            </div>
        `;
    }

    contactDialog.showModal();
}

export function initOverlayControllers() {
    // Project Modal Dialog listeners
    const projDialog = document.getElementById('project-modal') as HTMLDialogElement | null;
    const closeProjBtn = document.getElementById('close-proj-modal');

    closeProjBtn?.addEventListener('click', () => projDialog?.close());
    projDialog?.addEventListener('click', (e) => {
        const rect = projDialog.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            projDialog.close();
        }
    });

    // Skill Modal Dialog listeners
    const skillDialog = document.getElementById('skill-modal') as HTMLDialogElement | null;
    const closeSkillBtn = document.getElementById('close-skill-modal');
    const okSkillBtn = document.getElementById('ok-skill-modal');

    const closeSkill = () => skillDialog?.close();
    closeSkillBtn?.addEventListener('click', closeSkill);
    okSkillBtn?.addEventListener('click', closeSkill);
    skillDialog?.addEventListener('click', (e) => {
        const rect = skillDialog.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            skillDialog.close();
        }
    });

    // Contact Panel Dialog listeners
    const contactDialog = document.getElementById('contact-panel') as HTMLDialogElement | null;
    const closeContactBtn = document.getElementById('close-contact-panel');
    const okContactBtn = document.getElementById('ok-contact-panel');

    const closeContact = () => contactDialog?.close();
    closeContactBtn?.addEventListener('click', closeContact);
    okContactBtn?.addEventListener('click', closeContact);
    contactDialog?.addEventListener('click', (e) => {
        const rect = contactDialog.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            contactDialog.close();
        }
    });

    // Bind featured project buttons and skill cards in the DOM
    const bindInteractiveElements = () => {
        // Featured project trigger buttons
        document.querySelectorAll('[data-project-trigger]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projId = btn.getAttribute('data-project-trigger');
                if (!projId) return;
                const proj = getProjects().find(p => p.id === projId);
                if (proj) {
                    openProjectModal({
                        id: proj.id,
                        title: proj.title,
                        description: proj.description,
                        stack: proj.stack,
                        demoUrl: proj.demoUrl,
                        githubUrl: proj.githubUrl
                    });
                }
            });
        });

        // Skill card triggers
        document.querySelectorAll('[data-skill-trigger]').forEach((card) => {
            card.addEventListener('click', () => {
                const skillId = card.getAttribute('data-skill-trigger');
                if (!skillId) return;
                const sk = getSkills().find(s => s.id === skillId);
                if (sk) {
                    openSkillModal({
                        title: sk.name,
                        description: sk.description,
                        icon: sk.icon,
                        level: sk.level
                    });
                }
            });
        });

        // Contact panel triggers
        document.querySelectorAll('[data-contact-trigger]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openContactPanel();
            });
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindInteractiveElements);
    } else {
        bindInteractiveElements();
    }
}
