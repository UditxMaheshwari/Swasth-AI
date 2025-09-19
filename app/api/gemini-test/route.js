import { NextResponse } from 'next/server';

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
}