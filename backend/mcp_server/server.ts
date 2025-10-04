import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {tools, MCPTool} from "./tools/tools.js"
import { 
  StdioServerTransport
} from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export const server = new McpServer({
    name: "pitch-deck-mcp-server",
    version: "1.0.0"
  }, {
    capabilities: {
      resources: {},
      tools: {}
    }
});

export class MCPServer {
    /**
     * MCP Client that will generate the business analysis and pitch deck 
     */
   
    private tools: MCPTool[] = tools;
    private server: McpServer = server
    private transport: StdioServerTransport = new StdioServerTransport();
    private connected: boolean = false; 

    public constructor(model?: string){
        try {
            this.add_tools(); 
        } catch (e) {
            console.log('Error intializing Gemini Agent', e);
        }
    }

    public add_tools(): void{
        for (let i = 0; i < this.tools.length; i++) {
            const { name, description, parameters, handler } = this.tools[i];
            this.server.tool(
                name,
                description,
                parameters ?? {}, // fallback to empty object if undefined
                handler
            );
        }
    }

    async connect() : Promise<void>{
        if (!this.connected) {
            this.server.connect(this.transport);  
            this.connected = true; 
        }
    }

    public disconnect() : void{
        if (this.connected) {
            this.server.close(); 
            this.connected = false; 
        }
    }

}

const mcpServer = new MCPServer();
// Use an IIFE to handle the async connection
(async () => {
    await mcpServer.connect();
})().catch(err => {
    console.error("Error connecting MCP server:", err);
});

