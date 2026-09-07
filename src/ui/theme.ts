/* ==========================================================================
   Theme Management
   ========================================================================== */
export function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.theme-icon-light');
    const moonIcon = document.querySelector('.theme-icon-dark');

    function updateIcons(isLight: boolean) {
        if (isLight) {
            sunIcon?.classList.remove('hidden');
            moonIcon?.classList.add('hidden');
        } else {
            sunIcon?.classList.add('hidden');
            moonIcon?.classList.remove('hidden');
        }
    }

    // Initial load
    const isLight = document.documentElement.classList.contains('light-mode');
    updateIcons(isLight);

    themeToggle?.addEventListener('click', () => {
        const isNowLight = document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('theme', isNowLight ? 'light' : 'dark');
        updateIcons(isNowLight);
    });
}
