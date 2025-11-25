# Vercel Deployment Guide

This guide will help you deploy the Ekions frontend to Vercel with the backend API configured.

## Prerequisites

1. Backend deployed on Render: `https://akions.onrender.com`
2. Vercel account (sign up at https://vercel.com)

## Deployment Steps

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Select the `akions-app/frontend` folder as the root directory
5. Configure the project:
   - **Framework Preset**: Other
   - **Build Command**: `npm install && npx expo export:web`
   - **Output Directory**: `web-build`
   - **Install Command**: `npm install`
6. Add Environment Variable:
   - Key: `EXPO_PUBLIC_API_URL`
   - Value: `https://akions.onrender.com`
7. Click "Deploy"

#### Option B: Deploy via CLI

```bash
cd akions-app/frontend
vercel
```

Follow the prompts and add the environment variable when asked:
- `EXPO_PUBLIC_API_URL=https://akions.onrender.com`

### 3. Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

| Key | Value |
|-----|-------|
| `EXPO_PUBLIC_API_URL` | `https://akions.onrender.com` |

**Important**: After adding environment variables, you need to redeploy for them to take effect.

### 4. Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 5. Verify Deployment

After deployment:

1. Visit your Vercel deployment URL
2. Open browser DevTools → Network tab
3. Check that API calls are going to `https://akions.onrender.com`
4. Test login, signup, and other features

## Local Development

For local development, create a `.env` file in `akions-app/frontend/`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Then start the frontend:

```bash
cd akions-app/frontend
npm start
```

The app will automatically use `localhost:3000` for the API when running locally.

## Troubleshooting

### API Calls Failing

1. **Check CORS**: Ensure the backend CORS allows your Vercel domain
2. **Check Environment Variable**: Verify `EXPO_PUBLIC_API_URL` is set correctly in Vercel
3. **Redeploy**: Environment variables require a new deployment

### Build Failures

1. **Check Node Version**: Vercel should auto-detect, but ensure it's Node 18+
2. **Check Dependencies**: Ensure all dependencies are in `package.json`
3. **Check Build Logs**: Review build logs in Vercel Dashboard

### Frontend Not Loading

1. **Check Output Directory**: Ensure `web-build` directory exists after build
2. **Check Routes**: Verify `vercel.json` rewrites are configured correctly
3. **Check Console**: Look for errors in browser console

## Notes

- The frontend automatically detects the environment:
  - **Localhost**: Uses `http://localhost:3000`
  - **Production**: Uses `https://akions.onrender.com` (or `EXPO_PUBLIC_API_URL` if set)
- All API URLs are centralized in `src/config/api.ts`
- CORS is configured in the backend to allow Vercel deployments

