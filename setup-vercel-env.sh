#!/bin/bash

# SwasthAI Vercel Environment Variables Setup Script
echo "🚀 Setting up Vercel Environment Variables for SwasthAI"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📝 Setting environment variables..."

# Set required environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://placeholder.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxMjM0NTYsImV4cCI6MTk2MDY5OTQ1Nn0.placeholder-key"
vercel env add GEMINI_API_KEY production <<< "AIzaSyBd0JzFZk_j-QknnMzJP0wLrEMyPyPRZh4"

# Set for preview environment
vercel env add NEXT_PUBLIC_SUPABASE_URL preview <<< "https://placeholder.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxMjM0NTYsImV4cCI6MTk2MDY5OTQ1Nn0.placeholder-key"
vercel env add GEMINI_API_KEY preview <<< "AIzaSyBd0JzFZk_j-QknnMzJP0wLrEMyPyPRZh4"

# Set for development environment
vercel env add NEXT_PUBLIC_SUPABASE_URL development <<< "https://placeholder.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxMjM0NTYsImV4cCI6MTk2MDY5OTQ1Nn0.placeholder-key"
vercel env add GEMINI_API_KEY development <<< "AIzaSyBd0JzFZk_j-QknnMzJP0wLrEMyPyPRZh4"

echo "✅ Environment variables set successfully!"
echo "🚀 Now deploying to Vercel..."

# Deploy to production
vercel --prod

echo "🎉 Deployment complete! Your SwasthAI app should now be live with Gemini AI integration."
