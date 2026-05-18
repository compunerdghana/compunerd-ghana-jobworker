# Vercel Deployment Guide for CompuNerd Ghana Job Worker

## Overview

Vercel is a modern deployment platform optimized for Next.js and Node.js applications. This guide explains how to deploy the CompuNerd Ghana Job Worker to Vercel.

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub account with repository
- Supabase project set up (see SUPABASE_SETUP.md)
- All environment variables ready

## Step 1: Prepare Your Repository

### 1.1 Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: CompuNerd Ghana Job Worker"

# Add GitHub remote
git remote add origin https://github.com/yourusername/compunerd-ghana-jobworker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1.2 Verify Build Locally

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Build
pnpm build

# Test build output
ls -la dist/
```

## Step 2: Connect to Vercel

### 2.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Authorize Vercel to access GitHub
5. Select `compunerd-ghana-jobworker` repository
6. Click "Import"

### 2.2 Configure Build Settings

In the import dialog:

| Setting | Value |
|---------|-------|
| Framework Preset | Other |
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| Install Command | `pnpm install` |
| Node.js Version | 18.x |

Click "Deploy"

## Step 3: Set Environment Variables

### 3.1 Add Secrets in Vercel

1. After deployment, go to **Settings** → **Environment Variables**
2. Add each variable:

```
DATABASE_URL = postgresql://postgres:password@db.supabasehost.com:5432/postgres
VITE_APP_ID = your-manus-app-id
OAUTH_SERVER_URL = https://api.manus.im
VITE_OAUTH_PORTAL_URL = https://portal.manus.im
JWT_SECRET = your-secure-jwt-secret
OWNER_OPEN_ID = your-owner-open-id
OWNER_NAME = Your Name
BUILT_IN_FORGE_API_URL = https://api.manus.im
BUILT_IN_FORGE_API_KEY = your-forge-api-key
VITE_FRONTEND_FORGE_API_URL = https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY = your-frontend-forge-api-key
VITE_ANALYTICS_ENDPOINT = your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID = your-website-id
```

3. Select which environments: Production, Preview, Development
4. Click "Save"

### 3.2 Redeploy

1. Go to **Deployments**
2. Click the three dots on the latest deployment
3. Select "Redeploy"
4. Wait for deployment to complete

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Domain

1. Go to **Settings** → **Domains**
2. Enter your domain (e.g., `compunerd.com`)
3. Click "Add"
4. Follow DNS configuration instructions

### 4.2 Update DNS Records

Add these DNS records at your domain registrar:

```
Type: CNAME
Name: compunerd
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.165
```

Wait 24-48 hours for DNS propagation.

## Step 5: Verify Deployment

### 5.1 Test Application

1. Visit your Vercel deployment URL
2. Test login with username/password
3. Create a test client
4. Create a test job
5. Verify all modules are accessible

### 5.2 Check Logs

1. In Vercel, go to **Deployments**
2. Click on the active deployment
3. Check "Logs" for any errors
4. Monitor "Runtime Logs" for server errors

## Continuous Deployment

### Auto-Deploy on Push

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys
```

### Preview Deployments

Vercel creates preview deployments for pull requests:

1. Create a branch: `git checkout -b feature/new-feature`
2. Make changes and push: `git push origin feature/new-feature`
3. Create a pull request on GitHub
4. Vercel automatically creates a preview deployment
5. Test the changes
6. Merge to main when ready

## Performance Optimization

### 1. Enable Caching

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Monitor Performance

1. Go to **Analytics** in Vercel Dashboard
2. Check Web Vitals:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)

### 3. Optimize Images

Use Vercel's Image Optimization:

```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={100}
  height={100}
  priority
/>
```

## Monitoring & Alerts

### 1. Set Up Alerts

1. Go to **Settings** → **Alerts**
2. Enable notifications for:
   - Build failures
   - Deployment errors
   - Performance issues

### 2. Monitor Logs

```bash
# View real-time logs
vercel logs --follow

# View specific deployment logs
vercel logs [deployment-url]
```

## Troubleshooting

### Build Fails

**Problem**: Deployment fails during build

**Solution**:
1. Check build logs in Vercel dashboard
2. Run `pnpm build` locally to reproduce
3. Check for missing environment variables
4. Verify Node.js version compatibility

### Application Crashes

**Problem**: Deployment succeeds but app crashes

**Solution**:
1. Check runtime logs in Vercel
2. Verify database connection string
3. Check environment variables are set
4. Review application logs

### Slow Performance

**Problem**: Application is slow in production

**Solution**:
1. Check Vercel Analytics
2. Optimize database queries
3. Enable caching
4. Use CDN for static assets
5. Consider upgrading Vercel plan

### Database Connection Issues

**Problem**: Can't connect to Supabase

**Solution**:
1. Verify DATABASE_URL in environment variables
2. Check Supabase project is active
3. Test connection locally
4. Check firewall/network settings
5. Verify password doesn't have special characters

## Rollback & Recovery

### Rollback to Previous Deployment

1. Go to **Deployments** in Vercel
2. Find the previous stable deployment
3. Click the three dots
4. Select "Promote to Production"
5. Verify rollback was successful

### Database Rollback

If you need to rollback the database:

1. Go to Supabase Dashboard
2. Check backup history
3. Request restore from backup
4. Verify data integrity

## Security Best Practices

### 1. Secrets Management

- Never commit `.env` files
- Use Vercel environment variables
- Rotate secrets periodically
- Use strong, random values

### 2. HTTPS

- Vercel provides free HTTPS
- Always use HTTPS URLs
- Enable HSTS headers

### 3. Rate Limiting

Add rate limiting to prevent abuse:

```ts
// In your API routes
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. CORS Configuration

```ts
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## Scaling & Upgrades

### When to Upgrade

- Free plan: < 100 users
- Pro plan: 100-1000 users
- Enterprise: > 1000 users

### Upgrade Process

1. Go to **Settings** → **Billing**
2. Select desired plan
3. Update payment method
4. Upgrade is instant

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Node.js on Vercel](https://vercel.com/docs/functions/serverless-functions/node-js)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Last Updated**: May 2026
**Application**: CompuNerd Ghana Job Worker v1.0
