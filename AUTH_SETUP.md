# Authentication Setup Guide

## Issue
After signing in with Google via Supabase, the page shows the home page with a `?code=...` URL parameter instead of redirecting to the dashboard.

## Root Causes
This typically happens when:

1. **Supabase Redirect URLs not configured** - The most common cause
2. **Environment variables not set in Vercel**
3. **OAuth session not properly exchanged**

## Solution Steps

### 1. Configure Supabase Redirect URLs

**In Supabase Dashboard:**
1. Go to your project → Authentication → Providers → Google
2. Under "Redirect URLs", add these two URLs:
   - For local development: `http://localhost:3000/auth/callback`
   - For production: `https://your-app.vercel.app/auth/callback`
   
3. Click "Save"

### 2. Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

You can find these in your Supabase project → Settings → API

### 3. Test the Flow

1. **Local Testing**: Run `npm run dev` and test the Google Sign-in flow
2. **Production Testing**: Deploy to Vercel and test again with your Vercel domain

### 4. Debugging

If issues persist, check the browser console and Supabase logs for errors. The flow should be:
1. User clicks "Sign in with Google"
2. Redirected to Google login
3. Google redirects to `https://your-domain.com/auth/callback?code=...`
4. Our callback route exchanges the code for a session
5. Redirected to `/dashboard`

### 5. Verify Session is Persisted

The session is stored in `sb-<project-id>-auth-token` cookie. Check:
- Browser DevTools → Application → Cookies
- Verify the cookie exists after authentication
- The cookie should be marked as secure and httpOnly in production

## Files Modified/Created

- `src/app/auth/callback/route.ts` - Improved callback handler
- `src/middleware.ts` - Session check middleware
- `src/app/dashboard/page.tsx` - Dashboard with user check
- `.env.example` - Environment variables template

## Still Having Issues?

1. Check Supabase dashboard for any auth errors
2. Verify all environment variables are set correctly
3. Clear cookies and try again
4. Check that CORS is properly configured in Supabase
