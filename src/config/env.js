// Environment configuration
// Load environment variables from .env file and export configuration

require('dotenv').config();

// Export configuration variables
module.exports = {
    // Server port (default to 3000 if not specified)
    PORT: process.env.PORT || 3000,
    // Google Generative AI API key for medical text analysis
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
};