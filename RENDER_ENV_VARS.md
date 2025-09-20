# Environment Variables for Render Deployment

## Required Environment Variables

After deploying to Render, you'll need to set the following environment variables in your Render dashboard for the **swasthai-backend** service:

### Essential Keys (Required for basic deployment):
- **GEMINI_API_KEY**: Your Google Gemini AI API key for core AI features

### Optional Keys (for additional features):
- **TEAM_API_KEY**: Your AIXplain team API key for accessing AI models
- **GOOGLE_MAPS_API_KEY**: Google Maps API key for health center location services
- **DOC_MODEL_ID**: Model ID for doctor recommendations 
- **SUMM_MODEL_ID**: Model ID for text summarization
- **NEWS_MODEL_ID**: Model ID for health news
- **AGENT_MODEL_ID**: Main AI agent model ID

## How to Set Environment Variables in Render

1. Go to your Render dashboard
2. Select the **swasthai-backend** service
3. Go to the **Environment** tab
4. Click **Add Environment Variable**
5. Add each variable with its corresponding value
6. Click **Save Changes** and redeploy

## Automatic Environment Variables

These are set automatically by the render.yaml configuration:
- `NODE_ENV=production` (Frontend)
- `FLASK_ENV=production` (Backends)
- `PORT=10000` (Backends)
- `NEXT_PUBLIC_API_URL` (Auto-linked to backend URL)
- `NEXT_PUBLIC_ML_API_URL` (Auto-linked to ML backend URL)

## Security Notes

- Never commit API keys or sensitive data to version control
- Keep your AIXplain and Google API keys secure
- Consider using Render's environment groups for managing multiple environments