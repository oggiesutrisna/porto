function openTab(tabName) {
    var i, tabContent, tabButtons;

    // Get all tab content and buttons
    tabContent = document.getElementsByClassName("tab-content");
    tabButtons = document.getElementsByClassName("tab-button");

    // First, remove active class from all tabs and buttons
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active");
    }

    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    // Add active class to the selected tab and button
    const selectedTab = document.getElementById(tabName);

    // Apply the active class after a short delay for smoother transition
    setTimeout(function() {
        selectedTab.classList.add("active");

        // Reset animations for elements inside the tab
        const headings = selectedTab.querySelectorAll('h2, h3');
        const paragraphs = selectedTab.querySelectorAll('p');
        const listItems = selectedTab.querySelectorAll('li');

        // Apply animation with staggered delay
        headings.forEach((heading, index) => {
            heading.style.animation = 'none';
            heading.offsetHeight; // Trigger reflow
            heading.style.animation = `slideInLeft ${0.6 + index * 0.1}s ease forwards`;
        });

        paragraphs.forEach((paragraph, index) => {
            paragraph.style.animation = 'none';
            paragraph.offsetHeight; // Trigger reflow
            paragraph.style.animation = `slideInLeft ${0.8 + index * 0.1}s ease forwards`;
        });

        listItems.forEach((item, index) => {
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = `slideInRight ${0.9 + index * 0.05}s ease forwards`;
        });
    }, 50);

    event.currentTarget.classList.add("active");
}

// Initialize the first tab as active and handle theme
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("info").classList.add("active");
    document.querySelector(".tab-button").classList.add("active");

    // Add entrance animation for container
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';

    setTimeout(function() {
        container.style.transition = 'all 0.8s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 200);

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
    }

    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');

        // Save preference to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Dynamic Favicon Generation
    function generateFavicon() {
        const canvas = document.createElement('canvas');
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Generate random colors for gradient
        const colors = [
            '#4a9eff',
            '#2ecc71',
            '#e74c3c',
            '#f1c40f',
            '#9b59b6'
        ];
        const color1 = colors[Math.floor(Math.random() * colors.length)];
        const color2 = colors[Math.floor(Math.random() * colors.length)];

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        // Draw circle with gradient
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('O', size/2, size/2);

        // Update favicon
        const favicon = document.getElementById('dynamic-favicon');
        favicon.href = canvas.toDataURL('image/png');
    }

    // Generate initial favicon and set up interval
    generateFavicon();
    setInterval(generateFavicon, 5000); // Update every 5 seconds
});
