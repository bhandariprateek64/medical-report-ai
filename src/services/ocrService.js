const Tesseract = require('tesseract.js');

async function extractTextFromBuffer(imageBuffer) {
    try {
        console.log("Starting OCR processing...");
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
        
        // Clean up common OCR noise (excessive newlines/spaces)
        const cleanedText = text.replace(/\n\s*\n/g, '\n').trim();
        return cleanedText;
    } catch (error) {
        console.error("OCR Service Error:", error);
        throw new Error("Failed to extract text from image.");
    }
}

module.exports = { extractTextFromBuffer };