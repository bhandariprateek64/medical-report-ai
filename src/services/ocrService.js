// src/services/ocrService.js
// This service handles Optical Character Recognition (OCR) on medical report images
// It converts image data to text and applies cleaning/normalization rules

const Tesseract = require('tesseract.js');

// Extract text from an image buffer (PDF/JPG/PNG etc)
// Applies OCR and cleans up common scanning artifacts
async function extractTextFromBuffer(imageBuffer) {
    try {
        // Run Tesseract OCR on the image buffer to extract text
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');

        // Apply cleaning rules to fix common OCR mistakes
        let cleanedText = text
            // Remove extra blank lines that OCR sometimes creates
            .replace(/\n\s*\n/g, '\n')
            // Fix spaces in large numbers (e.g., "11 200" becomes "11200")
            .replace(/(\d+)\s+(\d{3})(?!\d)/g, '$1$2')
            // Fix 2-digit number splits that OCR sometimes makes
            .replace(/(\d+)\s+(\d{2})(?!\d)/g, '$1$2')
            // Clean up decimal points with surrounding spaces (e.g., "14 . 5" -> "14.5")
            .replace(/(\d+)\s*\.\s*(\d+)/g, '$1.$2')
            // Normalize unit spacing: "g / dL" becomes "g/dL"
            .replace(/g\s*\/\s*dL/gi, 'g/dL')
            // Normalize mg/dL units
            .replace(/mg\s*\/\s*dL/gi, 'mg/dL')
            // Normalize /uL units (blood cell counts)
            .replace(/\/ \s*uL/gi, '/uL')
            // Fix percentage sign spacing
            .replace(/%\s*/g, '%')
            // Remove stray punctuation that appears on its own lines
            .replace(/^\s*[\.,-]\s*$/gm, '')
            // Trim whitespace from beginning and end
            .trim();

        return cleanedText;

    } catch (error) {
        // Log OCR errors for debugging purposes
        console.error("OCR Service Error:", error);
        // Re-throw with a user-friendly message
        throw new Error("Failed to extract text from image.");
    }
}

module.exports = { extractTextFromBuffer };