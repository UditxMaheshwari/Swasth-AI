#!/usr/bin/env node

// Gemini API Setup Helper
// Run this script to set up your Gemini API key

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🤖 SwasthAI - Gemini API Setup Helper");
console.log("=====================================\n");

// Function to update environment file
function updateEnvFile(apiKey) {
  const envPath = path.join(__dirname, ".env.local");

  try {
    let envContent = "";

    // If .env.local already exists, read it
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
    }

    const lines = envContent.split("\n");
    let updatedLines = [];
    let foundGeminiKey = false;
    let foundPublicGeminiKey = false;

    for (let line of lines) {
      if (line.startsWith("GEMINI_API_KEY=")) {
        updatedLines.push(`GEMINI_API_KEY=${apiKey}`);
        foundGeminiKey = true;
      } else if (line.startsWith("NEXT_PUBLIC_GEMINI_API_KEY=")) {
        updatedLines.push(`NEXT_PUBLIC_GEMINI_API_KEY=${apiKey}`);
        foundPublicGeminiKey = true;
      } else {
        updatedLines.push(line);
      }
    }

    // Add keys if missing
    if (!foundGeminiKey) updatedLines.push(`GEMINI_API_KEY=${apiKey}`);
    if (!foundPublicGeminiKey)
      updatedLines.push(`NEXT_PUBLIC_GEMINI_API_KEY=${apiKey}`);

    const updatedContent = updatedLines.join("\n");

    fs.writeFileSync(envPath, updatedContent);
    console.log("✅ Successfully updated .env.local with your Gemini API key!");
  } catch (error) {
    console.log("❌ Error writing to .env.local:", error.message);
    console.log("\n📝 Manual setup:");
    console.log(`GEMINI_API_KEY=${apiKey}`);
    console.log(`NEXT_PUBLIC_GEMINI_API_KEY=${apiKey}`);
  }

  // Create test endpoint
  try {
    const testDir = path.join(__dirname, "app", "api", "gemini-test");
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

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
    fs.writeFileSync(path.join(testDir, "route.js"), testEndpoint);
    console.log("✅ Test endpoint created at /api/gemini-test");
  } catch (error) {
    console.error("❌ Error creating test endpoint:", error.message);
  }
}

// Main execution
console.log("📋 Steps to get your Gemini API key:");
console.log("1. Visit: https://aistudio.google.com/app/apikey");
console.log("2. Sign in with your Google account");
console.log('3. Click "Create API Key"');
console.log('4. Copy the API key (starts with "AIzaSy...")\n');

rl.question("🔑 Please paste your Gemini API key here: ", (apiKey) => {
  apiKey = apiKey.trim();
  if (!apiKey || !apiKey.startsWith("AIzaSy")) {
    console.log("❌ Invalid API key. Please make sure you copied the correct key.");
    rl.close();
    return;
  }

  updateEnvFile(apiKey);
  rl.close();
});

rl.on("close", () => {
  console.log("\n✨ Setup complete! Next steps:");
  console.log("1. Restart your dev server: npm run dev");
  console.log("2. Visit: http://localhost:3000/api/gemini-test (POST request)");
  console.log("3. You should see: { success: true, message: 'API key is configured correctly' }");
  console.log("\n🎉 Gemini API is ready to use in your app!");
  process.exit(0);
});
