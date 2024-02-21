document.addEventListener("DOMContentLoaded", function() {
    const jsonDataUrl = 'courses.json';
    let globalRecords = []; // Store the fetched records globally

    fetch(jsonDataUrl)
        .then(response => response.json())
        .then(data => {
            globalRecords = data; // Save fetched records globally
            filterAndDisplayCourses(); // Initial display with filters applied
        })
        .catch(error => console.error('Error fetching data:', error));

    document.getElementById('suche').addEventListener('input', filterAndDisplayCourses);
    document.getElementById('bildungsgutscheinToggle').addEventListener('change', filterAndDisplayCourses);

    let selectedCategory = "Alle Berufsgruppen"; // Default category

    
function attachButtonEventListeners() {
    const buttons = document.querySelectorAll(".button-container button");
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Logic to update the selected category and re-filter courses
            buttons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedCategory = this.textContent; // Update selectedCategory with the button's text
            filterAndDisplayCourses(); // Call filterAndDisplayCourses without passing parameters
        });
    });
}

document.getElementById('sortingOption').addEventListener('change', function() {
    filterAndDisplayCourses(); // This will now consider the current sorting option
});


document.querySelectorAll('.measure-checkbox, .attendance-checkbox, #earliestStartDate').forEach(input => {
    input.addEventListener('change', filterAndDisplayCourses);
});


document.getElementById('resetFilters').addEventListener('click', function() {
    resetFilters();
});

function resetFilters() {
    document.getElementById('suche').value = '';
    document.getElementById('bildungsgutscheinToggle').checked = false;
    document.getElementById('earliestStartDate').value = '';

    // Reset all checkboxes for both groups
    document.querySelectorAll('.measure-checkbox, .attendance-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });

    selectedCategory = "Alle Berufsgruppen";

    document.querySelector(".button-container button:first-child").click();
    
    filterAndDisplayCourses();
}


function filterAndDisplayCourses() {
    const searchQuery = document.getElementById('suche').value.toLowerCase();
    const bildungsgutscheinToggle = document.getElementById('bildungsgutscheinToggle').checked;
    const earliestStartDate = document.getElementById('earliestStartDate').value;
    const currentDate = new Date();

    // Gather checked states for "Maßnahme"
    const measures = ['Coaching', 'Weiterbildung', 'Reha'].filter(measure => 
        document.getElementById(`${measure.toLowerCase()}Checkbox`).checked
    );

    // Gather checked states for "Vollzeit/Teilzeit"
    const attendanceTypes = [];
if (document.getElementById('vzCheckbox').checked) {
    attendanceTypes.push('Vollzeit', 'Vollzeit/Teilzeit'); // Include "Vollzeit/Teilzeit" for "Vollzeit"
}
if (document.getElementById('tzCheckbox').checked) {
    attendanceTypes.push('Teilzeit', 'Vollzeit/Teilzeit'); // Also include "Vollzeit/Teilzeit" for "Teilzeit"
}
if (document.getElementById('indiCheckbox').checked) {
    attendanceTypes.push('Individuell');
}


    const filteredRecords = globalRecords.filter(record => {
        const matchesSearch = record["Kursname"].toLowerCase().includes(searchQuery);
        const matchesBildungsgutschein = !bildungsgutscheinToggle || record["Bildungsgutschein"] === "true";
        const matchesCategory = selectedCategory === "Alle Berufsgruppen" || record["Category"] === selectedCategory;
        
        const startDate = new Date(record["Startdaten"].split(', ')[0]); // Assuming multiple start dates, take the first
        const matchesStartDate = record["Startdaten"].split(', ')
    .map(dateStr => {
        const [day, month, year] = dateStr.split('.').map(Number);
        return new Date(year, month - 1, day);
    })
    .some(date => date >= currentDate && (!earliestStartDate || date >= new Date(earliestStartDate)));


        const matchesMeasure = !measures.length || measures.includes(record["Maßnahme"]);
        const isVollzeit = document.getElementById('vzCheckbox').checked && (record["Vollzeit/Teilzeit"].includes("Vollzeit") || record["Vollzeit/Teilzeit"] === "Vollzeit/Teilzeit");
        const isTeilzeit = document.getElementById('tzCheckbox').checked && (record["Vollzeit/Teilzeit"].includes("Teilzeit") || record["Vollzeit/Teilzeit"] === "Vollzeit/Teilzeit");
        const isIndividuell = document.getElementById('indiCheckbox').checked && record["Vollzeit/Teilzeit"].includes("Individuell");
        
        // Ensuring that the course matches any of the checked conditions
        const matchesAttendanceType = attendanceTypes.length === 0 || attendanceTypes.some(type => record["Vollzeit/Teilzeit"].includes(type));

    
        return matchesSearch && matchesBildungsgutschein && matchesCategory && matchesStartDate && matchesMeasure && matchesAttendanceType;
    });
   

    sortAndDisplayCourses(filteredRecords);
    updateCourseCounts(globalRecords.length, filteredRecords.length);
}


    function updateCourseCounts(total, filtered) {
        const countsContainer = document.getElementById('countsContainer');
        countsContainer.innerHTML = `Alle: ${total} <br> Angezeigt: <strong>${filtered}</strong>`;
    }

    function sortAndDisplayCourses(records) {
        const sortingOption = document.getElementById('sortingOption').value;
    
        if (sortingOption === "az") {
            records.sort((a, b) => a["Kursname"].localeCompare(b["Kursname"], 'de-DE'));
        } else if (sortingOption === "za") {
            records.sort((a, b) => b["Kursname"].localeCompare(a["Kursname"], 'de-DE'));
        } else {
            // Default to sorting by date
            records.sort((a, b) => compareDatesAndNames(a, b));
        }
        
        displayCourses(records);
    }
    

    function displayCourses(records) {
        const container = document.getElementById('coursesContainer');
        container.innerHTML = '';

        records.forEach(record => {
            const courseCard = createCourseCard(record);
            container.appendChild(courseCard);
        });
    }

    function createCourseCard(record) {
        const element = document.createElement('div');
        element.classList.add('course-card');

        // Generate dates and toggle state handling
        const futureDates = getFutureDates(record["Startdaten"]);
        element.appendChild(generateCourseCardContent(record, futureDates.slice(0, 3), futureDates));

        return element;
    }

    function getFutureDates(datesStr) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return datesStr.split(', ').filter(dateStr => {
            const [day, month, year] = dateStr.split('.').map(Number);
            const date = new Date(year, month - 1, day);
            return date >= currentDate;
        });
    }

    function generateCourseCardContent(record, initialDates, allDates) {
        const content = document.createElement('div');

        const formattedStartDates = initialDates.map(dateStr => formatDate(dateStr)).join(', ');
        const moreDatesAvailable = allDates.length > initialDates.length;

        content.innerHTML = `
            <p>Starttermine: <strong>${formattedStartDates}</strong>${moreDatesAvailable ? ' <span class="toggle-dates">+ weitere Termine</span>' : ''}</p>
            <h3>${record["Kursname"]}</h3>
            <div style="display:flex; gap:20px; padding-top:10px;">
                <p><i class="fas fa-clock"></i> ${record["Vollzeit/Teilzeit"]}</p>
                <p><i class="fas fa-book"></i> ${record["Maßnahme"]}</p>
                <p><i class="fas fa-coins"></i> ${record["Finanzierung"]}</p>
            </div>
            <button type="button" class="btn btn-secondary details-btn" onclick="window.open('${record["Url"]}', '_blank')">Details</button>
        `;

        if (moreDatesAvailable) {
            const toggleDatesSpan = content.querySelector('.toggle-dates');
            toggleDatesSpan.onclick = () => toggleDates(content, record, allDates);
        }

        return content;
    }

    function toggleDates(content, record, allDates) {
        const datesDisplay = content.querySelector('p > strong');
        const toggleSpan = content.querySelector('.toggle-dates');

        if (toggleSpan.textContent.includes('weitere')) {
            // Show all dates
            datesDisplay.textContent = allDates.map(dateStr => formatDate(dateStr)).join(', ');
            toggleSpan.textContent = '- weniger anzeigen';
        } else {
            // Show initial dates
            const initialDates = allDates.slice(0, 3);
            datesDisplay.textContent = initialDates.map(dateStr => formatDate(dateStr)).join(', ');
            toggleSpan.textContent = '+ weitere Termine';
        }
    }

    function formatDate(dateStr) {
        const [day, month, year] = dateStr.split('.').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    function compareDatesAndNames(a, b) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Normalize current date to start of day for comparison
    
        const getEarliestFutureStartDate = (record) => {
            const futureDates = record["Startdaten"].split(', ')
                .map(dateStr => {
                    const [day, month, year] = dateStr.split('.').map(Number);
                    return new Date(year, month - 1, day);
                })
                .filter(date => date >= currentDate) // Keep only future dates
                .sort((date1, date2) => date1 - date2); // Sort future dates in ascending order
            return futureDates.length > 0 ? futureDates[0] : null;
        };
    
        const earliestDateA = getEarliestFutureStartDate(a);
        const earliestDateB = getEarliestFutureStartDate(b);
    
        // Handle cases where one or both records do not have future start dates
        if (!earliestDateA) return 1; // Sort A after B
        if (!earliestDateB) return -1; // Sort B after A
    
        // Compare the earliest future start dates
        if (earliestDateA < earliestDateB) return -1;
        if (earliestDateA > earliestDateB) return 1;
    
        // If the dates are the same, fall back to comparing course names
        return a["Kursname"].localeCompare(b["Kursname"], 'de-DE');
    }
    
    
    initializeButtonSelection();
    attachButtonEventListeners();
    
    
});

function initializeButtonSelection() {
    // Set the "Alle Berufsgruppen" button as selected by default
    document.querySelector(".button-container button").classList.add('selected');
}

function attachButtonEventListeners() {
    const buttons = document.querySelectorAll(".button-container button");
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'selected' class from all buttons
            buttons.forEach(btn => btn.classList.remove('selected'));
            // Add 'selected' class to the clicked button
            this.classList.add('selected');
            // Update selectedCategory based on the clicked button
            selectedCategory = this.textContent;
            // Re-filter and display courses with all current criteria
            filterAndDisplayCourses();
        });
    });
}
