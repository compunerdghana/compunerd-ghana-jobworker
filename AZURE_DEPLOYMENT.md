# CompuNerd Ghana Job Worker - Azure Deployment Guide

## Overview

This application is configured to run on Azure with the following stack:
- **Frontend**: React 19 + Tailwind CSS 4
- **Backend**: Express 4 + tRPC 11
- **Database**: MySQL 8.0+ or Azure SQL Database
- **Authentication**: Manus OAuth 2.0
- **Hosting**: Azure App Service or Container Instances

## Prerequisites

- Azure subscription with appropriate permissions
- Azure SQL Database or MySQL instance
- Node.js 22.x runtime
- Environment variables configured

## Environment Variables

The application requires the following environment variables to be set in Azure:

### Database Configuration
```
DATABASE_URL=mysql://username:password@hostname:3306/database_name
```

### Authentication
```
JWT_SECRET=your-jwt-secret-key-here
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-app-id
```

### Owner Information
```
OWNER_NAME=Your Company Name
OWNER_OPEN_ID=your-open-id
```

### Manus Built-in APIs
```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key
```

### Analytics (Optional)
```
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## Database Setup

### 1. Create Azure SQL Database or MySQL Instance

For Azure SQL Database:
```bash
az sql db create \
  --resource-group myResourceGroup \
  --server myServer \
  --name compunerd_jobworker \
  --edition Standard
```

For Azure Database for MySQL:
```bash
az mysql server create \
  --resource-group myResourceGroup \
  --name myserver \
  --location eastus \
  --admin-user azureuser \
  --admin-password P@ssw0rd123!
```

### 2. Run Database Migrations

After connecting to your database, run the migrations:

```bash
# Generate migrations from schema
pnpm drizzle-kit generate

# Apply migrations to database
pnpm drizzle-kit migrate
```

### 3. Seed Initial Data (Optional)

Create an admin user and initial data:

```sql
INSERT INTO users (openId, name, email, role, loginMethod)
VALUES ('admin-user-id', 'Admin User', 'admin@compunerd.com', 'admin', 'manus');
```

## Deployment Steps

### Option 1: Azure App Service

1. **Create App Service Plan**
```bash
az appservice plan create \
  --name compunerd-plan \
  --resource-group myResourceGroup \
  --sku B2 \
  --is-linux
```

2. **Create Web App**
```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan compunerd-plan \
  --name compunerd-jobworker \
  --runtime "NODE|22-lts"
```

3. **Configure Environment Variables**
```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name compunerd-jobworker \
  --settings DATABASE_URL="mysql://..." JWT_SECRET="..." ...
```

4. **Deploy Application**
```bash
# Build the application
pnpm build

# Deploy to Azure
az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name compunerd-jobworker \
  --src dist.zip
```

### Option 2: Docker Container

1. **Create Dockerfile**
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

2. **Build and Push to Azure Container Registry**
```bash
az acr build \
  --registry myRegistry \
  --image compunerd-jobworker:latest .
```

3. **Deploy to Container Instances**
```bash
az container create \
  --resource-group myResourceGroup \
  --name compunerd-jobworker \
  --image myRegistry.azurecr.io/compunerd-jobworker:latest \
  --environment-variables DATABASE_URL="..." JWT_SECRET="..." \
  --ports 3000 \
  --memory 1.5
```

## Production Checklist

- [ ] Database is configured and migrations applied
- [ ] All environment variables are set
- [ ] HTTPS is enabled
- [ ] Database backups are configured
- [ ] Application logs are configured
- [ ] Monitoring and alerts are set up
- [ ] Application has been tested in staging
- [ ] SSL certificate is valid
- [ ] Firewall rules are configured
- [ ] Database connection is encrypted

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format is correct
- Check firewall rules allow your IP
- Ensure database user has appropriate permissions
- Verify SSL connection if required

### Authentication Issues
- Verify OAUTH_SERVER_URL is correct
- Check VITE_APP_ID is registered
- Ensure JWT_SECRET is set correctly

### Application Crashes
- Check application logs: `az webapp log tail --name compunerd-jobworker --resource-group myResourceGroup`
- Verify all environment variables are set
- Check database connection is working

## Scaling

### Horizontal Scaling
```bash
az appservice plan update \
  --name compunerd-plan \
  --resource-group myResourceGroup \
  --sku P1V2 \
  --number-of-workers 3
```

### Database Scaling
For Azure SQL Database:
```bash
az sql db update \
  --resource-group myResourceGroup \
  --server myServer \
  --name compunerd_jobworker \
  --edition Premium \
  --capacity 4
```

## Monitoring

### Enable Application Insights
```bash
az monitor app-insights component create \
  --app compunerd-insights \
  --location eastus \
  --resource-group myResourceGroup \
  --application-type web
```

### View Logs
```bash
az webapp log tail \
  --name compunerd-jobworker \
  --resource-group myResourceGroup
```

## Support

For issues or questions, contact the development team or refer to the application documentation.
