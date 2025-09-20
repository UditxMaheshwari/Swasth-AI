# SwasthAI Render Deployment Guide

## Overview
This guide will help you deploy the SwasthAI project on Render. The project consists of three services:
1. **Frontend**: Next.js application
2. **Main Backend**: Flask API for AI services and health centers
3. **ML Backend**: Flask API for machine learning predictions

## Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **API Keys**: Ensure you have all required API keys (see RENDER_ENV_VARS.md)

## Deployment Steps

### Step 1: Connect GitHub Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select the repository containing your SwasthAI project
5. Make sure the branch is set to your main branch (usually `main` or `master`)

### Step 2: Deploy from Blueprint

1. Render will automatically detect the `render.yaml` file
2. Review the services that will be created:
   - `swasthai-frontend` (Node.js)
   - `swasthai-backend` (Python)
   - `swasthai-ml-backend` (Python)
3. Click **"Apply"** to start the deployment

### Step 3: Configure Environment Variables

After deployment starts, you need to set the environment variables:

1. Go to your Render dashboard
2. Click on the **swasthai-backend** service
3. Go to **Environment** tab
4. Add the following **essential** variables:
   - `GEMINI_API_KEY`: Your Google Gemini AI API key
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL  
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

   **Optional variables** (for additional features):
   - `TEAM_API_KEY`: Your AIXplain API key
   - `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
   - `DOC_MODEL_ID`: Doctor recommendation model ID
   - `SUMM_MODEL_ID`: Summarization model ID
   - `NEWS_MODEL_ID`: News model ID
   - `AGENT_MODEL_ID`: Main agent model ID

### Step 4: Monitor Deployment

1. Watch the build logs for each service
2. The ML backend should build first (contains models)
3. Then the main backend
4. Finally the frontend

### Step 5: Test Your Deployment

Once all services are live:

1. Visit your frontend URL (will be like `https://swasthai-frontend.onrender.com`)
2. Test the main features:
   - AI health consultations
   - Health center finder
   - ML predictions
   - Health news

## Service URLs

After deployment, your services will be available at:
- **Frontend**: `https://swasthai-frontend.onrender.com`
- **Main Backend**: `https://swasthai-backend.onrender.com`
- **ML Backend**: `https://swasthai-ml-backend.onrender.com`

## Troubleshooting

### Common Issues:

1. **Build Failed**: Check the build logs in Render dashboard
2. **Environment Variables**: Make sure all required env vars are set
3. **CORS Errors**: The CORS settings have been configured for Render domains
4. **Service Dependencies**: The frontend automatically gets backend URLs

### If You Need to Redeploy:

1. Go to your service in Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Or push changes to your GitHub repo to trigger auto-deployment

## Production Considerations

1. **Domain**: Consider adding a custom domain
2. **CORS**: Tighten CORS settings to specific domains in production
3. **Rate Limiting**: Add rate limiting to your API endpoints
4. **Monitoring**: Set up health checks and monitoring
5. **Database**: Consider adding a database service if needed

## Support

If you encounter issues:
1. Check Render's build logs
2. Verify all environment variables are set
3. Test individual service endpoints
4. Check the RENDER_ENV_VARS.md file for environment variable details

## Free Tier Limitations

Render's free tier has some limitations:
- Services sleep after 15 minutes of inactivity
- Limited build minutes per month
- Consider upgrading for production use