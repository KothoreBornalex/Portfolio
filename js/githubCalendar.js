(function () {
    const USERNAME = 'KothoreBornalex';
    const API_BASE = 'https://github-contributions-api.jogruber.de/v4/';
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

    let tooltip = null;

    function initTooltip() {
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'calendarTooltip';
            document.body.appendChild(tooltip);
        }
    }

    function showTooltip(e, text) {
        initTooltip();
        tooltip.textContent = text;
        tooltip.classList.add('visible');
        positionTooltip(e);
    }

    function hideTooltip() {
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }

    function positionTooltip(e) {
        if (!tooltip) return;
        const x = e.pageX;
        const y = e.pageY - 10;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    async function loadCalendar(year = 'last') {
        const container = document.getElementById('githubCalendarContent');
        const titleEl = document.getElementById('calendarTotalTitle');
        if (!container) return;

        container.innerHTML = '<div style="padding: 30px; text-align: center; color: #a9bed6; font-family: Manrope, sans-serif;">Loading realtime GitHub contributions...</div>';

        try {
            const res = await fetch(`${API_BASE}${USERNAME}?y=${year}`);
            if (!res.ok) throw new Error('Failed to fetch contributions');
            const data = await res.json();

            const contributions = data.contributions || [];
            const total = (data.total && data.total[year === 'last' ? 'lastYear' : year]) || contributions.reduce((acc, c) => acc + c.count, 0);

            if (titleEl) {
                titleEl.textContent = `${total.toLocaleString()} contributions ${year === 'last' ? 'in the last year' : 'in ' + year}`;
            }

            renderCalendarSvg(container, contributions);
        } catch (err) {
            console.warn('GitHub contributions fetch fallback:', err);
            renderFallbackCalendar(container);
        }
    }

    function renderCalendarSvg(container, contributions) {
        if (!contributions.length) {
            container.innerHTML = '<div style="padding: 20px; color: #a9bed6;">No activity found for this period.</div>';
            return;
        }

        const squareSize = 11;
        const squareGap = 3;
        const leftPadding = 30;
        const topPadding = 20;

        // Group into weeks of 7 days
        // Determine first day of week
        const weeks = [];
        let currentWeek = [];

        // Align first day offset (0 = Sunday)
        const firstDate = new Date(contributions[0].date);
        const startDayOffset = firstDate.getDay(); // 0-6

        for (let i = 0; i < startDayOffset; i++) {
            currentWeek.push(null);
        }

        contributions.forEach((day) => {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });

        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }

        const totalWeeks = weeks.length;
        const svgWidth = leftPadding + totalWeeks * (squareSize + squareGap) + 10;
        const svgHeight = topPadding + 7 * (squareSize + squareGap) + 10;

        let svgHtml = `<svg class="calendarSvg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMinYMin meet">`;

        // Month Labels
        let lastMonth = -1;
        weeks.forEach((week, weekIdx) => {
            const firstValidDay = week.find((d) => d !== null);
            if (firstValidDay) {
                const date = new Date(firstValidDay.date);
                const month = date.getMonth();
                if (month !== lastMonth && weekIdx < totalWeeks - 1) {
                    lastMonth = month;
                    const x = leftPadding + weekIdx * (squareSize + squareGap);
                    svgHtml += `<text x="${x}" y="12" fill="#8fa6c5" font-size="9" font-family="Manrope, sans-serif">${MONTHS[month]}</text>`;
                }
            }
        });

        // Day of week labels
        DAYS.forEach((dayLabel, dayIdx) => {
            if (dayLabel) {
                const y = topPadding + dayIdx * (squareSize + squareGap) + 9;
                svgHtml += `<text x="0" y="${y}" fill="#8fa6c5" font-size="8" font-family="Manrope, sans-serif">${dayLabel}</text>`;
            }
        });

        // Contribution Squares
        weeks.forEach((week, weekIdx) => {
            const x = leftPadding + weekIdx * (squareSize + squareGap);
            week.forEach((day, dayIdx) => {
                const y = topPadding + dayIdx * (squareSize + squareGap);
                if (day) {
                    const level = Math.min(Math.max(day.level || 0, 0), 4);
                    const formattedDate = new Date(day.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    const countText = day.count === 0 ? 'No contributions' : `${day.count} contribution${day.count === 1 ? '' : 's'}`;
                    const tooltipText = `${countText} on ${formattedDate}`;

                    svgHtml += `<rect class="lvl-${level}" x="${x}" y="${y}" width="${squareSize}" height="${squareSize}" rx="0" ry="0" data-tooltip="${tooltipText}"></rect>`;
                }
            });
        });

        svgHtml += `</svg>`;
        container.innerHTML = svgHtml;

        // Attach Tooltip events
        const rects = container.querySelectorAll('rect[data-tooltip]');
        rects.forEach((rect) => {
            rect.addEventListener('mouseenter', (e) => {
                showTooltip(e, rect.getAttribute('data-tooltip'));
            });
            rect.addEventListener('mousemove', positionTooltip);
            rect.addEventListener('mouseleave', hideTooltip);
        });
    }

    function renderFallbackCalendar(container) {
        const titleEl = document.getElementById('calendarTotalTitle');
        if (titleEl) {
            titleEl.textContent = '357 contributions in the last year';
        }
        container.innerHTML = `
            <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center;">
                <img src="https://ghchart.rshah.org/7ec8e3/${USERNAME}" alt="${USERNAME}'s GitHub Contribution Chart" style="width: 100%; max-width: 850px; border-radius: 8px;" />
            </a>
        `;
    }

    // Attach year pill click handlers
    document.addEventListener('DOMContentLoaded', () => {
        loadCalendar('last');

        const yearPills = document.querySelectorAll('.calendarYearPill');
        yearPills.forEach((pill) => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                yearPills.forEach((p) => p.classList.remove('active'));
                pill.classList.add('active');
                const year = pill.getAttribute('data-year');
                loadCalendar(year);
            });
        });
    });
})();
