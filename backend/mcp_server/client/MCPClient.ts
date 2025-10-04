import { GenerateContentResponse, GoogleGenAI } from "@google/genai"; 

export class MCPClient {
    /**
     * LLM Agent 
     */
    public static client: GoogleGenAI;
    public model: string = "gemini-2.5-flash";

    public constructor(model?: string){
        try {
            MCPClient.client = new GoogleGenAI({apiKey: process.env.VITE_GEMINI_KEY}); 
            if (model) {
                this.model = model;
            }
        } catch (e) {
            console.log('Error intializing Gemini Agent', e);
        }
    }

    async getResponse(query: string, thinking?: number): Promise<GenerateContentResponse | undefined> {
        try {
            const response: GenerateContentResponse = await MCPClient.client.models.generateContent(
                {
                    model: this.model,
                    contents: query,
                    config: {
                        thinkingConfig: {
                            thinkingBudget: thinking || 0
                        }
                    }
                }
            );
            return response;
        } catch (e) {
            console.log("Error while getting response from Gemini", e);
            return undefined;
        }
    }


}   

