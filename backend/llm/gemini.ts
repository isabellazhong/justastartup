import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";

export class GeminiAgent {
    private llm_model: string;
    private agent?: GoogleGenAI;
    private initialized: boolean = false;
    private initializing?: Promise<void>;

    // singleton instance (private)
    private static _instance?: GeminiAgent;

    // private constructor prevents external instantiation
    private constructor(model?: string) {
        this.llm_model = model || "gemini-2.5-flash";
        // lazy initialization: don't call initializeAgent here
    }

    // Accessor for the singleton instance
    public static getInstance(model?: string): GeminiAgent {
        if (!GeminiAgent._instance) {
            GeminiAgent._instance = new GeminiAgent(model);
        } else if (model) {
            // allow changing model on existing instance if caller provides one
            GeminiAgent._instance.llm_model = model;
        }
        return GeminiAgent._instance;
    }

    // Initialize the underlying GoogleGenAI client lazily and once
    private async initializeAgent(): Promise<void> {
        if (this.initialized) return;
        if (this.initializing) return this.initializing;

        this.initializing = (async () => {
            try {
                const apiKey = process.env.VITE_GEMINI_KEY || process.env.GEMINI_API_KEY;
                if (apiKey) {
                    this.agent = new GoogleGenAI({ apiKey });
                    this.initialized = true;
                } else {
                    this.initialized = false;
                }
            } catch (e) {
                console.error('Error initializing Gemini Agent:', e);
                this.initialized = false;
            } finally {
                // clear the initializing promise so future calls can retry
                this.initializing = undefined;
            }
        })();

        return this.initializing;
    }

    // Ask the LLM for a response. Returns undefined when the agent isn't available
    async ask(query: string, thinking?: number): Promise<string | undefined> {
        await this.initializeAgent();

        if (!this.initialized || !this.agent) {
            console.warn('Gemini agent not initialized; returning undefined.');
            return undefined;
        }

        try {
            const response: GenerateContentResponse = await this.agent.models.generateContent({
                model: this.llm_model,
                contents: query,
                config: {
                    thinkingConfig: {
                        thinkingBudget: thinking || 0,
                    },
                },
            });
            return response.text;
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            return undefined;
        }
    }
}

// default export is the shared singleton instance
const gemini = GeminiAgent.getInstance();
export default gemini;