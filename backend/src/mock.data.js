// src/mock-data.js

const mockDashboardData = {
    totalStudents: 1540,
    activeCourses: 78,
    recentEnrollments: 35,
    currentGPAAverage: 3.25,
    cardData: [
        { title: 'Total Students', value: '1,540', icon: 'groups' },
        { title: 'Active Courses', value: '78', icon: 'school' },
        { title: 'New Enrollments', value: '35', icon: 'person_add' },
        { title: 'GPA Average', value: '3.25', icon: 'trending_up' }
    ],
    tableData: [
        { id: 1001, name: 'Alex Johnson', course: 'Calculus I', grade: 'A-' },
        { id: 1002, name: 'Sarah Lee', course: 'Web Development', grade: 'B+' },
        { id: 1003, name: 'Maria Garcia', course: 'Physics 101', grade: 'A' },
        { id: 1004, name: 'David Kim', course: 'Organic Chemistry', grade: 'C' }
    ]
};

const mockCourses = [
    { code: 'CS101', title: 'Introduction to Programming', credits: 3, department: 'Computer Science' },
    { code: 'MTH210', title: 'Calculus I', credits: 4, department: 'Mathematics' },
    { code: 'ENG101', title: 'Academic Writing', credits: 3, department: 'English' },
    { code: 'PHY101', title: 'General Physics', credits: 4, department: 'Physics' },
    { code: 'WEB305', title: 'Web Development', credits: 3, department: 'Computer Science' }
];

module.exports = {
    mockDashboardData,
    mockCourses
};
