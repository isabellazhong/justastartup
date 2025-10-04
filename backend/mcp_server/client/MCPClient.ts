import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Analytics } from "../tools/specific_tool/analytics_tool";
import { SlideDeck } from "../tools/specific_tool/slide_generation_tool";
import { SucessPlan } from "../tools/specific_tool/sucess_plan_tool";

interface BusinessProposal {
    name: string;
    idea: string; 
}

interface BusinessObjectsResult {
    analytics: Analytics;
    successPlan: SucessPlan; 
    slideDeck: SlideDeck;
    
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

    async processProject({name, idea}: BusinessProposal) : Promise<BusinessObjectsResult> {
        await this.client.connect(this.transportClient);
        const analyticsRawResult = await this.client.callTool({
            name: "analytics_tool",
            arguments: {
                name: name,
                idea: idea
            }
        }); 
        const analyticsResult: Analytics = analyticsRawResult as unknown as Analytics;

        const sucessPlanRawResult = await this.client.callTool({
            name: "sucess_plan_tool",
            arguments: {
                name: name,
                idea: idea,
                analytics: analyticsResult
            }
        }); 

        const sucessPlan: SucessPlan = sucessPlanRawResult as unknown as SucessPlan;
        // Prepare business context JSON expected by the slide text generator
        const businessContext = JSON.stringify({
            name,
            description: idea,
            statistics: analyticsResult as any,
            successPlan: sucessPlan.sucessPlan ?? sucessPlan
        });

        // Call the slide text generation tool
        const slideTextRaw = await this.client.callTool({
            name: "generate_slide_text",
            arguments: {
                businessContext: businessContext
            }
        });

        const slideText = slideTextRaw as unknown;

        // Now call the slide deck generation tool which expects slide text as input.
        // The prompt said to assume a generateslidedeck exists; use the tool name "generate_slide_deck".
        const slideDeckRaw = await this.client.callTool({
            name: "generate_slide_deck",
            arguments: {
                slideContent: slideText
            }
        });

        const slideDeck: SlideDeck = slideDeckRaw as unknown as SlideDeck;

        // Return assembled business objects
        return {
            analytics: analyticsResult,
            successPlan: sucessPlan,
            slideDeck
        } as BusinessObjectsResult;
    }


}