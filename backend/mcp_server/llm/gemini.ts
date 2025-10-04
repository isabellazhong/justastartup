import { GenerateContentResponse, GoogleGenAI } from "@google/genai"; 

export class GeminiAgent {
    private llm_model!: string;
    private agent!: GoogleGenAI; 
    public static geminiAgent: GeminiAgent; 

    public constructor(model?: string){
        try {
            this.agent = new GoogleGenAI({apiKey: process.env.VITE_GEMINI_KEY}); 
            this.llm_model = model || "gemini-2.5-flash";
        } catch (e) {
            console.log('Error intializing Gemini Agent', e);
        }
    } 

    async ask(query: string, thinking?: number) : Promise<GenerateContentResponse>{
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
    }
}

const gemini_agent = GeminiAgent.geminiAgent; 
export default gemini_agent; 