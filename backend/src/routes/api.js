
// src/routes/api.js

const express = require('express');
const router = express.Router();
const { mockDashboardData, mockCourses } = require('../mock-data'); // Import mock data

// Endpoint: /api/dashboard
router.get('/dashboard', (req, res) => {
    // Simulate a slight delay to mimic network latency
    setTimeout(() => {
        res.json(mockDashboardData);
    }, 500);
});

// Endpoint: /api/courses
router.get('/courses', (req, res) => {
    // Return the mock course catalog data
    setTimeout(() => {
        res.json(mockCourses);
    }, 500);
});

// Endpoint: /api/user/profile (Placeholder for future use)
router.get('/user/profile', (req, res) => {
    res.json({ id: 1, name: 'Marjory Student', email: 'm.student@tomcollege.edu', role: 'Student', department: 'Undeclared' });
});

module.exports = router;
