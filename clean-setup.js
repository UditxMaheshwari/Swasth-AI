#!/usr/bin/env node

// Gemini API Setup Helper
// Run this script to set up your Gemini API key

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🤖 SwasthAI - Gemini API Setup Helper');
console.log('=====================================\n');

// Function to update environment file
function updateEnvFile(apiKey) {
  const envPath = path.join(__dirname, '.env.local');
  
  try {
    // Create default environment content
    const envContent = `# Environment Configuration
NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_url_here'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here'}
GEMINI_API_KEY=${apiKey}
`;

    // Write to .env.local
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Successfully updated .env.local with your API key');
    
    // Create test endpoint directory if it doesn't exist
    const testDir = path.join(__dirname, 'app', 'api', 'gemini-test');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Create a simple test endpoint
    const testEndpoint = `import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    return NextResponse.json({ 
      success: true, 
      message: 'API key is configured correctly',
      hasApiKey: !!apiKey,
      keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'None'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Test endpoint error: ' + error.message },
      { status: 500 }
    );
  }
}`;
    
    fs.writeFileSync(path.join(testDir, 'route.js'), testEndpoint);
    
    console.log('✅ Test endpoint created at /api/gemini-test');
    
  } catch (error) {
    console.error('❌ Error setting up environment:', error.message);
  }
}

// Main execution
console.log('📋 Steps to get your Gemini API key:');
console.log('1. Visit: https://aistudio.google.com/app/apikey');
console.log('2. Sign in with your Google account');
console.log('3. Click "Create API Key"');
console.log('4. Copy the API key (starts with "AIzaSy...")\n');

rl.question('🔑 Please paste your Gemini API key here: ', (apiKey) => {
  apiKey = apiKey.trim();
  if (!apiKey || !apiKey.startsWith('AIzaSy')) {
    console.log('❌ Invalid API key. Please make sure you copied the correct key.');
    rl.close();
    return;
  }

  updateEnvFile(apiKey);
  rl.close();
});

rl.on('close', () => {
  console.log('\n✨ Setup complete! Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:3000/test-ai');
  console.log('3. Click "Test AI Connection" to verify\n');
  process.exit(0);
});
