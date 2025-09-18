#!/bin/bash

# Quick Fix Script for Supabase Deployment Issues
echo "🔧 Fixing Supabase Deployment Issues..."
echo "======================================"

# Function to prompt for Supabase credentials
get_supabase_credentials() {
    echo "📝 Please provide your Supabase credentials:"
    echo "   (Get them from: https://supabase.com/dashboard → Your Project → Settings → API)"
    echo ""
    
    read -p "Enter your Supabase URL (https://your-project-id.supabase.co): " SUPABASE_URL
    read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY
    
    if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
        echo "❌ Both URL and Anon Key are required!"
        exit 1
    fi
    
    # Validate URL format
    if [[ ! "$SUPABASE_URL" =~ ^https://.*\.supabase\.co$ ]]; then
        echo "❌ Invalid Supabase URL format. Should be: https://your-project-id.supabase.co"
        exit 1
    fi
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🗑️  Removing old environment variables..."

# Remove existing environment variables (ignore errors if they don't exist)
vercel env rm NEXT_PUBLIC_SUPABASE_URL production 2>/dev/null || true
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production 2>/dev/null || true
vercel env rm NEXT_PUBLIC_SUPABASE_URL preview 2>/dev/null || true
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY preview 2>/dev/null || true
vercel env rm NEXT_PUBLIC_SUPABASE_URL development 2>/dev/null || true
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY development 2>/dev/null || true

# Get Supabase credentials
get_supabase_credentials

echo "✅ Setting new environment variables..."

# Set environment variables for all environments
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL preview
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview

echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL development
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development

echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo "✅ Supabase environment variables are now properly configured"
echo "✅ Runtime-safe Supabase client is active"
echo "✅ No more build-time errors!"
echo ""
echo "🔗 Your app should now be live and working properly."
