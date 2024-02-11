document.addEventListener("DOMContentLoaded", function() {
    const coursesData = [
        { name: "Ausbildung der Ausbilder – AdA", category: "Weiterbildung", difficulty: "Anfänger", startDate: "01.03.2024", length: "21 Werktage", isFree: true, detailPageUrl: "https://www.tertia.de/massnahmen/ausbildung-der-ausbilder-ada-46/", flyerLink: "https://www.tertia.de/wp-content/uploads/Flyer_TOBi_AEVO_Kiel.pdf", location: "Kiel" },
        { name: "Beruf und Sprache", category: "Coaching", difficulty: "Erfahren", startDate: "15.04.2024", length: "210 UE", isFree: false, detailPageUrl: "https://www.tertia.de/massnahmen/beruf-und-sprache-18/", flyerLink: "https://www.tertia.de/wp-content/uploads/Flyer_AVGS_Beruf_und_Sprache_Kiel.pdf", location: "Kiel" },
        { name: "Fit for Job: Arbeit und Gesundheit", category: "Coaching", difficulty: "Erfahren", startDate: "15.04.2024", length: "nach Absprache", isFree: false, detailPageUrl: "https://www.tertia.de/massnahmen/gesundheitscoaching-17/", flyerLink: "https://www.tertia.de/wp-content/uploads/Flyer_AVGS_Gesundheitscoaching_Kiel.pdf", location: "Kiel" },
       
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

    function displayCourses(courses) {
        const container = document.getElementById('coursesContainer');
        container.innerHTML = '';
        if (courses.length === 0) {
            container.innerHTML = `<div class="no-results">Keine Kurse gefunden, die den Kriterien entsprechen.</div>`;
        } else {
            courses.forEach(course => {
                const element = document.createElement('div');
                element.classList.add('course-card');
                element.innerHTML = `
                    <h2>${course.name}</h2>
                    <p>Start: ${course.startDate}</p>
                    <p>Dauer: ${course.length}</p>
                    <p>Typ: ${course.isFree ? 'Kostenlos' : 'Kostenpflichtig'}</p>
                    <button onclick="window.open('${course.detailPageUrl}', '_blank')">Details</button>
                    ${course.flyerLink ? `<a href="${course.flyerLink}" target="_blank" class="flyer-link">Kursflyer</a>` : ''}
                `;
                container.appendChild(element);
            });
        }
        updateLocationImage(); // Update location image based on the initial or reset state
    }

    function filterCourses() {
        const searchQuery = document.getElementById('searchQuery').value.toLowerCase();
        const filterCategory = document.getElementById('filterCategory').value;
        const filterDifficulty = document.getElementById('filterDifficulty').value;
        const filterIsFree = document.getElementById('filterIsFree').value;
        const filterLocation = document.getElementById('filterLocation').value;

        const filteredCourses = coursesData.filter(course => {
            return (course.name.toLowerCase().includes(searchQuery) || !searchQuery) &&
                   (course.category === filterCategory || !filterCategory) &&
                   (course.difficulty === filterDifficulty || !filterDifficulty) &&
                   (filterIsFree ? (filterIsFree === 'true' ? course.isFree : !course.isFree) : true) &&
                   (course.location === filterLocation || !filterLocation);
        });
        displayCourses(filteredCourses);
    }

    function resetFilters() {
        document.getElementById('searchQuery').value = '';
        document.getElementById('filterCategory').selectedIndex = 0;
        document.getElementById('filterDifficulty').selectedIndex = 0;
        document.getElementById('filterIsFree').selectedIndex = 0;
        document.getElementById('filterLocation').selectedIndex = 0; // Ensure location filter is also reset
        filterCourses(); // Reapply filters to reset courses display
    }

    document.getElementById('searchQuery').addEventListener('input', filterCourses);
    document.getElementById('filterCategory').addEventListener('change', filterCourses);
    document.getElementById('filterDifficulty').addEventListener('change', filterCourses);
    document.getElementById('filterIsFree').addEventListener('change', filterCourses);
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
