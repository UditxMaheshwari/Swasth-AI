// Test script for Gemini API integration
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API Integration...\n');
  
  // Your API key
  const apiKey = 'AIzaSyBd0JzFZk_j-QknnMzJP0wLrEMyPyPRZh4';
  
  if (!apiKey) {
    console.error('❌ No API key found');
    return;
  }
  
  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      systemInstruction: 'You are a helpful health assistant. Provide accurate, evidence-based health information.'
    });
    
    console.log('✅ Gemini API initialized successfully');
    
    // Test basic health query
    console.log('🔍 Testing health query...');
    const prompt = "What are 3 simple tips for better sleep hygiene?";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('\n📝 Test Query:', prompt);
    console.log('\n🤖 Gemini Response:');
    console.log('─'.repeat(50));
    console.log(text);
    console.log('─'.repeat(50));
    
    console.log('\n✅ Gemini API test completed successfully!');
    console.log('\n🚀 Your SwasthAI app is ready to use Gemini Flash 2.0');
    
  } catch (error) {
    console.error('❌ Error testing Gemini API:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n💡 Tip: Check if your API key is valid and has the necessary permissions');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\n💡 Tip: Make sure the Gemini API is enabled for your project');
    } else {
      console.log('\n💡 Tip: Check your internet connection and try again');
    }
  }
}

// Run the test
testGeminiAPI().catch(console.error);
