document.addEventListener("DOMContentLoaded", function() {
    const coursesData = [
        { name: "Introduction to Programming", category: "Programming", difficulty: "Beginner", startDate: "2024-03-01", length: 30, isFree: true },
        { name: "Advanced JavaScript", category: "Programming", difficulty: "Advanced", startDate: "2024-04-15", length: 45, isFree: false },
        { name: "Design Basics", category: "Design", difficulty: "Beginner", startDate: "2024-05-20", length: 30, isFree: true },
        { name: "UX Design Principles", category: "Design", difficulty: "Intermediate", startDate: "2024-06-10", length: 40, isFree: false },
        { name: "Data Structures in C", category: "Computer Science", difficulty: "Advanced", startDate: "2024-07-05", length: 60, isFree: false },
        { name: "Database Fundamentals", category: "Computer Science", difficulty: "Beginner", startDate: "2024-08-01", length: 30, isFree: true },
        // Add more courses as needed
    ];

    function displayCourses(courses) {
        const container = document.getElementById('coursesContainer');
        container.innerHTML = ''; // Clear previous content
        courses.forEach(course => {
            const element = document.createElement('div');
            element.classList.add('course-card');
            element.innerHTML = `<h2>${course.name}</h2>
                                 <p>Category: ${course.category}</p>
                                 <p>Difficulty: ${course.difficulty}</p>
                                 <p>Start Date: ${course.startDate}</p>
                                 <p>Length: ${course.length} days</p>
                                 <p>Type: ${course.isFree ? 'Free' : 'Paid'}</p>`;
            container.appendChild(element);
        });
    }

  function filterCourses() {
    const searchQuery = document.getElementById('searchQuery').value.toLowerCase();
    const filterCategory = document.getElementById('filterCategory').value;
    const filterStartDate = document.getElementById('filterStartDate').value;
    const filterLength = parseInt(document.getElementById('filterLength').value, 10);
    const filterIsFree = document.getElementById('filterIsFree').value;

    const filteredCourses = coursesData.filter(course => {
        const startDateMatch = filterStartDate ? new Date(course.startDate) >= new Date(filterStartDate) : true;
        const lengthMatch = filterLength ? course.length <= filterLength : true;
        const isFreeMatch = filterIsFree ? (filterIsFree === 'true' ? course.isFree : !course.isFree) : true;

        return (course.name.toLowerCase().includes(searchQuery) || !searchQuery) &&
               (course.category === filterCategory || !filterCategory) &&
               startDateMatch &&
               lengthMatch &&
               isFreeMatch;
    });
    displayCourses(filteredCourses);
}


document.getElementById('filterIsFree').addEventListener('change', filterCourses);

// Initial display of courses
displayCourses(coursesData);

});
