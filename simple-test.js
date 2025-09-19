const fs = require('fs');
require('dotenv').config();

// Read .env.local file directly
const envPath = require('path').resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse the API key
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=([^\n]+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1] : null;

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

console.log('🔑 Found GEMINI_API_KEY:', apiKey.substring(0, 10) + '...');

// Simple test - just verify the key format
if (apiKey.startsWith('AIza') && apiKey.length > 30) {
  console.log('✅ API key format looks good');
  console.log('\nTo test the API, run:');
  console.log('1. Start the Next.js server: npm run dev');
  console.log('2. Visit: http://localhost:3000/test-ai');
} else {
  console.error('❌ Invalid API key format. It should start with "AIza" and be longer than 30 characters');
  process.exit(1);
}
