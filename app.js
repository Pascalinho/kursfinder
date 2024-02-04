document.addEventListener("DOMContentLoaded", function() {
    const coursesData = [
        { name: "Einführung in die Programmierung", category: "Programmierung", difficulty: "Anfänger", startDate: "01.03.2024", length: 30, isFree: true, detailPageUrl: "p1.html", flyerLink: "fp1.pdf" },
        { name: "Fortgeschrittenes JavaScript", category: "Programmierung", difficulty: "Erfahren", startDate: "15.04.2024", length: 45, isFree: false, detailPageUrl: "p2.html", flyerLink: "fp2.pdf" },
        { name: "Grundlagen des Designs", category: "Design", difficulty: "Anfänger", startDate: "20.05.2024", length: 30, isFree: true , detailPageUrl: "p3.html", flyerLink: "fp3.pdf"},
        { name: "Prinzipien des UX-Designs", category: "Design", difficulty: "Erfahren", startDate: "10.06.2024", length: 40, isFree: false , detailPageUrl: "p4.html", flyerLink: "fp4.pdf"},
        { name: "Datenstrukturen in C", category: "Informatik", difficulty: "Erfahren", startDate: "05.07.2024", length: 60, isFree: false , detailPageUrl: "p5.html", flyerLink: "fp5.pdf"},
        { name: "Datenbankgrundlagen", category: "Informatik", difficulty: "Anfänger", startDate: "01.08.2024", length: 30, isFree: true, detailPageUrl: "p6.html", flyerLink: "fp6.pdf" },
        { name: "Grundkurs Fotografie", category: "Kunst", difficulty: "Anfänger", startDate: "15.08.2024", length: 45, isFree: true , detailPageUrl: "p7.html", flyerLink: "fp7.pdf"},
        { name: "Moderne Webentwicklung", category: "Webentwicklung", difficulty: "Erfahren", startDate: "01.09.2024", length: 50, isFree: false , detailPageUrl: "p8.html", flyerLink: "fp8.pdf"},
    ];

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
    }
    
    

    function filterCourses() {
        const searchQuery = document.getElementById('searchQuery').value.toLowerCase();
        const filterCategory = document.getElementById('filterCategory').value;
        const filterDifficulty = document.getElementById('filterDifficulty').value;
        const filterIsFree = document.getElementById('filterIsFree').value;

        const filteredCourses = coursesData.filter(course => {
            return (course.name.toLowerCase().includes(searchQuery) || !searchQuery) &&
                   (course.category === filterCategory || !filterCategory) &&
                   (course.difficulty === filterDifficulty || !filterDifficulty) &&
                   (filterIsFree ? (filterIsFree === 'true' ? course.isFree : !course.isFree) : true);
        });
        displayCourses(filteredCourses);
    }

    function resetFilters() {
        document.getElementById('searchQuery').value = '';
        document.getElementById('filterCategory').selectedIndex = 0;
        document.getElementById('filterDifficulty').selectedIndex = 0;
        document.getElementById('filterIsFree').selectedIndex = 0;
        displayCourses(coursesData);
    }

    document.getElementById('searchQuery').addEventListener('input', filterCourses);
    document.getElementById('filterCategory').addEventListener('change', filterCourses);
    document.getElementById('filterDifficulty').addEventListener('change', filterCourses);
    document.getElementById('filterIsFree').addEventListener('change', filterCourses);
    document.getElementById('resetButton').addEventListener('click', resetFilters);

    displayCourses(coursesData);
});
