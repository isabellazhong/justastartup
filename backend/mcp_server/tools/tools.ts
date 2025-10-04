import { z } from 'zod';
import { MCPClient } from '../client/MCPClient.ts';
import * as slide_text_generation_tool from "./specific_tool/slide_text_generation_tool.ts"

/**
 * MCP Tool definition with proper TypeScript typing
 */
export interface MCPTool {
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
    slide_text_generation_tool.default
]

export default tools;