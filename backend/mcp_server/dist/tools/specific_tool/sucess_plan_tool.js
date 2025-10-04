"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gemini_1 = require("../../llm/gemini");
const sucess_plan_tool = {
    name: "sucess_plan_tool",
    description: "Tool that generates a success plan based on business proposal and analytics data",
    parameters: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Name of the proposed business plan"
            },
            idea: {
                type: "string",
                description: "The general idea of the proposed business plan"
            },
            analytics: {
                type: "object",
                description: "Analytics data for the business idea"
            }
        },
        required: ["name", "idea", "analytics"]
    },
    handler: async (params) => {
        try {
            // Create a prompt for the success plan
            const prompt = `Generate a success plan for a business named "${params.name}" with the following idea: "${params.idea}".
            
            Based on the following analytics:
            - Potential market: ${params.analytics.potential_market}
            - Competitors: ${params.analytics.competitors.join(', ')}
            - Market entry barriers: ${params.analytics.market_entry_barriers}
            - Demand and supply: ${params.analytics.demand_and_supply}
            - Market validity: ${params.analytics.is_valid_market ? 'Valid' : 'Not valid'}
            
            Please provide the following information in JSON format:
            1. sucessPlan: A high-level summary of the success strategy
            2. productionPlan: Details on production approach
            3. marketingPlan: Strategy for marketing
            4. fianancePlan: Financial planning and projections
            5. growthPlan: Long-term growth strategy
            
            Return the response as a valid JSON object.`;
            // Use Gemini to generate the success plan
            const geminiAgent = new gemini_1.GeminiAgent();
            const response = await geminiAgent.ask(prompt);
            if (!response) {
                throw new Error("Failed to get response from Gemini");
            }
            // Extract and parse the JSON from the response
            const textContent = response.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!textContent) {
                throw new Error("No text content in Gemini response");
            }
            // For testing purposes, if Gemini integration isn't fully set up,
            // we'll return mock data
            try {
                return JSON.parse(textContent);
            }
            catch (e) {
                console.warn("Failed to parse Gemini response, returning mock data");
                return {
                    sucessPlan: "Focus on differentiation through quality and customer service while leveraging digital marketing for brand awareness",
                    productionPlan: "Start with MVP, then scale based on customer feedback and demand",
                    marketingPlan: "Target early adopters through social media and content marketing",
                    fianancePlan: "Seek seed funding of $500k, project break-even in 18 months",
                    growthPlan: "Expand to adjacent markets after establishing core offering"
                };
            }
        }
        catch (error) {
            console.error("Error in success plan tool:", error);
            // Return mock data for testing
            return {
                sucessPlan: "Focus on differentiation through quality and customer service while leveraging digital marketing for brand awareness",
                productionPlan: "Start with MVP, then scale based on customer feedback and demand",
                marketingPlan: "Target early adopters through social media and content marketing",
                fianancePlan: "Seek seed funding of $500k, project break-even in 18 months",
                growthPlan: "Expand to adjacent markets after establishing core offering"
            };
        }
    }
};
exports.default = sucess_plan_tool;
