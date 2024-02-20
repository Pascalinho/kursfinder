document.addEventListener("DOMContentLoaded", function() {
    const AIRTABLE_TOKEN = 'pats5Oet0d0PGyFmR.def41c9b7f9e808d422c0a19681292480fc7ff9dd66dc28ec6491d91b8be4393';
    const AIRTABLE_BASE_ID = 'appj3D4x39x7XOzzY';
    const AIRTABLE_TABLE_NAME = 'tblreycUb9W8dGYAp';
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

    const headers = {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`
    };

    fetch(airtableUrl, { method: 'GET', headers: headers })
        .then(response => response.json())
        .then(data => {
            sortAndDisplayCourses(data.records);
        })
        .catch(error => console.error('Error fetching data:', error));

        function sortAndDisplayCourses(records) {
            records.sort((a, b) => {
                // Extract the first date from the 'Startdaten' field for both records
                const getFirstDate = (record) => {
                    const datesStr = record.fields["Startdaten"] || ''; // Fallback to empty string if undefined
                    const firstDateStr = datesStr.split(', ')[0]; // Get the first date
                    const [day, month, year] = firstDateStr.split('.').map(Number); // Split and convert to numbers
                    // Return a comparable date value (considering cases where date might be invalid)
                    return new Date(year || 0, (month || 1) - 1, day || 1);
                };
        
                const dateA = getFirstDate(a);
                const dateB = getFirstDate(b);
        
                // Compare the dates
                if (dateA > dateB) return 1;
                if (dateA < dateB) return -1;
        
                // If dates are equal, fallback to comparing another field, e.g., 'Kursname'
                const kursnameA = a.fields["Kursname"] || '';
                const kursnameB = b.fields["Kursname"] || '';
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

    let filteredRecords = records;

    // Apply filter if needed
    if (bildungsgutscheinFilter) {
        filteredRecords = records.filter(record => record.fields["Bildungsgutschein"]);
    }

    // Display filtered records count
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

    if (record.fields["Startdaten"]) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Normalize current date to start of day for comparison

        const startDatesArray = record.fields["Startdaten"].split(', ').filter(dateStr => {
            const [day, month, year] = dateStr.split('.').map(Number);
            const date = new Date(year, month - 1, day);
            return date >= currentDate; // Only include dates that are today or in the future
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
        <h3 id="kursname">${record.fields["Kursname"]}</h3>
        <p>${record.fields["Vollzeit/Teilzeit"]}</p>
    `;
    return element;
}





    document.getElementById('bildungsgutscheinToggle').addEventListener('change', function() {
        fetch(airtableUrl, { method: 'GET', headers: headers })
            .then(response => response.json())
            .then(data => {
                sortAndDisplayCourses(data.records);
            })
            .catch(error => console.error('Error fetching data:', error));
    });


});