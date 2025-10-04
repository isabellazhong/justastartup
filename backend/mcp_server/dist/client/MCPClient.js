"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPClient = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
class MCPClient {
    client;
    transportClient;
    constructor() {
        this.client = new index_js_1.Client({
            name: "mcp-client-startup",
            version: "1.0.0"
        });
        this.transportClient = new stdio_js_1.StdioClientTransport({
            command: "node",
            args: ["../server"]
        });
    }
    async processProject({ name, idea }) {
        await this.client.connect(this.transportClient);
        const analyticsRawResult = await this.client.callTool({
            name: "analytics_tool",
            arguments: {
                name: name,
                idea: idea
            }
        });
        const analyticsResult = analyticsRawResult;
        const sucessPlanRawResult = await this.client.callTool({
            name: "sucess_plan_tool",
            arguments: {
                name: name,
                idea: idea,
                analytics: analyticsResult
            }
        });
        const sucessPlan = sucessPlanRawResult;
        // Prepare business context JSON expected by the slide text generator
        const businessContext = JSON.stringify({
            name,
            description: idea,
            statistics: analyticsResult,
            successPlan: sucessPlan.sucessPlan ?? sucessPlan
        });
        // Call the slide text generation tool
        const slideTextRaw = await this.client.callTool({
            name: "generate_slide_text",
            arguments: {
                businessContext: businessContext
            }
        });
        const slideText = slideTextRaw;
        // Now call the slide deck generation tool which expects slide text as input.
        // The prompt said to assume a generateslidedeck exists; use the tool name "generate_slide_deck".
        const slideDeckRaw = await this.client.callTool({
            name: "generate_slide_deck",
            arguments: {
                slideContent: slideText
            }
        });
        const slideDeck = slideDeckRaw;
        // Return assembled business objects
        return {
            analytics: analyticsResult,
            successPlan: sucessPlan,
            slideDeck
        };
    }
}
exports.MCPClient = MCPClient;
