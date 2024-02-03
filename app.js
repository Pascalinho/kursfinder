document.addEventListener("DOMContentLoaded", function() {
    const coursesData = [
        { name: "Einführung in die Programmierung", category: "Programmierung", difficulty: "Anfänger", startDate: "01.03.2024", length: 30, isFree: true },
        { name: "Fortgeschrittenes JavaScript", category: "Programmierung", difficulty: "Erfahren", startDate: "15.04.2024", length: 45, isFree: false },
        { name: "Grundlagen des Designs", category: "Design", difficulty: "Anfänger", startDate: "20.05.2024", length: 30, isFree: true },
        { name: "Prinzipien des UX-Designs", category: "Design", difficulty: "Erfahren", startDate: "10.06.2024", length: 40, isFree: false },
        { name: "Datenstrukturen in C", category: "Informatik", difficulty: "Erfahren", startDate: "05.07.2024", length: 60, isFree: false },
        { name: "Datenbankgrundlagen", category: "Informatik", difficulty: "Anfänger", startDate: "01.08.2024", length: 30, isFree: true },
        { name: "Grundkurs Fotografie", category: "Kunst", difficulty: "Anfänger", startDate: "15.08.2024", length: 45, isFree: true },
        { name: "Moderne Webentwicklung", category: "Webentwicklung", difficulty: "Erfahren", startDate: "01.09.2024", length: 50, isFree: false },
        // Add more courses as needed
    ];


    function displayCourses(courses) {
        const container = document.getElementById('coursesContainer');
        container.innerHTML = ''; // Clear previous content
        courses.forEach(course => {
            const element = document.createElement('div');
            element.classList.add('course-card');
            element.innerHTML = `
                <h2>${course.name}</h2>
                <p>Category: ${course.category}</p>
                <p>Difficulty: ${course.difficulty}</p>
                <p>Start Date: ${course.startDate}</p>
                <p>Length: ${course.length} days</p>
                <p>Type: ${course.isFree ? 'Free' : 'Paid'}</p>
            `;
            container.appendChild(element);
        });
    }

    function filterCourses() {
        const searchQuery = document.getElementById('searchQuery').value.toLowerCase();
        const filterCategory = document.getElementById('filterCategory').value;
        const filterIsFree = document.getElementById('filterIsFree').value;

        const filteredCourses = coursesData.filter(course => {
            const isFreeMatch = filterIsFree ? (filterIsFree === 'true' ? course.isFree : !course.isFree) : true;

            return (course.name.toLowerCase().includes(searchQuery) || !searchQuery) &&
                   (course.category === filterCategory || !filterCategory) &&
                   isFreeMatch;
        });
        displayCourses(filteredCourses);
    }

    // Attaching event listeners for the search query, category, and free/paid filters
    document.getElementById('searchQuery').addEventListener('input', filterCourses);
    document.getElementById('filterCategory').addEventListener('change', filterCourses);
    document.getElementById('filterIsFree').addEventListener('change', filterCourses);

    // Initial display of all courses
    displayCourses(coursesData);
});
