# CompuNerd Ghana Job Worker - Supabase + Vercel Deployment Guide

This guide explains how to deploy the CompuNerd Ghana Job Worker application using Supabase for the database and Vercel for hosting.

## Prerequisites

- Supabase account (https://supabase.com)
- Vercel account (https://vercel.com)
- GitHub account with the project repository
- Node.js 18+ installed locally

## Step 1: Set Up Supabase Database

### 1.1 Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Enter project details:
   - **Name**: `compunerd-ghana-jobworker`
   - **Database Password**: Create a strong password
   - **Region**: Choose the region closest to your users (e.g., Africa - South Africa)
4. Click "Create new project" and wait for it to initialize

### 1.2 Get Your Database Connection String

1. In Supabase, go to **Settings** → **Database**
2. Under "Connection string", select **URI** tab
3. Copy the connection string (it will look like: `postgresql://user:password@host:5432/postgres`)
4. Replace `[YOUR-PASSWORD]` with your database password

### 1.3 Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the SQL schema from `drizzle/migrations/` directory
4. Execute the query to create all tables

Alternatively, use Drizzle migrations:
```bash
# From your local machine
DATABASE_URL="your-supabase-connection-string" pnpm drizzle-kit migrate
```

## Step 2: Configure Environment Variables

### 2.1 Local Development

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@db.supabasehost.com:5432/postgres

# OAuth (Manus)
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# JWT
JWT_SECRET=your-jwt-secret-key

# Owner
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Your Name

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key

# Analytics
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### 2.2 Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all the environment variables from `.env.local` (except local-only variables)

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Connect your GitHub account and select the `compunerd-ghana-jobworker` repository
5. Click "Import"

### 3.2 Configure Build Settings

1. In the import dialog, configure:
   - **Framework Preset**: Other
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

2. Click "Deploy"

### 3.3 Set Environment Variables in Vercel

1. After deployment, go to **Settings** → **Environment Variables**
2. Add all required environment variables
3. Redeploy the project

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL
2. Test the login functionality
3. Verify database connectivity by creating a test client
4. Check that all modules are accessible

## Troubleshooting

### Database Connection Issues

If you get "Database connection failed":

1. Verify the `DATABASE_URL` is correct in Vercel environment variables
2. Check that Supabase project is active
3. Ensure your IP is whitelisted (Supabase allows all IPs by default)
4. Test connection locally: `psql your-connection-string`

### Build Failures

If the build fails on Vercel:

1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Run `pnpm build` locally to test
4. Check that Node.js version is 18+

### Authentication Issues

If login doesn't work:

1. Verify OAuth credentials in environment variables
2. Check JWT_SECRET is set
3. Ensure cookies are enabled in browser
4. Clear browser cache and try again

## Production Best Practices

1. **Enable HTTPS**: Vercel automatically provides HTTPS
2. **Set up monitoring**: Use Vercel Analytics
3. **Database backups**: Enable Supabase automated backups
4. **Rate limiting**: Configure in Vercel middleware
5. **Environment separation**: Use different Supabase projects for staging/production

## Scaling Considerations

- **Database**: Supabase PostgreSQL can handle millions of rows
- **Storage**: Use Supabase Storage for file uploads
- **Serverless Functions**: Vercel handles auto-scaling
- **CDN**: Vercel provides global CDN for static assets

## Support & Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [tRPC Documentation](https://trpc.io)

## Rollback Procedure

If you need to rollback to a previous version:

1. In Vercel, go to **Deployments**
2. Find the previous deployment
3. Click the three dots and select "Promote to Production"
4. Verify the rollback was successful

---

**Last Updated**: May 2026
**Application**: CompuNerd Ghana Job Worker v1.0
