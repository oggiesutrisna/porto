import type { GitHubRepo } from '../types/github';
import { getLanguageColor } from '../types/github';
import { fetchRepoReadme } from '../lib/github';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { allRepos } from './flat-grid';

const GITHUB_USERNAME = 'oggiesutrisna';

/* ==========================================================================
   5. SPA Router & Project Detail Page Rendering
   ========================================================================== */
export async function loadProjectDetails(projectId: string) {
    const detailView = document.getElementById('project-detail-view');
    const primaryLayout = document.getElementById('primary-layout');
    const loading = document.getElementById('project-detail-loading');
    const content = document.getElementById('project-detail-content');

    if (!detailView || !primaryLayout || !loading || !content) return;

    // 1. Swap layouts
    primaryLayout.style.display = 'none';
    detailView.classList.remove('hidden');
    loading.classList.remove('hidden');
    content.classList.add('hidden');

    // Smooth scroll to top of view
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 2. Lookup project repo
    const repo = allRepos.find((r: GitHubRepo) => r.name === projectId);
    if (!repo) {
        // If invalid slug, fallback home
        window.location.hash = '';
        return;
    }

    // 3. Update Title & Descriptions
    const titleEl = document.getElementById('detail-title');
    const descEl = document.getElementById('detail-desc');
    if (titleEl) titleEl.textContent = repo.name;
    if (descEl) descEl.textContent = repo.description || 'No description available.';

    // 4. Fill Links
    const linksEl = document.getElementById('detail-links');
    if (linksEl) {
        linksEl.innerHTML = `
      ${repo.homepage ? `
        <a
          href="${repo.homepage}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff9a3d] to-[#ff6b4a] hover:from-[#ffa34d] hover:to-[#ff7b5a] text-white font-semibold rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff9a3d]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          Live Demo
        </a>
      ` : ''}
      <a
        href="${repo.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 bg-dark-border hover:bg-gray-700 text-white rounded-lg text-sm border border-white/5 hover:border-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff9a3d]"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHub
      </a>
    `;
    }

    // 5. Fill Repository Core Stats
    const statsEl = document.getElementById('detail-stats');
    if (statsEl) {
        statsEl.innerHTML = `
      ${repo.language ? `
        <div class="flex items-center gap-2 px-3 py-1.5 bg-dark-bg-card rounded-lg border border-dark-border/40">
          <span class="w-3 h-3 rounded-full" style="background-color: ${getLanguageColor(repo.language)}"></span>
          <span class="text-gray-300 text-xs font-semibold">${repo.language}</span>
        </div>
      ` : ''}
      <div class="flex items-center gap-1.5 px-3 py-1.5 bg-dark-bg-card rounded-lg border border-dark-border/40 text-gray-300 text-xs font-semibold">
        <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span>${repo.stargazersCount} stars</span>
      </div>
      <div class="flex items-center gap-1.5 px-3 py-1.5 bg-dark-bg-card rounded-lg border border-dark-border/40 text-gray-300 text-xs font-semibold">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span>${repo.forksCount} forks</span>
      </div>
      ${repo.license ? `
        <div class="flex items-center gap-1.5 px-3 py-1.5 bg-dark-bg-card rounded-lg border border-dark-border/40 text-gray-300 text-xs font-semibold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span>${repo.license}</span>
        </div>
      ` : ''}
    `;
    }

    // 6. Fill Sub-languages percentage
    const langSect = document.getElementById('detail-languages-section');
    const langCont = document.getElementById('detail-languages');
    if (langSect && langCont) {
        if (repo.languages.length > 0) {
            langSect.classList.remove('hidden');
            langCont.innerHTML = repo.languages.map(l => `
        <div class="flex items-center gap-2 px-3 py-1.5 bg-dark-bg-card border border-dark-border/40 rounded-lg">
          <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${l.color}"></span>
          <span class="text-gray-300 text-xs font-semibold">${l.name}</span>
          <span class="text-gray-500 text-xs">${l.percentage}%</span>
        </div>
      `).join('');
        } else {
            langSect.classList.add('hidden');
        }
    }

    // 7. Fill Topics list
    const topicsEl = document.getElementById('detail-topics');
    if (topicsEl) {
        topicsEl.innerHTML = repo.topics.map(topic => `
      <span class="px-3 py-1 text-sm bg-[#ff9a3d]/10 text-[#ff9a3d] rounded-full border border-[#ff9a3d]/20 font-semibold">
        ${topic}
      </span>
    `).join('');
    }

    // 8. Fetch dynamic README from GitHub
    const readmeEl = document.getElementById('detail-readme');
    if (readmeEl) {
        try {
            const markdown = await fetchRepoReadme(GITHUB_USERNAME, projectId);
            if (markdown) {
                // Parse with marked and purify with client-side DOMPurify
                const dirtyHtml = await marked.parse(markdown);
                const cleanHtml = DOMPurify.sanitize(dirtyHtml);
                readmeEl.innerHTML = cleanHtml;
            } else {
                readmeEl.innerHTML = `
          <div class="text-center py-12 bg-dark-bg-card rounded-xl border border-dark-border">
            <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p class="text-gray-500">No README.md document is available in this repository.</p>
          </div>
        `;
            }
        } catch (err) {
            console.error(err);
            readmeEl.innerHTML = `<p class="text-red-400 font-semibold text-center">Failed to load readme file content.</p>`;
        }
    }

    // 9. Show details layout
    loading.classList.add('hidden');
    content.classList.remove('hidden');
}

export function handleSPARouter() {
    const hash = window.location.hash;
    const detailView = document.getElementById('project-detail-view');
    const primaryLayout = document.getElementById('primary-layout');

    if (hash.startsWith('#project/')) {
        const projectId = hash.replace('#project/', '');
        loadProjectDetails(projectId);
    } else {
        // Return to main layout
        if (detailView) detailView.classList.add('hidden');
        if (primaryLayout) primaryLayout.style.display = 'contents';

        if (hash.startsWith('#')) {
            const targetId = hash.slice(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
}

export function initSPARouter() {
    const backBtn = document.getElementById('back-to-canvas');
    backBtn?.addEventListener('click', () => {
        window.location.hash = '';
    });

    window.addEventListener('hashchange', handleSPARouter);

    // Trigger initial check on startup
    handleSPARouter();
}
