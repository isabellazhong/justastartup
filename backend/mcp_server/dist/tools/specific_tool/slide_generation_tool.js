"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate_slide_deck_tool = {
    name: "generate_slide_deck",
    description: "Generates a slide deck based on slide content",
    parameters: {
        type: "object",
        properties: {
            slideContent: {
                type: "object",
                description: "The slide content to use for generating the deck"
            }
        },
        required: ["slideContent"]
    },
    handler: async (params) => {
        try {
            // In a real implementation, this would use a library to generate
            // a PowerPoint or PDF file from the slide content
            console.log("Generating slide deck with content:", JSON.stringify(params.slideContent, null, 2));
            // Create a mock buffer for testing
            const mockBuffer = Buffer.from('Mock slide deck content');
            // Return a mock slide deck for testing
            return {
                buffer: mockBuffer,
                filename: "pitch_deck.pdf",
                format: "application/pdf",
                slides: Array.isArray(params.slideContent) ? params.slideContent : [params.slideContent]
            };
        }
        catch (error) {
            console.error("Error generating slide deck:", error);
            // Return a minimal mock response for testing
            return {
                buffer: Buffer.from('Error generating slide deck'),
                filename: "error_deck.pdf",
                format: "application/pdf",
                slides: []
            };
        }
    }
};
exports.default = generate_slide_deck_tool;
