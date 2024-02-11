document.addEventListener("DOMContentLoaded", function() {
    const coursesData = [
        { name: "Einführung in die Programmierung", category: "Programmierung", difficulty: "Anfänger", startDate: "01.03.2024", length: 30, isFree: true, detailPageUrl: "p1.html", flyerLink: "fp1.pdf", location: "Kiel" },
        { name: "Fortgeschrittenes JavaScript", category: "Programmierung", difficulty: "Erfahren", startDate: "15.04.2024", length: 45, isFree: false, detailPageUrl: "p2.html", flyerLink: "fp2.pdf", location: "Rendsburg" },
        // Add more courses with 'location' property
    ];

    const locationImages = {
        "Kiel": "/kiel.png",
        "Rendsburg": "/rendsburg.png",
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
                    <p>Kategorie: ${course.category}</p>
                    <p>Schwierigkeit: ${course.difficulty}</p>
                    <p>Start: ${course.startDate}</p>
                    <p>Dauer: ${course.length} Tage</p>
                    <p>Typ: ${course.isFree ? 'Kostenlos' : 'Kostenpflichtig'}</p>
                    <button onclick="location.href='${course.detailPageUrl}'">Details</button>
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
