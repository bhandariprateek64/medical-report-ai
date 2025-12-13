const express = require('express');
const multer = require('multer');
const reportController = require('./controllers/reportController');

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Process files in memory

// Middleware
app.use(express.json());

// Routes
app.post('/api/simplify-report', upload.single('file'), reportController.processReport);

// Health Check
app.get('/', (req, res) => res.send('Medical Report AI Service is running.'));

module.exports = app;