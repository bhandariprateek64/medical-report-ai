// src/services/aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { OPENAI_API_KEY } = require('../config/env'); // Ensure this matches your env config

const genAI = new GoogleGenerativeAI(OPENAI_API_KEY);

async function analyzeMedicalText(rawText) {
   const prompt = `
    You are a medical AI assistant. Your task is to extract, normalize, and simplify medical test results.
    
    RULES:
    1. EXTRACT: Identify test names, values, units, and ranges. 
       - IGNORE metadata like "Ref No", "Patient ID", "Date", "Dr Name".
       - ONLY extract actual medical lab tests.
    
    2. NORMALIZE & FIX OCR:
       - Fix split numbers: Treat "11 200" or "11, 200" as 11200. 
       - Fix broken units: "00", "91" are NOT units. Look for "g/dL", "/uL", etc.
       - If a value looks like "112" but the unit is "00", it is likely "11200".
    
    3. STATUS & RANGES:
       - Extract provided reference ranges.
       - If NO range is provided in the text, use STANDARD MEDICAL RANGES for the test to determine status (Low/High/Normal) and fill the "ref_range" field.
    
    4. EXPLAIN: Provide a list of short explanations for any abnormal results.
    
    OUTPUT SCHEMA (JSON):
    {
      "tests": [
        {
          "name": "String (Standardized Name)", 
          "value": Number, 
          "unit": "String", 
          "status": "String (Low/High/Normal)", 
          "ref_range": {"low": Number, "high": Number}
        }
      ],
      "summary": "String",
      "explanations": ["String"],
      "normalization_confidence": Number
    }

    INPUT TEXT:
    ${rawText}
    `;

    try {
        // FIXED: Use correct model name and enforce JSON
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // No regex needed with responseMimeType
        return JSON.parse(response.text());

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            "tests": [],
            "summary": "Error processing report.",
            "explanations": [],
            "normalization_confidence": 0,
            "status": "error"
        };
    }
}

module.exports = { analyzeMedicalText };