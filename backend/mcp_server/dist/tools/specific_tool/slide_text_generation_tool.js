"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const prompts_ts_1 = require("../../prompts.ts");
const gemini_ts_1 = require("../../llm/gemini.ts");
/**
 * Parse the pitch deck context from JSON string summarized
 */
const contextSchema = zod_1.default.object({
    name: zod_1.default.string(),
    description: zod_1.default.string(),
    // ie. {description of analytic: analytic}
    statistics: zod_1.default.record(zod_1.default.string(), zod_1.default.any()),
    successPlan: zod_1.default.string()
});
const slide_text_tool = {
    name: "generate_slide_text",
    description: "Generates the pitch deck information per slide based on business proposal details.",
    parameters: {
        type: "object",
        properties: {
            businessContext: {
                type: "string",
                description: "JSON string containing the business proposal details (name, description, statistics, successPlan)"
            }
        },
        required: ["businessContext"]
    },
    handler: async (params) => {
        try {
            const parsedContext = JSON.parse(params.businessContext);
            const validatedContext = contextSchema.parse(parsedContext);
            // Create slide context object
            const slideContext = {
                name: validatedContext.name,
                description: validatedContext.description,
                statstics: new Map(Object.entries(validatedContext.statistics)),
                sucessPlan: validatedContext.successPlan
            };
            const prompt = (0, prompts_ts_1.slide_text_prompt)(slideContext);
            // Get response from Gemini
            const geminiAgent = new gemini_ts_1.GeminiAgent();
            const response = await geminiAgent.ask(prompt);
            if (!response) {
                throw new Error("Failed to get response from Gemini");
            }
            // Extract and parse the JSON from the response
            const textContent = response.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!textContent) {
                throw new Error("No text content in Gemini response");
            }
            // Parse the JSON response (assuming Gemini returns valid JSON)
            return JSON.parse(textContent);
        }
        catch (error) {
            console.error("Error generating slide text:", error);
            return {
                error: "Failed to generate slide text",
                message: error
            };
        }
    }
};
exports.default = slide_text_tool;
