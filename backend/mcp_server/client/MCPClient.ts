import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

interface BusinessProposal {
    name: string;
    idea: string; 
}

interface BusinessObjectsResult {
}

export class MCPClient {
    public client: Client; 
    public transportClient: StdioClientTransport;

    public constructor(){ 
        this.client = new Client({
            name: "mcp-client-startup",
            version: "1.0.0"
        });
        this.transportClient = new StdioClientTransport({
            command: "node",
            args: ["../server"]
        });

    }

    async processProject(project: BusinessProposal) : Promise<BusinessObjectsResult> {
        await this.client.connect(this.transportClient);
        
        
    }


}