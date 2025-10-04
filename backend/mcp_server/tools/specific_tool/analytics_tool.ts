import { MCPTool } from "../tools";

export interface Analytics {
    potential_market: string,
    competitors: string[],
    market_entry_barriers: string,
    demand_and_supply: string,
    is_valid_market: boolean,
}

const tool: MCPTool = {
    name: "analytics_tool",
    description: `Tool that generates a analysis of the potential market, 
    competitors, market entry barriers, demand and supply and a judgement
     of whether the product is viable in the market based on the following 
     product idea`,
    parameters: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "JSON string of the name of the proposed business plan"
            },
            idea: {
                name: {
                    type: "string",
                    description: "The general idea of the proposed business plan"
                }
            }
        }, 
        required: ["name", "idea"]
    },
    handler: async (params) => {
        
    }
}