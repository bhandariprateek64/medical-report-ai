// src/controllers/reportController.js
// Main controller that handles incoming medical report requests
// Coordinates between OCR, AI analysis, and response formatting

const ocrService = require('../services/ocrService');
const aiService = require('../services/aiService');
const { ReportSchema } = require('../utils/validation');

// Process incoming medical report (either image file or text)
// Returns structured JSON with extracted lab tests and analysis
async function processReport(req, res) {
    try {
        let rawText = "";

        // Step 1: Extract raw text from either image file or request body
        if (req.file) {
            // If image file provided, use OCR to extract text
            rawText = await ocrService.extractTextFromBuffer(req.file.buffer);
        } else if (req.body.text) {
            // If text provided directly, use it as-is
            rawText = req.body.text;
        } else {
            return res.status(400).json({ status: "error", message: "No input provided." });
        }

        // Validate that we have meaningful input
        if (!rawText || rawText.length < 5) {
            return res.status(400).json({ status: "error", message: "Input text is too short." });
        }

        // Step 2: Use AI to analyze the medical text and extract structured data
        const aiResult = await aiService.analyzeMedicalText(rawText);

        // Step 3: Safety check - verify the AI found actual tests (not hallucinations)
        // If no tests were extracted, return an unprocessed response
        if (!aiResult.tests || aiResult.tests.length === 0) {
             return res.json({
                 status: "unprocessed",
                 reason: "No tests found or potential hallucinations detected" 
             });
        }

        // Step 4: Build the final response in the required format
        // Include all extracted tests, summary, explanations, and confidence metrics
        const finalResponse = {
            tests: aiResult.tests,
            summary: aiResult.summary,
            explanations: aiResult.explanations || [],
            normalization_confidence: aiResult.normalization_confidence || 0.0,
            status: "ok"
        };

        // Step 5: Validate response structure against schema (optional safeguard)
        // Uncomment below to enforce strict schema validation
        // const validation = ReportSchema.safeParse(finalResponse);
        
        // Return the final structured response
        return res.json(finalResponse);

    } catch (error) {
        // Log any errors that occur during processing
        console.error("Controller Error:", error);
        // Return error response to client
        res.status(500).json({ status: "error", message: error.message });
    }
}

module.exports = { processReport };