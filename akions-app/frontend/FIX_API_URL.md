# Fix: API URL Still Using Localhost

If you're seeing API requests going to `http://localhost:3000` instead of `https://akions.onrender.com`, follow these steps:

## Quick Check

Open your browser console and look for `[API Config]` messages. This will tell you which URL is being used.

## Solution 1: Local Development (Expected Behavior)

If you're running locally with `npm start` or `expo start --web`, the app **correctly** uses `localhost:3000` for the backend. This is expected behavior.

To test with the production backend locally:
1. Create a `.env` file in `akions-app/frontend/`:
   ```
   EXPO_PUBLIC_API_URL=https://akions.onrender.com
   ```
2. Restart the Expo dev server (stop and run `npm start` again)

## Solution 2: Vercel Deployment

If you're testing on Vercel and still seeing localhost:

### Step 1: Set Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Key**: `EXPO_PUBLIC_API_URL`
   - **Value**: `https://akions.onrender.com`
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**

### Step 2: Redeploy

Environment variables require a new deployment:

1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

### Step 3: Verify

After redeployment:
1. Open your Vercel URL
2. Open browser DevTools → Console
3. Look for: `[API Config] Using EXPO_PUBLIC_API_URL: https://akions.onrender.com`
4. Check Network tab - requests should go to `https://akions.onrender.com`

## Solution 3: Force Production URL (Temporary)

If you need to force the production URL immediately, you can temporarily modify `src/config/api.ts`:

```typescript
// Temporary: Force production URL
export const API_BASE = 'https://akions.onrender.com';
```

**Note**: This removes the automatic environment detection. Revert after testing.

## Debugging

The API config now logs which URL it's using. Check the browser console for:
- `[API Config] Using EXPO_PUBLIC_API_URL: ...` - Environment variable found
- `[API Config] Detected localhost, using local backend` - Running locally
- `[API Config] Detected production domain, using Render backend` - Production domain detected
- `[API Config] Using fallback production backend` - Fallback used

## Common Issues

### Issue: Environment variable not working in Vercel
**Fix**: Make sure you:
1. Set `EXPO_PUBLIC_API_URL` (not `API_URL`)
2. Redeploy after adding the variable
3. Check that it's set for the correct environment (Production/Preview/Development)

### Issue: Still using localhost after setting env var
**Fix**: 
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check console for `[API Config]` messages
4. Verify the environment variable is set correctly in Vercel

### Issue: CORS errors
**Fix**: The backend CORS is already configured to allow Vercel domains. If you see CORS errors:
1. Check that your Vercel domain is allowed in `backend/server.js`
2. Verify the backend is running on Render

