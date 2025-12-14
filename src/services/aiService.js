// src/services/aiService.js
// This service handles AI-powered medical text analysis using Google's Generative AI
// It extracts lab test results, normalizes values, and provides patient-friendly summaries

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { OPENAI_API_KEY } = require('../config/env');

// Initialize the Generative AI client with our API key
const genAI = new GoogleGenerativeAI(OPENAI_API_KEY);

// Main function to analyze medical text and extract structured data
// Takes raw medical report text as input and returns organized test data
async function analyzeMedicalText(rawText) {
   // Comprehensive prompt that instructs the AI how to process medical reports
   // Includes rules for extraction, normalization, OCR fixing, and safety checks
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
    5. GUARDRAIL: Set "hallucination_check" to true ONLY if no medical tests are found or the input is unintelligible.
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
      "hallucination_check": false
    }

    INPUT TEXT:
    ${rawText}
    `;

    try {
        // Use the latest Gemini model with JSON response format enforcement
        // This ensures the AI returns properly formatted JSON we can parse reliably
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Send prompt to AI and get response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // Parse and return the JSON response
        // With responseMimeType set to JSON, we don't need regex cleanup
        return JSON.parse(response.text());

    } catch (error) {
        // Log error details for debugging
        console.error("Gemini API Error:", error);
        // Return empty results on error (safer than hallucinated data)
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