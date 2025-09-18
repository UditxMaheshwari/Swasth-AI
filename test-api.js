#!/usr/bin/env node

// Simple test script for SwasthAI API routes
const baseUrl = process.env.TEST_URL || 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    console.log(`\n🧪 Testing ${method} ${endpoint}...`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ ${endpoint} - Status: ${response.status}`);
      console.log('Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log(`❌ ${endpoint} - Network Error:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting SwasthAI API Tests...');
  console.log(`🔗 Base URL: ${baseUrl}`);
  
  // Test health check
  await testEndpoint('/api/health');
  
  // Test health assistant (requires API keys)
  await testEndpoint('/api/ask', 'POST', {
    question: 'What are the symptoms of common cold?'
  });
  
  // Test doctor discovery (requires API keys)
  await testEndpoint('/api/doctors', 'POST', {
    condition: 'fever',
    location: 'Mumbai'
  });
  
  // Test health centers (requires Google Maps API key)
  await testEndpoint('/api/health-centers', 'POST', {
    latitude: 19.0760,
    longitude: 72.8777
  });
  
  // Test news (requires API keys)
  await testEndpoint('/api/news', 'POST', {
    language: 'english'
  });
  
  console.log('\n🎉 API tests completed!');
  console.log('\n📝 Note: Some tests may fail if API keys are not configured.');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or you can install node-fetch');
  console.log('Run: npm install node-fetch');
  process.exit(1);
}

runTests().catch(console.error);
