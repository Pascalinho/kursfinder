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

        countsContainer.innerHTML += `  Angezeigt: <strong>${filteredRecords.length}</strong>`;

        filteredRecords.forEach(record => {
            const courseCard = createCourseCard(record);
            container.appendChild(courseCard);
        });
    }

    function createCourseCard(record) {
        const element = document.createElement('div');
        element.classList.add('course-card');

        let formattedStartDates = '';
        if (record["Startdaten"]) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const startDatesArray = record["Startdaten"].split(', ').filter(dateStr => {
                const [day, month, year] = dateStr.split('.').map(Number);
                const date = new Date(year, month - 1, day);
                return date >= currentDate;
            });

            formattedStartDates = startDatesArray.map(dateStr => {
                const [day, month, year] = dateStr.split('.');
                const date = new Date(year, month - 1, day);
                return date.toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }).join(', ');
        }

        element.innerHTML = `
            <p>Starttermine: <strong>${formattedStartDates}</strong></p>
            <h3 id="kursname">${record["Kursname"]}</h3>
            <p>${record["Vollzeit/Teilzeit"]}</p>
        `;
        return element;
    }
});
