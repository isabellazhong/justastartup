"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPServer = exports.server = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const tools = __importStar(require("./tools/tools"));
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
exports.server = new mcp_js_1.McpServer({
    name: "pitch-deck-mcp-server",
    version: "1.0.0"
}, {
    capabilities: {
        resources: {},
        tools: {}
    }
});
class MCPServer {
    /**
     * MCP Client that will generate the business analysis and pitch deck
     */
    tools = tools.default;
    server = exports.server;
    transport = new stdio_js_1.StdioServerTransport();
    connected = false;
    constructor(model) {
        try {
            this.add_tools();
        }
        catch (e) {
            console.log('Error intializing Gemini Agent', e);
        }
    }
    add_tools() {
        for (let i = 0; i < this.tools.length; i++) {
            const { name, description, parameters, handler } = this.tools[i];
            this.server.tool(name, description, parameters ?? {}, // fallback to empty object if undefined
            handler);
        }
    }
    async connect() {
        if (!this.connected) {
            this.server.connect(this.transport);
            this.connected = true;
        }
    }
    disconnect() {
        if (this.connected) {
            this.server.close();
            this.connected = false;
        }
    }
}
exports.MCPServer = MCPServer;
const mcpServer = new MCPServer();
await mcpServer.connect();
