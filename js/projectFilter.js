(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const filterTabs = document.querySelectorAll('.filterTab');
        const projectButtons = document.querySelectorAll('.ProjectButton');
        const sectionTitles = document.querySelectorAll('.ProjectSectionsTitle');

        if (!filterTabs.length || !projectButtons.length) return;

        // Calculate and display item count per filter tab
        filterTabs.forEach((tab) => {
            const filter = tab.getAttribute('data-filter');
            let count = 0;
            if (filter === 'all') {
                count = projectButtons.length;
            } else {
                projectButtons.forEach((btn) => {
                    const categories = (btn.getAttribute('data-category') || '').toLowerCase().split(' ');
                    if (categories.includes(filter.toLowerCase())) {
                        count++;
                    }
                });
            }
            const countSpan = tab.querySelector('.filterCount');
            if (countSpan) {
                countSpan.textContent = count;
            }
        });

        // Filter tab click handler
        filterTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const filter = tab.getAttribute('data-filter');

                filterTabs.forEach((t) => t.classList.remove('active'));
                tab.classList.add('active');

                // Filter projects
                projectButtons.forEach((btn) => {
                    const categories = (btn.getAttribute('data-category') || '').toLowerCase().split(' ');
                    if (filter === 'all' || categories.includes(filter.toLowerCase())) {
                        btn.classList.remove('filter-hidden');
                    } else {
                        btn.classList.add('filter-hidden');
                    }
                });

                // Auto hide section titles and divider bars if no projects in that section are visible
                const projectSections = document.querySelectorAll('.project-section-group');
                projectSections.forEach((section) => {
                    const visibleProjects = section.querySelectorAll('.ProjectButton:not(.filter-hidden)');
                    if (visibleProjects.length === 0) {
                        section.classList.add('filter-hidden');
                    } else {
                        section.classList.remove('filter-hidden');
                    }
                });
            });
        });
    });
})();
