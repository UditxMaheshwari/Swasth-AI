#!/bin/bash

# Quick Start Script for Next.js + Supabase Production Setup
# Make executable: chmod +x quick-start-production.sh

echo "🚀 Next.js + Supabase Production Setup"
echo "======================================"

# Check if we're in a Next.js project
if [ ! -f "package.json" ]; then
    echo "❌ Error: No package.json found. Please run this in your Next.js project root."
    exit 1
fi

echo "📦 Installing required dependencies..."
npm install @supabase/supabase-js @supabase/ssr

echo "📁 Creating directory structure..."
mkdir -p app/api/auth/{signup,login,logout,session}
mkdir -p app/api/profile
mkdir -p app/auth/{login,signup}
mkdir -p app/{dashboard,profile}
mkdir -p components/auth
mkdir -p components/profile
mkdir -p hooks
mkdir -p lib

echo "📝 Copying production files..."

# Copy the production files to their correct locations
echo "Copying Supabase client..."
cp lib/supabaseClient-production.js lib/supabaseClient.js

echo "Copying API routes..."
cp app/api/auth/signup/route.js app/api/auth/signup/route.js
cp app/api/auth/login/route.js app/api/auth/login/route.js
cp app/api/auth/logout/route.js app/api/auth/logout/route.js
cp app/api/auth/session/route.js app/api/auth/session/route.js
cp app/api/profile/route.js app/api/profile/route.js

echo "Copying components..."
cp components/auth/LoginForm-production.jsx components/auth/LoginForm.jsx
cp components/auth/SignupForm-production.jsx components/auth/SignupForm.jsx
cp components/profile/ProfileForm-production.jsx components/profile/ProfileForm.jsx

echo "Copying hooks..."
cp hooks/useAuth-production.js hooks/useAuth.js

echo "Copying pages..."
cp app/auth/login/page-production.jsx app/auth/login/page.jsx
cp app/auth/signup/page-production.jsx app/auth/signup/page.jsx
cp app/dashboard/page-production.jsx app/dashboard/page.jsx
cp app/profile/page-production.jsx app/profile/page.jsx
cp app/layout-production.jsx app/layout.jsx

echo "Copying configuration files..."
cp middleware-production.js middleware.js
cp next.config-production.mjs next.config.mjs
cp vercel-production.json vercel.json

echo "📋 Creating environment template..."
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOL
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EOL
    echo "✅ Created .env.local template"
else
    echo "⚠️  .env.local already exists, skipping..."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your actual Supabase credentials"
echo "2. Run the SQL schema in your Supabase project (see supabase-schema-production.sql)"
echo "3. Test locally: npm run dev"
echo "4. Deploy to Vercel: vercel --prod"
echo ""
echo "📖 See DEPLOYMENT-GUIDE-PRODUCTION.md for detailed instructions"
