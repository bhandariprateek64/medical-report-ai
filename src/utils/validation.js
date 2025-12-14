// Data validation schemas using Zod
// Ensures API responses follow the expected structure and data types

const { z } = require('zod');

// Define the structure of a single medical test result
// All fields are validated to ensure data integrity
const TestSchema = z.object({
    // Test name (e.g., "Hemoglobin", "WBC")
    name: z.string(),
    // Numeric value of the test
    value: z.number(),
    // Unit of measurement (e.g., "g/dL", "/uL")
    unit: z.string(),
    // Status indicating if value is abnormal
    status: z.enum(["low", "normal", "high", "critical", "unknown"]),
    // Reference range with lower and upper bounds (optional)
    ref_range: z.object({
        low: z.number().optional(),
        high: z.number().optional()
    }).optional()
});

// Define the structure of the complete API response
// Validates the final output sent to clients
const ReportSchema = z.object({
    // Array of extracted medical tests
    tests: z.array(TestSchema),
    // Patient-friendly summary of findings
    summary: z.string(),
    // Processing status
    status: z.enum(["ok", "unprocessed"])
});

module.exports = { ReportSchema };