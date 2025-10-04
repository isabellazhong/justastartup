import {Server} from '@modelcontextprotocol/sdk/server/index.js';
import { 
  StdioServerTransport 
} from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export const server = new Server({
    name: "pitch-deck-mcp-server",
    version: "1.0.0"
  }, {
    capabilities: {
      resources: {},
      tools: {}
    }
});