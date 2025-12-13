const { z } = require('zod');

// Schema for a single medical test result
const TestSchema = z.object({
    name: z.string(),
    value: z.number(),
    unit: z.string(),
    status: z.enum(["low", "normal", "high", "critical", "unknown"]),
    ref_range: z.object({
        low: z.number().optional(),
        high: z.number().optional()
    }).optional()
});

// Final Output Schema for the API response
const ReportSchema = z.object({
    tests: z.array(TestSchema),
    summary: z.string(),
    status: z.enum(["ok", "unprocessed"])
});

module.exports = { ReportSchema };