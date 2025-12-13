const ocrService = require('../services/ocrService');
const aiService = require('../services/aiService');
const { ReportSchema } = require('../utils/validation');

async function processReport(req, res) {
    try {
        let rawText = "";

        // 1. Input Handling: Check for file (image) or body (text)
        if (req.file) {
            rawText = await ocrService.extractTextFromBuffer(req.file.buffer);
        } else if (req.body.text) {
            rawText = req.body.text;
        } else {
            return res.status(400).json({ status: "error", message: "No input provided (file or text)." });
        }

        if (!rawText || rawText.length < 5) {
            return res.status(400).json({ status: "error", message: "Input text is too short or empty." });
        }

        // 2. AI Analysis
        const aiResult = await aiService.analyzeMedicalText(rawText);

        // 3. Guardrail: Hallucination Check
        // Heuristic: If extracted test name isn't roughly in the raw text, flag it.
        const potentialHallucinations = aiResult.tests.filter(t => 
            !rawText.toLowerCase().includes(t.name.toLowerCase().split(' ')[0])
        );

        if (potentialHallucinations.length > 2) {
             return res.status(422).json({
                 status: "unprocessed",
                 reason: "Potential hallucinated tests detected not present in input.",
                 details: potentialHallucinations
             });
        }

        // 4. Construct Final Response
        const finalResponse = {
            tests: aiResult.tests,
            summary: aiResult.summary,
            status: "ok"
        };

        // 5. Final Schema Validation
        const validation = ReportSchema.safeParse(finalResponse);
        if (!validation.success) {
            console.warn("Schema Validation Warning:", validation.error);
        }

        return res.json(finalResponse);

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
}

module.exports = { processReport };