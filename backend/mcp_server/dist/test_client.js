"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MCPClient_1 = require("./client/MCPClient");
async function testMCPClient() {
    console.log("Starting MCP Client test...");
    // Create a test business proposal
    const testProposal = {
        name: "EcoTech Solutions",
        idea: "A mobile app that helps users track and reduce their carbon footprint by providing personalized recommendations and connecting them with sustainable local businesses."
    };
    try {
        // Initialize the MCP client
        console.log("Initializing MCP Client...");
        const mcpClient = new MCPClient_1.MCPClient();
        // First check if connection works
        try {
            console.log("Testing connection...");
            // We're going to run the test in a way that if there are issues with the
            // server or connection, we can provide better error messages
            // Process the test project
            console.log(`Processing project: ${testProposal.name}`);
            const result = await mcpClient.processProject(testProposal);
            // Print the results
            console.log("\n=== Test Results ===\n");
            console.log("Analytics Results:");
            console.log(JSON.stringify(result.analytics, null, 2));
            console.log("\nSuccess Plan:");
            console.log(JSON.stringify(result.successPlan, null, 2));
            console.log("\nSlide Deck:");
            // Print slide deck info but not the buffer content
            const slideDeckInfo = { ...result.slideDeck };
            if (slideDeckInfo.buffer) {
                slideDeckInfo.buffer = `[Buffer of ${slideDeckInfo.buffer.length} bytes]`;
            }
            console.log(JSON.stringify(slideDeckInfo, null, 2));
            console.log("\n✅ MCP Client test completed successfully!");
        }
        catch (error) {
            console.error("❌ Error during MCP client processing:", error.message);
            // Provide more specific troubleshooting information based on the error
            if (error.message.includes("ECONNREFUSED")) {
                console.error("\nTroubleshooting tips:");
                console.error("1. Make sure the MCP server is running");
                console.error("2. Check if the correct port is being used");
                console.error("3. Verify that server.ts has been properly initialized");
            }
            else if (error.message.includes("timeout")) {
                console.error("\nTroubleshooting tips:");
                console.error("1. The request might be taking too long");
                console.error("2. Check for any infinite loops in the tool handlers");
                console.error("3. Verify that the tools are properly returning responses");
            }
            else if (error.message.includes("not found") || error.message.includes("undefined")) {
                console.error("\nTroubleshooting tips:");
                console.error("1. Ensure all tools are properly registered in tools.ts");
                console.error("2. Check that tool names match between client calls and server registration");
            }
            throw error;
        }
    }
    catch (error) {
        console.error("\n❌ MCP Client test failed!");
        process.exit(1);
    }
}
// Run the test
console.log("======================================");
console.log("       MCP CLIENT TEST RUNNER         ");
console.log("======================================");
testMCPClient()
    .then(() => {
    console.log("\n======================================");
    console.log("     TEST EXECUTION COMPLETED        ");
    console.log("======================================");
})
    .catch(err => {
    console.error("\n======================================");
    console.error("       TEST EXECUTION FAILED         ");
    console.error("======================================");
});
