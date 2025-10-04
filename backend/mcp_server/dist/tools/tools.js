"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slide_text_generation_tool_1 = __importDefault(require("./specific_tool/slide_text_generation_tool"));
const analytics_tool_1 = __importDefault(require("./specific_tool/analytics_tool"));
const sucess_plan_tool_1 = __importDefault(require("./specific_tool/sucess_plan_tool"));
const slide_generation_tool_1 = __importDefault(require("./specific_tool/slide_generation_tool"));
/**
 * The array of tools for the MCP server
 */
const tools = [
    slide_text_generation_tool_1.default,
    analytics_tool_1.default,
    sucess_plan_tool_1.default,
    slide_generation_tool_1.default
];
exports.default = tools;
