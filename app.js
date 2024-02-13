document.addEventListener("DOMContentLoaded", function() {
    const coursesData = [
        {
            name: "Ausbildereignung (AEVO)",
            category: "Weiterbildung",
            difficulty: "Berufsübergreifend",
            startDates: ["02.01.2024", "29.02.2024"],
            startIntervalMonths: 2,
            length: "1 Monat = 21 Schulungstage",
            isFree: true,
            detailPageUrl: "https://www.tertia.de/massnahmen/ausbildung-der-ausbilder-ada-46/",
            flyerLink: "https://www.tertia.de/wp-content/uploads/Flyer_TOBi_AEVO_Kiel.pdf",
            location: "Kiel",
            zielgruppe: "Arbeitssuchende",
            mode: "Vollzeit"
        },
        {
            name: "Betreuungsassistent:in",
            category: "Weiterbildung",
            difficulty: "Berufsübergreifend",
            startDates: ["02.01.2024", "29.02.2024"],
            startIntervalMonths: 0,
            length: "2 Monate = 42 Schulungstage",
            isFree: true,
            detailPageUrl: "TBD",
            flyerLink: "TBD",
            location: "Kiel",
            zielgruppe: "Arbeitssuchende",
            mode: "Vollzeit"
        },
        {
            name: "DATEV - Finanzbuchführung sowie Lohn und Gehalt (2 Module)",
            category: "Weiterbildung",
            difficulty: "Berufsübergreifend",
            startDates: ["31.01.2024", "03.04.2024"],
            startIntervalMonths: 0,
            length: "2 Monate = 42 Schulungstage",
            isFree: true,
            detailPageUrl: "TBD",
            flyerLink: "TBD",
            location: "Kiel",
            zielgruppe: "Arbeitssuchende",
            mode: "Vollzeit"
        },
        {
            name: "Digitaler Führerschein - Vermittlung von Grundkompetenzen",
            category: "Weiterbildung",
            difficulty: "Berufsübergreifend",
            startDates: ["02.01.2024", "31.01.2024", /* Monthly start dates */],
            startIntervalMonths: 1,
            length: "3 Monate = 63 Schulungstage (Vollzeit), 4,5 Monate = 95 Schulungstage (Teilzeit)",
            isFree: true,
            detailPageUrl: "TBD",
            flyerLink: "TBD",
            location: "Kiel",
            zielgruppe: "Arbeitssuchende",
            mode: "Vollzeit/Teilzeit" 
        },

        {
            name: "Grundkompetenzen: Deutsch, Mathe, Arbeiten und Bildung 4.0",
            category: "Weiterbildung",
            difficulty: "Berufsübergreifend",
            startDates: ["02.01.2024", "31.01.2024",],
            startIntervalMonths: 1,
            length: "1 Monat = 21 Schulungstage",
            isFree: true,
            detailPageUrl: "TBD",
            flyerLink: "TBD",
            location: "Kiel",
            zielgruppe: "Migranten",
            mode: "Vollzeit" 
        },
        {
            name: "Intensiv-Fortbildung JobCoach",
            category: "Weiterbildung",
            difficulty: "Berufsübergreifend",
            startDates: ["02.01.2024", "29.02.2024",],
            startIntervalMonths: 2,
            length: "2 Monate = 42 Schulungstage",
            isFree: false,
            detailPageUrl: "TBD",
            flyerLink: "TBD",
            location: "Rendsburg",
            zielgruppe: "Arbeitssuchende",
            mode: "Vollzeit" 
        },
        {
            name: "MS-Office-zeitgemäße Bürosoftware sicher anwenden - 3 Module",
            category: "Weiterbildung",
            difficulty: "Berufsübergreifend",
            startDates: ["02.01.2024", "31.01.2024",],
            startIntervalMonths: 1,
            length: "1 Monat = 21 Schulungstage je Modul, einzeln buchbar",
            isFree: true,
            detailPageUrl: "TBD",
            flyerLink: "TBD",
            location: "Kiel",
            zielgruppe: "Arbeitssuchende",
            mode: "Vollzeit" 
        },
        


    ];

    const locationImages = {
        "Kiel": "Kiel.png",
        "Rendsburg": "Rendsburg.png",
        // Add paths for other location images
    };
    const locationTexts = {
        "Kiel": "Herzlich willkommen bei TERTIA Kiel",
        "Rendsburg": "Herzlich willkommen bei TERTIA Rendsburg",
        // Add paths for other location images
    };


    function formatDate(date) {
        const options = { month: 'long', year: 'numeric' };
        return date.toLocaleDateString('de-DE', options);
    }
    
    function generateAndFormatStartDates(startDates, intervalMonths) {
        const today = new Date();
        let formattedDates = [];
    
        // First, add explicit start dates that are in the future
        startDates.forEach(dateStr => {
            const date = new Date(dateStr.split(".").reverse().join("-"));
            if (date >= today) {
                // Add the explicit future start date formatted as DD.MM.YYYY or to month and year
                formattedDates.push(date.getDate() === 1 ? formatDate(date) : dateStr);
            }
        });
    
        // Generate future dates based on the interval, if specified
        if (intervalMonths > 0) {
            let lastStartDate = new Date(startDates[startDates.length - 1].split(".").reverse().join("-"));
            let futureDate = new Date(lastStartDate.setMonth(lastStartDate.getMonth() + intervalMonths));
            while (futureDate.getFullYear() === today.getFullYear() || (futureDate.getFullYear() === today.getFullYear() + 1 && futureDate.getMonth() <= today.getMonth())) {
                if (futureDate >= today) {
                    formattedDates.push(formatDate(futureDate));
                }
                futureDate = new Date(futureDate.setMonth(futureDate.getMonth() + intervalMonths));
            }
        }
    
        return formattedDates;
    }
    
    function displayCourses(courses) {
        const container = document.getElementById('coursesContainer');
        container.innerHTML = '';
    
        if (courses.length === 0) {
            container.innerHTML = `<div class="no-results">Keine Kurse gefunden, die den Kriterien entsprechen.</div>`;
            return;
        }
    
        courses.forEach(course => {
            const futureStartDates = generateAndFormatStartDates(course.startDates, course.startIntervalMonths).join(", ");
    
            const element = document.createElement('div');
            element.classList.add('course-card');
            element.innerHTML = `
                <h2>${course.name}</h2>
                <p>Start: ${futureStartDates || 'Keine zukünftigen Termine'}</p>
                <p>Dauer: ${course.length}</p>
                
                <p>${course.mode}</p>
                <button onclick="window.open('${course.detailPageUrl}', '_blank')">Details</button>
                ${course.flyerLink ? `<a href="${course.flyerLink}" target="_blank" class="flyer-link">Kursflyer</a>` : ''}
            `;
            container.appendChild(element);
        });
    
    
    
        updateLocationImage(); // Update location image and text based on filters
    }
    
    function filterCourses() {
        const searchQuery = document.getElementById('searchQuery').value.toLowerCase();
        const filterCategory = document.getElementById('filterCategory').value;
        const filterDifficulty = document.getElementById('filterDifficulty').value;
        const filterIsFree = document.getElementById('filterIsFree').value;
        const filterLocation = document.getElementById('filterLocation').value;
        const filterZielgruppe = document.getElementById('filterZielgruppe').value;
        const filterStartDateInput = document.getElementById('filterStartDate').value;
        const filterStartDate = filterStartDateInput ? new Date(filterStartDateInput) : null;
        const filterMode = document.getElementById('filterMode').value;
    
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date
    
        const filteredCourses = coursesData.filter(course => {
            let includeCourse = false;
    
            // Process each start date of the course
            course.startDates.forEach(dateStr => {
                let courseDate = new Date(dateStr.split(".").reverse().join("-"));
    
                // If the course has a start interval, calculate future dates
                if (course.startIntervalMonths > 0) {
                    let futureDate = new Date(courseDate);
                    while (futureDate <= today) {
                        futureDate.setMonth(futureDate.getMonth() + course.startIntervalMonths);
                    }
                    courseDate = futureDate;
                }
    
                if ((!filterStartDate || courseDate >= filterStartDate) && courseDate >= today) {
                    includeCourse = true;
                }
            });
    
            // Adjusted filterMode logic to handle "Vollzeit/Teilzeit" courses
            const courseModes = course.mode.split('/').map(mode => mode.trim());
            const modeMatches = !filterMode || courseModes.includes(filterMode);
    
            // Additional filter checks
            return includeCourse &&
                   modeMatches &&
                   (!searchQuery || course.name.toLowerCase().includes(searchQuery)) &&
                   (!filterCategory || course.category === filterCategory) &&
                   (!filterDifficulty || course.difficulty === filterDifficulty) &&
                   (filterIsFree === "" || course.isFree === (filterIsFree === "true")) &&
                   (!filterZielgruppe || course.zielgruppe === filterZielgruppe) &&
                   (!filterLocation || course.location === filterLocation);
        });
    
        displayCourses(filteredCourses);
    }
    
    
    
    
    
    
    

    function resetFilters() {
        document.getElementById('searchQuery').value = '';
        document.getElementById('filterCategory').selectedIndex = 0;
        document.getElementById('filterDifficulty').selectedIndex = 0;
        document.getElementById('filterIsFree').selectedIndex = 0;
        document.getElementById('filterLocation').selectedIndex = 0;
        document.getElementById('filterZielgruppe').selectedIndex = 0;
        document.getElementById('filterStartDate').value = '';
        document.getElementById('filterMode').selectedIndex = '0';
        filterCourses(); // Reapply filters to reset courses display
    }

    document.getElementById('searchQuery').addEventListener('input', filterCourses);
    document.getElementById('filterCategory').addEventListener('change', filterCourses);
    document.getElementById('filterDifficulty').addEventListener('change', filterCourses);
    document.getElementById('filterIsFree').addEventListener('change', filterCourses);
    document.getElementById('filterZielgruppe').addEventListener('change', filterCourses);
    document.getElementById('filterStartDate').addEventListener('change', filterCourses);
    document.getElementById('filterMode').addEventListener('change', filterCourses);
    document.getElementById('filterLocation').addEventListener('change', function() {
        filterCourses(); // Reapply filters with new location
        updateLocationImage(); // Update the location image based on the new selection
    });
    document.getElementById('resetButton').addEventListener('click', resetFilters);

    function updateLocationImage() {
        const filterLocation = document.getElementById('filterLocation').value;
        const locationImage = document.getElementById('locationImage');
        const locationText = document.getElementById('locationText'); // Ensure this element exists in your HTML
    
        locationImage.src = locationImages[filterLocation] || "tertia.jpg"; // Use default image if no match
        locationImage.alt = filterLocation || "Standard Standortbild"; // Update alt text
    
        // Correctly handle default text when a specific location is not selected
        locationText.innerHTML = locationTexts[filterLocation] || "Herzlich willkommen bei TERTIA"; // Default text
    }
    

    // Initial display of courses
    displayCourses(coursesData);
});
