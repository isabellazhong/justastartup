import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";

export class GeminiAgent {
    private llm_model!: string;
    private agent?: GoogleGenAI;
    private initialized: boolean = false;

    public constructor(model?: string) {
        this.llm_model = model || "gemini-2.5-flash";
        this.initializeAgent().catch(e => {
            console.log('Error initializing Gemini Agent, using mock responses', e);
        });
    }

    private async initializeAgent(): Promise<void> {
        try {
            // Check if Gemini API key is available
            const apiKey = process.env.VITE_GEMINI_KEY;
            
            if (apiKey) {
                // Create a new GoogleGenAI instance
                this.agent = new GoogleGenAI({apiKey});
                this.initialized = true;
            }
        } catch (e) {
            console.log('Error initializing Gemini Agent, using mock responses', e);
            this.initialized = false;
        }
    }

    async ask(query: string, thinking?: number) : Promise<GenerateContentResponse> {
        // Wait for agent initialization if needed
        if (!this.initialized) {
            await this.initializeAgent();
        }

        // Check if agent is available
        if (this.agent && this.initialized) {
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
            }
        }
    }
    
}

export default new GeminiAgent();