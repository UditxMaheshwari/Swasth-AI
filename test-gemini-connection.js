require('dotenv').config();

async function testGeminiConnection() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is not set in .env.local');
    return;
  }

  console.log('🔑 Found GEMINI_API_KEY:', apiKey.substring(0, 10) + '...');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Hello, is the AI service working?' }]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', data.error || 'Unknown error');
      return;
    }

    console.log('✅ Success! API Response:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Failed to connect to Gemini API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testGeminiConnection();
