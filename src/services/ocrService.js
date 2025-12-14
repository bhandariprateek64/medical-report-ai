// src/services/ocrService.js
const Tesseract = require('tesseract.js');

async function extractTextFromBuffer(imageBuffer) {
    try {
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');

        let cleanedText = text
            .replace(/\n\s*\n/g, '\n')
            .replace(/(\d+)\s+(\d{3})(?!\d)/g, '$1$2')
            .replace(/(\d+)\s+(\d{2})(?!\d)/g, '$1$2')
            .replace(/(\d+)\s*\.\s*(\d+)/g, '$1.$2')
            .replace(/g\s*\/\s*dL/gi, 'g/dL')
            .replace(/mg\s*\/\s*dL/gi, 'mg/dL')
            .replace(/\/ \s*uL/gi, '/uL')
            .replace(/%\s*/g, '%') 
            .replace(/^\s*[\.,-]\s*$/gm, '')
            .trim();

        return cleanedText;

    } catch (error) {
        console.error("OCR Service Error:", error);
        throw new Error("Failed to extract text from image.");
    }
}

module.exports = { extractTextFromBuffer };