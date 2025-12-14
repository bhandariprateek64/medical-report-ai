// Express application setup
// Defines routes, middleware, and server configuration

const express = require('express');
const multer = require('multer');
const reportController = require('./controllers/reportController');

const app = express();
// Configure multer to store uploaded files in memory (not disk)
// This keeps the app stateless and easier to deploy
const upload = multer({ storage: multer.memoryStorage() });

// Middleware setup
// Parse incoming JSON requests
app.use(express.json());

// API Routes
// Main endpoint that accepts either image uploads or text input
app.post('/api/simplify-report', upload.single('file'), reportController.processReport);

// Health check endpoint
app.get('/', (req, res) => res.send('Medical Report AI Service is running.'));

module.exports = app;