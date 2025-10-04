import { z } from 'zod';

/**
 * MCP Tool definition with proper TypeScript typing
 */
interface MCPTool {
    name: string;
    description: string;
    parameters?: {
        type: 'object';
        properties: Record<string, any>;
        required?: string[];
    };
    handler: (params: any) => Promise<any>;
}

/**
 * The array of tools for the MCP server
 */
const tools: MCPTool[] = [
    {
        name: "generate_slide_text",
        description: "Generates the pitch deck information per slide.",
        parameters: {
            type: "object",
            properties: {
                context: {
                    type: "string",
                    description: "Pitch context"
                },
                num_slides: {
                    type: "int",
                    description: "The number of slides in the pitch deck"
                }
            },
            required: ["query"]
        },
        handler: async (params) => {
            const { query, num_slides } = params;
            
        }
    }
]

export default tools;