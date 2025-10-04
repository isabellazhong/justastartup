import { GenerateContentResponse, GoogleGenAI } from "@google/genai"; 

export class GeminiAgent {
    private llm_model!: string;
    private agent?: GoogleGenAI; 

    public constructor(model?: string) {
        try {
            // Check if Gemini API key is available
            const apiKey = process.env.VITE_GEMINI_KEY;
            
            if (apiKey) {
                this.agent = new GoogleGenAI({apiKey}); 
                this.llm_model = model || "gemini-2.5-flash";

            } 
        } catch (e) {
            console.log('Error initializing Gemini Agent, using mock responses', e);
        }
    } 

    async ask(query: string, thinking?: number) : Promise<GenerateContentResponse> {
        try {
            const response: GenerateContentResponse = await this.agent.models.generateContent(
                {
                    model: this.llm_model,
                    contents: query,
                    config: {
                        thinkingConfig: {
                            thinkingBudget: thinking || 0
                        }
                    }
                }
            );
            return response;
        } catch (error) {
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
            } as unknown as GenerateContentResponse;
        }
    }
}

export default new GeminiAgent();