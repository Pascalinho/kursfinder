document.addEventListener("DOMContentLoaded", function() {
    const coursesData = [
        { name: "Introduction to Programming", category: "Programming", difficulty: "Beginner" },
        { name: "Advanced JavaScript", category: "Programming", difficulty: "Advanced" },
        { name: "Design Basics", category: "Design", difficulty: "Beginner" },
        // Add more courses as needed
    ];

    function displayCourses(courses) {
        const container = document.getElementById('coursesContainer');
        container.innerHTML = ''; // Clear previous content
        courses.forEach(course => {
            const element = document.createElement('div');
            element.classList.add('course-card');
            element.innerHTML = `<h2>${course.name}</h2><p>Category: ${course.category}</p><p>Difficulty: ${course.difficulty}</p>`;
            container.appendChild(element);
        });
    }

    function filterCourses() {
        const searchQuery = document.getElementById('searchQuery').value.toLowerCase();
        const filterCategory = document.getElementById('filterCategory').value;
        const filteredCourses = coursesData.filter(course => 
            (course.name.toLowerCase().includes(searchQuery) || !searchQuery) &&
            (course.category === filterCategory || !filterCategory)
        );
        displayCourses(filteredCourses);
    }

    document.getElementById('searchQuery').addEventListener('input', filterCourses);
    document.getElementById('filterCategory').addEventListener('change', filterCourses);

    // Initial display of courses
    displayCourses(coursesData);
});
