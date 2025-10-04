"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiAgent = void 0;
const genai_1 = require("@google/genai");
class GeminiAgent {
    llm_model;
    agent;
    useMockResponses = false;
    constructor(model) {
        try {
            // Check if Gemini API key is available
            const apiKey = process.env.VITE_GEMINI_KEY;
            if (apiKey) {
                this.agent = new genai_1.GoogleGenAI({ apiKey });
                this.llm_model = model || "gemini-2.5-flash";
                this.useMockResponses = false;
            }
            else {
                console.log('No Gemini API key found, using mock responses');
                this.llm_model = model || "gemini-2.5-flash";
                this.useMockResponses = true;
            }
        }
        catch (e) {
            console.log('Error initializing Gemini Agent, using mock responses', e);
            this.useMockResponses = true;
        }
    }
    async ask(query, thinking) {
        if (this.useMockResponses || !this.agent) {
            console.log('Using mock response for query:', query.substring(0, 100) + '...');
            // Create a mock response based on the query content
            let mockText = '';
            if (query.includes('market analysis')) {
                mockText = JSON.stringify({
                    potential_market: "Global market estimated at $50 billion with 15% annual growth",
                    competitors: ["Competitor A", "Competitor B", "Competitor C"],
                    market_entry_barriers: "High initial investment, established brand loyalty, regulatory hurdles",
                    demand_and_supply: "High demand with limited supply from quality providers",
                    is_valid_market: true
                });
            }
            else if (query.includes('success plan')) {
                mockText = JSON.stringify({
                    sucessPlan: "Focus on differentiation through quality and customer service while leveraging digital marketing for brand awareness",
                    productionPlan: "Start with MVP, then scale based on customer feedback and demand",
                    marketingPlan: "Target early adopters through social media and content marketing",
                    fianancePlan: "Seek seed funding of $500k, project break-even in 18 months",
                    growthPlan: "Expand to adjacent markets after establishing core offering"
                });
            }
            else if (query.includes('slide')) {
                mockText = JSON.stringify([
                    {
                        title: "Title Slide",
                        content: "EcoTech Solutions: Reducing Carbon Footprints"
                    },
                    {
                        title: "Problem",
                        content: "Individuals struggle to understand and reduce their environmental impact"
                    },
                    {
                        title: "Solution",
                        content: "Mobile app with personalized recommendations and local business connections"
                    },
                    {
                        title: "Market",
                        content: "$50B global market with 15% annual growth"
                    },
                    {
                        title: "Competitive Advantage",
                        content: "AI-powered recommendations and unique local business network"
                    }
                ]);
            }
            else {
                mockText = JSON.stringify({ response: "Mock response for: " + query.substring(0, 50) });
            }
            // Return a mock response object
            return {
                candidates: [
                    {
                        content: {
                            parts: [
                                {
                                    text: mockText
                                }
                            ]
                        }
                    }
                ]
            };
        }
        else {
            try {
                const response = await this.agent.models.generateContent({
                    model: this.llm_model,
                    contents: query,
                    config: {
                        thinkingConfig: {
                            thinkingBudget: thinking || 0
                        }
                    }
                });
                return response;
            }
            catch (error) {
                console.error("Error calling Gemini API:", error);
                // Fall back to mock response
                return {
                    candidates: [
                        {
                            content: {
                                parts: [
                                    {
                                        text: JSON.stringify({ error: "API call failed", fallback: "Using mock response" })
                                    }
                                ]
                            }
                        }
                    ]
                };
            }
        }
    }
}
exports.GeminiAgent = GeminiAgent;
exports.default = new GeminiAgent();
