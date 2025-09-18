# Vercel Deployment Fix Guide

## Issue Fixed
**Problem:** Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "next_public_supabase_url", which does not exist.

**Root Cause:** The `vercel.json` file was configured to use Vercel secrets (prefixed with `@`) but the secrets were not created in the Vercel dashboard.

## Solution Applied
Updated `vercel.json` to use regular environment variables instead of secrets:

### Before (using secrets):
```json
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key"
  }
}
```

### After (using environment variables):
```json
{
  "build": {
    "env": {
      "NEXT_PUBLIC_SUPABASE_URL": "$NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
    }
  }
}
```

## Next Steps for Deployment

1. **Set Environment Variables in Vercel Dashboard:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   TEAM_API_KEY=your_aixplain_team_api_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   DOC_MODEL_ID=your_doc_model_id
   SUMM_MODEL_ID=your_summ_model_id
   NEWS_MODEL_ID=your_news_model_id
   AGENT_MODEL_ID=your_agent_model_id
   ```

2. **Redeploy Your Application:**
   - Trigger a new deployment in Vercel
   - The build should now succeed without the secret reference error

## Alternative: Using Vercel Secrets (Optional)
If you prefer to use Vercel secrets, you would need to:
1. Create secrets in Vercel CLI: `vercel secrets add next_public_supabase_url "your_url_here"`
2. Revert the vercel.json changes to use `@secret_name` syntax

## Verification
After deployment, verify that:
- [ ] Build completes without environment variable errors
- [ ] Application loads correctly
- [ ] Supabase connection works
- [ ] All API integrations function properly

## Files Modified
- `vercel.json` - Updated environment variable configuration
- `deployment-env-template.md` - Updated documentation
- `VERCEL-DEPLOYMENT-FIX.md` - Created this troubleshooting guide
