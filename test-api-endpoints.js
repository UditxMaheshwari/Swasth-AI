// Test script for SwasthAI API endpoints with Gemini integration
const BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`\n🔍 Testing ${method} ${endpoint}`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log('✅ Success');
      if (endpoint.includes('/health')) {
        console.log(`Services configured: Gemini=${data.services?.gemini?.configured}, aiXplain=${data.services?.aixplain?.configured}`);
      } else if (data.response) {
        console.log(`Response length: ${data.response.length} chars`);
        console.log(`Source: ${data.source || 'unknown'}`);
        console.log(`Summary: ${data.summary?.substring(0, 100)}...`);
      }
    } else {
      console.log('❌ Error:', data.error || 'Unknown error');
    }
    
    return { success: response.ok, data };
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing SwasthAI API Endpoints with Gemini Integration\n');
  console.log('=' .repeat(60));
  
  // Test health endpoint
  await testEndpoint('/api/health');
  
  // Test Gemini service status
  await testEndpoint('/api/gemini');
  
  // Test primary ask endpoint with Gemini
  await testEndpoint('/api/ask', 'POST', {
    question: 'What are the benefits of drinking water?',
    useGemini: true
  });
  
  // Test direct Gemini endpoint - general query
  await testEndpoint('/api/gemini', 'POST', {
    question: 'How much sleep do adults need?',
    type: 'general'
  });
  
  // Test Gemini symptom analysis
  await testEndpoint('/api/gemini', 'POST', {
    question: ['headache', 'fatigue'],
    type: 'symptoms',
    context: 'Experiencing these symptoms for 2 days'
  });
  
  // Test Gemini health tips
  await testEndpoint('/api/gemini', 'POST', {
    type: 'health-tips',
    userProfile: {
      age: 30,
      lifestyle: 'active'
    }
  });
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎉 API endpoint testing completed!');
  console.log('\n💡 Next steps:');
  console.log('1. Set GEMINI_API_KEY in your .env.local file');
  console.log('2. Add the same key to Vercel environment variables');
  console.log('3. Deploy to Vercel with: vercel --prod');
}

// Run tests
runTests().catch(console.error);
