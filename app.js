document.addEventListener("DOMContentLoaded", function() {
    const jsonDataUrl = 'courses.json';

    fetch(jsonDataUrl)
        .then(response => response.json())
        .then(data => {
            sortAndDisplayCourses(data); // Data is now directly passed without assuming a 'records' wrapper
        })
        .catch(error => console.error('Error fetching data:', error));

    function sortAndDisplayCourses(records) {
        records.sort((a, b) => {
            const getFirstDate = (record) => {
                const datesStr = record["Startdaten"] || ''; // Accessing directly without 'fields'
                const firstDateStr = datesStr.split(', ')[0];
                const [day, month, year] = firstDateStr.split('.').map(Number);
                return new Date(year || 0, (month || 1) - 1, day || 1);
            };

            const dateA = getFirstDate(a);
            const dateB = getFirstDate(b);

            if (dateA > dateB) return 1;
            if (dateA < dateB) return -1;

            const kursnameA = a["Kursname"] || ''; // Accessing directly without 'fields'
            const kursnameB = b["Kursname"] || '';
            return kursnameA.localeCompare(kursnameB);
        });
        displayCourses(records);
    }

    function displayCourses(records) {
        const container = document.getElementById('coursesContainer');
        const countsContainer = document.getElementById('countsContainer');
        const bildungsgutscheinFilter = document.getElementById('bildungsgutscheinToggle').checked;

        countsContainer.innerHTML = `Alle: ${records.length}`;
        container.innerHTML = '';

        let filteredRecords = records.filter(record => !bildungsgutscheinFilter || record["Bildungsgutschein"] === "checked");

        countsContainer.innerHTML += `  Angezeigt: <strong style="color:#0052BA;">${filteredRecords.length}</strong>`;

        filteredRecords.forEach(record => {
            const courseCard = createCourseCard(record);
            container.appendChild(courseCard);
        });
    }

    function createCourseCard(record) {
        const element = document.createElement('div');
        element.classList.add('course-card');
        
        let initialFormattedStartDates = '';
        let allFormattedStartDates = ''; // For initial + additional dates
    
        if (record["Startdaten"]) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Normalize current date to start of day for comparison
    
            const futureDates = record["Startdaten"].split(', ').filter(dateStr => {
                const [day, month, year] = dateStr.split('.').map(Number);
                const date = new Date(year, month - 1, day);
                return date >= currentDate;
            });
    
            const displayDates = futureDates.slice(0, 3);
            const additionalDates = futureDates.slice(3);
    
            // Format the first three dates for initial display
            initialFormattedStartDates = displayDates.map(dateStr => formatDate(dateStr)).join(', ');
    
            // Format all dates for expanded view
            allFormattedStartDates = futureDates.map(dateStr => formatDate(dateStr)).join(', ');
    
            // Add toggle sign if there are additional dates
            if (additionalDates.length > 0) {
                initialFormattedStartDates += ` <span class="toggle-dates">weitere anzeigen</span>`;
                allFormattedStartDates += ` <span class="toggle-dates">weniger anzeigen</span>`;
            }
        }
    
        // Set the initial content with the toggle sign
        element.innerHTML = `
            <p>Starttermine: <strong><span class="dates-list">${initialFormattedStartDates}</span></strong></p>
            <h3 id="kursname">${record["Kursname"]}</h3>
            <p>${record["Vollzeit/Teilzeit"]}</p>
        `;
    
        // Toggle functionality
        const datesListSpan = element.querySelector('.dates-list');
        element.addEventListener('click', function(event) {
            if (event.target.classList.contains('toggle-dates')) {
                if (event.target.textContent === 'weitere anzeigen') {
                    // Expand to show all dates
                    datesListSpan.innerHTML = allFormattedStartDates;
                } else {
                    // Collapse to show initial dates only
                    datesListSpan.innerHTML = initialFormattedStartDates;
                }
            }
        });
    
        return element;
    }
    
    // Helper function to format dates
    function formatDate(dateStr) {
        const [day, month, year] = dateStr.split('.').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    
});
