import { GeminiAgent } from './gemini_agent/gemini'; 
const dotenv = require('dotenv');
dotenv.config();

async function testGeminiResponseStructure() {
  const agent = new GeminiAgent();
  const response = await agent.getStringResponse('Hello, what is your name?');
  console.log('Response structure:', JSON.stringify(response, null, 2));
  console.log('Available methods and properties:', Object.keys(response || {}));
  
  if (response && response.candidates && response.candidates.length > 0) {
    const candidate = response.candidates[0];
    console.log('First candidate content:', candidate.content);
  }
}

testGeminiResponseStructure().catch(console.error);
