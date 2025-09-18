import { NextRequest, NextResponse } from 'next/server';

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'SwasthAI API is running on Vercel',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/ask',
      '/api/doctors', 
      '/api/health-centers',
      '/api/news'
    ]
  });
}
