// Import the Express router
const router = require('express').Router();
// Import the file system module to read the data file
const fs = require('fs');
// Import the path module
const path = require('path');

// Define the path to the mock data file (in the Angular assets folder)
const dataPath = path.join(__dirname, '..', '..', 'src', 'assets', 'data.json');

// --- Dashboard API Route ---
router.get('/dashboard', (req, res) => {
  try {
    // Read the contents of the data.json file synchronously
    const data = fs.readFileSync(dataPath, 'utf8');
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Send the dashboard data from the JSON file
    res.json(jsonData.dashboard);

  } catch (error) {
    console.error('Error reading or parsing data.json:', error);
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error retrieving dashboard data' });
  }
});

// --- Students API Route ---
router.get('/students', (req, res) => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        const jsonData = JSON.parse(data);
        // Send the students list
        res.json(jsonData.students);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving students data' });
    }
});

// --- Courses API Route ---
router.get('/courses', (req, res) => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        const jsonData = JSON.parse(data);
        // Send the courses list
        res.json(jsonData.courses);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving courses data' });
    }
});

// Export the router to be used in server.js
module.exports = router;
