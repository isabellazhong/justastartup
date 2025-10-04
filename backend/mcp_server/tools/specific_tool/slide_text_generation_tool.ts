import { MCPTool } from "../tools";
import z from "zod";
import { slide_text_prompt, SlideContext } from '../../prompts.ts';
import { MCPClient } from "../../client/MCPClient.ts";

/**
 * Parse the pitch deck context from JSON string summarized
 */
const contextSchema = z.object({
    name: z.string(),
    description: z.string(),
    // ie. {description of analytic: analytic}
    statistics: z.record(z.string(), z.any()),
    successPlan: z.string()
});

const tool: MCPTool = {
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
                const slideContext: SlideContext = {
                    name: validatedContext.name,
                    description: validatedContext.description,
                    statstics: new Map(Object.entries(validatedContext.statistics)),
                    sucessPlan: validatedContext.successPlan
                };
                
                const prompt = slide_text_prompt(slideContext);
                
                // Get response from Gemini
                const geminiAgent = new MCPClient();
                const response = await geminiAgent.getResponse(prompt);
                
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
            } catch (error) {
                console.error("Error generating slide text:", error);
                return {
                    error: "Failed to generate slide text",
                    message: error
                };
            }
        }
    }

export default tool;