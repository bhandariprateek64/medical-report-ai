// Main server entry point
// Starts the Express application and listens for requests

const app = require('./src/app');
const { PORT } = require('./src/config/env');

// Start the server on the configured port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Endpoint available at POST http://localhost:${PORT}/api/simplify-report`);
});