import type { GitHubRepo } from '../types/github';
import { getLanguageColor } from '../types/github';
import { formatDate } from '../lib/format';
import {
    filterRepos,
    sortRepos,
    getAllTopics,
    getAllLanguages
} from '../lib/github';

/* ==========================================================================
   Flat Grid Search, Filtering and Sorting
   ========================================================================== */

// Global filter state
export let allRepos: GitHubRepo[] = [];
let currentSearch = '';
let currentTopics: string[] = [];
let currentLanguage: string | null = null;
let currentSort: 'stars' | 'updated' | 'name' = 'updated';
let currentSortDirection: 'asc' | 'desc' = 'desc';

export function setAllRepos(repos: GitHubRepo[]) {
    allRepos = repos;
}

export function renderRepos(repos: GitHubRepo[]) {
    const container = document.getElementById('repo-grid');
    const countEl = document.getElementById('repo-count');
    if (!container) return;

    if (countEl) {
        countEl.textContent = `${repos.length} project${repos.length !== 1 ? 's' : ''}`;
    }

    if (repos.length === 0) {
        container.innerHTML = `
      <div class="col-span-full py-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-400 mb-2">No projects found</h3>
        <p class="text-gray-500">Try adjusting your search or filters</p>
      </div>
    `;
        return;
    }

    container.innerHTML = repos.map((repo) => {
        const isWebsite = repo.homepage || repo.topics.includes('website') || repo.topics.includes('demo');
        const color = getLanguageColor(repo.language);

        return `
      <article 
        class="repo-card group relative bg-dark-bg-card border border-dark-border rounded-xl p-5 hover:border-[#ff9a3d]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#ff9a3d]/10"
        data-repo="${repo.name}"
      >
        <div class="flex items-start justify-between gap-3 mb-3">
          <h3 class="font-display font-semibold text-lg text-white group-hover:text-[#ff9a3d] transition-colors">
            <a 
              href="#project/${repo.name}"
              class="focus:outline-none focus:ring-2 focus:ring-[#ff9a3d] rounded"
              aria-label="View ${repo.name} project details"
            >
              ${repo.name}
            </a>
          </h3>
          <div class="flex items-center gap-1 text-xs text-gray-400">
            <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>${repo.stargazersCount}</span>
          </div>
        </div>

        <p class="text-gray-400 text-sm mb-4 line-clamp-2">
          ${repo.description || 'No description available'}
        </p>

        ${repo.topics.length > 0 ? `
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${repo.topics.slice(0, 4).map((topic) => `
              <span class="px-2 py-0.5 text-xs bg-[#ff9a3d]/10 text-[#ff9a3d] rounded-full border border-[#ff9a3d]/20">
                ${topic}
              </span>
            `).join('')}
            ${repo.topics.length > 4 ? `<span class="px-2 py-0.5 text-xs text-gray-500">+${repo.topics.length - 4}</span>` : ''}
          </div>
        ` : ''}

        <div class="flex items-center gap-4 text-xs text-gray-500 mb-4">
          ${repo.language ? `
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${color}"></span>
              <span>${repo.language}</span>
            </div>
          ` : ''}
          
          <div class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            <span>${repo.forksCount}</span>
          </div>

          <div class="ml-auto">
            <time datetime="${repo.updatedAt}">${formatDate(repo.updatedAt)}</time>
          </div>
        </div>

        <div class="absolute inset-x-0 bottom-0 p-5 pt-0 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          ${repo.homepage && isWebsite ? `
            <a
              href="${repo.homepage}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#ff9a3d] bg-[#ff9a3d]/10 hover:bg-[#ff9a3d]/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Demo"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Demo
            </a>
          ` : ''}
          <a
            href="${repo.url}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-dark-border hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Repo
          </a>
          <a
            href="#project/${repo.name}"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#ff9a3d] to-[#ff6b4a] hover:from-[#ffa34d] hover:to-[#ff7b5a] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff9a3d]"
          >
            Details
          </a>
        </div>
      </article>
    `;
    }).join('');
}

export function updateFlatGrid() {
    const filtered = filterRepos(allRepos, currentSearch, currentTopics, currentLanguage);
    const sorted = sortRepos(filtered, currentSort, currentSortDirection);
    renderRepos(sorted);
}

export function initFlatGridFilters() {
    const searchInput = document.getElementById('repo-search') as HTMLInputElement;
    const topicsBtn = document.getElementById('topics-filter-btn');
    const topicsDropdown = document.getElementById('topics-dropdown');
    const topicsContainer = document.getElementById('topics-dropdown-container');
    const languageBtn = document.getElementById('language-filter-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    const languageContainer = document.getElementById('language-dropdown-container');
    const clearBtn = document.getElementById('clear-filters');
    const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;

    // Search input with debounce
    let searchTimeout: ReturnType<typeof setTimeout>;
    searchInput?.addEventListener('input', (e) => {
        currentSearch = (e.target as HTMLInputElement).value;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(updateFlatGrid, 250);
    });

    // Shortcut for "/" key focusing search input
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as Element)?.tagName)) {
            e.preventDefault();
            searchInput?.focus();
        }
    });

    // Topics and Languages dropdown toggling
    topicsBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        topicsDropdown?.classList.toggle('hidden');
        languageDropdown?.classList.add('hidden');
    });

    languageBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown?.classList.toggle('hidden');
        topicsDropdown?.classList.add('hidden');
    });

    document.addEventListener('click', () => {
        topicsDropdown?.classList.add('hidden');
        languageDropdown?.classList.add('hidden');
    });

    topicsDropdown?.addEventListener('click', (e) => e.stopPropagation());
    languageDropdown?.addEventListener('click', (e) => e.stopPropagation());

    // Populate dynamic dropdown elements
    if (topicsContainer) {
        const topics = getAllTopics(allRepos);
        topicsContainer.innerHTML = topics.map(topic => `
      <label class="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
        <input
          type="checkbox"
          name="topics"
          value="${topic}"
          class="w-4 h-4 rounded border-dark-border bg-dark-bg text-[#ff9a3d] focus:ring-[#ff9a3d] focus:ring-offset-0"
        />
        <span class="text-sm text-gray-300">${topic}</span>
      </label>
    `).join('');

        topicsContainer.querySelectorAll('input[name="topics"]').forEach((chk) => {
            chk.addEventListener('change', () => {
                currentTopics = Array.from(topicsContainer.querySelectorAll('input[name="topics"]:checked'))
                    .map((el) => (el as HTMLInputElement).value);

                const countBadge = document.getElementById('selected-topics-count');
                if (countBadge) {
                    if (currentTopics.length > 0) {
                        countBadge.classList.remove('hidden');
                        countBadge.textContent = String(currentTopics.length);
                    } else {
                        countBadge.classList.add('hidden');
                    }
                }
                updateClearButton();
                updateFlatGrid();
            });
        });
    }

    if (languageContainer) {
        const languages = getAllLanguages(allRepos);
        languageContainer.innerHTML = `
      <label class="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
        <input
          type="radio"
          name="language"
          value=""
          checked
          class="w-4 h-4 border-dark-border bg-dark-bg text-[#ff9a3d] focus:ring-[#ff9a3d]"
        />
        <span class="text-sm text-gray-300">All Languages</span>
      </label>
    ` + languages.map(lang => `
      <label class="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
        <input
          type="radio"
          name="language"
          value="${lang}"
          class="w-4 h-4 border-dark-border bg-dark-bg text-[#ff9a3d] focus:ring-[#ff9a3d]"
        />
        <span class="text-sm text-gray-300">${lang}</span>
      </label>
    `).join('');

        languageContainer.querySelectorAll('input[name="language"]').forEach((radio) => {
            radio.addEventListener('change', (e) => {
                const val = (e.target as HTMLInputElement).value;
                currentLanguage = val || null;

                const filterText = document.getElementById('language-filter-text');
                if (filterText) {
                    filterText.textContent = currentLanguage || 'Language';
                }

                const filterBtn = document.getElementById('language-filter-btn');
                if (filterBtn) {
                    if (currentLanguage) {
                        filterBtn.classList.add('border-[#ff9a3d]', 'text-[#ff9a3d]');
                        filterBtn.classList.remove('border-dark-border', 'text-gray-300');
                    } else {
                        filterBtn.classList.remove('border-[#ff9a3d]', 'text-[#ff9a3d]');
                        filterBtn.classList.add('border-dark-border', 'text-gray-300');
                    }
                }
                updateClearButton();
                updateFlatGrid();
            });
        });
    }

    function updateClearButton() {
        if (!clearBtn) return;
        if (currentTopics.length > 0 || currentLanguage) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }

    clearBtn?.addEventListener('click', () => {
        currentTopics = [];
        currentLanguage = null;

        topicsContainer?.querySelectorAll('input[name="topics"]').forEach((el) => {
            (el as HTMLInputElement).checked = false;
        });

        const allRadio = languageContainer?.querySelector('input[name="language"][value=""]') as HTMLInputElement;
        if (allRadio) allRadio.checked = true;

        const countBadge = document.getElementById('selected-topics-count');
        if (countBadge) countBadge.classList.add('hidden');

        const filterText = document.getElementById('language-filter-text');
        if (filterText) filterText.textContent = 'Language';

        const filterBtn = document.getElementById('language-filter-btn');
        if (filterBtn) {
            filterBtn.classList.remove('border-[#ff9a3d]', 'text-[#ff9a3d]');
            filterBtn.classList.add('border-dark-border', 'text-gray-300');
        }

        clearBtn.classList.add('hidden');
        updateFlatGrid();
    });

    sortSelect?.addEventListener('change', () => {
        const [by, dir] = sortSelect.value.split('-') as ['stars' | 'updated' | 'name', 'asc' | 'desc'];
        currentSort = by;
        currentSortDirection = dir;
        updateFlatGrid();
    });
}
