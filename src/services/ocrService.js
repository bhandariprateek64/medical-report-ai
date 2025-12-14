const Tesseract = require('tesseract.js');

async function extractTextFromBuffer(imageBuffer) {
    try {
        console.log("Starting OCR processing...");
        
        // 1. Run Tesseract
        // We use the default configuration, but you can tune 'psm' if needed.
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
        
        console.log("--- RAW OCR OUTPUT (Before Cleaning) ---");
        console.log(text);
        console.log("----------------------------------------");

        // 2. CLEANING PIPELINE (Crucial for Assignment Step 1)
        // We use Regex to repair common OCR artifacts before the AI sees them.
        let cleanedText = text
            // A. Fix excessive newlines (consolidate paragraphs)
            .replace(/\n\s*\n/g, '\n')

            // B. Fix Split Numbers (The "11 200" -> "11200" issue)
            // Look for a digit, followed by a space, followed by 2 or 3 digits
            // e.g. "11 200" becomes "11200", "4 500" becomes "4500"
            .replace(/(\d+)\s+(\d{3})(?!\d)/g, '$1$2') 
            .replace(/(\d+)\s+(\d{2})(?!\d)/g, '$1$2') 

            // C. Fix Split Units (e.g. "g / dL" -> "g/dL")
            .replace(/g\s*\/\s*dL/gi, 'g/dL')
            .replace(/mg\s*\/\s*dL/gi, 'mg/dL')
            .replace(/\/ \s*uL/gi, '/uL')
            .replace(/%\s*/g, '%') // Fix "10 %" -> "10%"

            // D. Remove common noise characters if they appear alone
            .replace(/^\s*[\.,-]\s*$/gm, '')

            .trim();

        console.log("--- CLEANED TEXT (Sent to AI) ---");
        console.log(cleanedText);
        console.log("---------------------------------");

        return cleanedText;

    } catch (error) {
        console.error("OCR Service Error:", error);
        throw new Error("Failed to extract text from image.");
    }
}

module.exports = { extractTextFromBuffer };