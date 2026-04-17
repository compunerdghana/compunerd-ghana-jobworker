# CompuNerd Ghana Job Worker - Deployment Guide

## Quick Start for Azure Deployment

This application is fully configured and ready to deploy to Azure. Follow these steps to get started.

## Step 1: Configure Environment Variables

Before deployment, you'll need to configure the following environment variables in your Azure environment:

### Required Variables

**Database Connection:**
- `DATABASE_URL` - Your Azure SQL Database or MySQL connection string

**Authentication:**
- `JWT_SECRET` - A secure random string for session signing
- `OAUTH_SERVER_URL` - Manus OAuth server URL (usually https://api.manus.im)
- `VITE_OAUTH_PORTAL_URL` - Manus OAuth portal URL
- `VITE_APP_ID` - Your Manus application ID

**Owner Information:**
- `OWNER_NAME` - Your company name (CompuNerd Ghana)
- `OWNER_OPEN_ID` - Your owner OpenID from Manus

**API Keys:**
- `BUILT_IN_FORGE_API_URL` - Manus API endpoint
- `BUILT_IN_FORGE_API_KEY` - Server-side API key
- `VITE_FRONTEND_FORGE_API_URL` - Frontend API endpoint
- `VITE_FRONTEND_FORGE_API_KEY` - Frontend API key

### Optional Variables

- `VITE_ANALYTICS_ENDPOINT` - Analytics service endpoint
- `VITE_ANALYTICS_WEBSITE_ID` - Analytics website ID
- `STRIPE_SECRET_KEY` - Stripe API key (if payment processing is enabled)
- `VITE_STRIPE_PUBLIC_KEY` - Stripe public key (if payment processing is enabled)

## Step 2: Database Setup

### Create Database

For Azure SQL Database:
```bash
# Create resource group
az group create --name myResourceGroup --location eastus

# Create SQL server
az sql server create \
  --name myserver \
  --resource-group myResourceGroup \
  --location eastus \
  --admin-user azureuser \
  --admin-password P@ssw0rd123!

# Create database
az sql db create \
  --resource-group myResourceGroup \
  --server myserver \
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
  --admin-password P@ssw0rd123! \
  --sku-name B_Gen5_1
```

### Run Migrations

```bash
# Install dependencies
npm install

# Generate migrations
npm run db:push

# Or manually:
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Step 3: Deploy to Azure

### Option A: Azure App Service (Recommended)

```bash
# Create App Service Plan
az appservice plan create \
  --name compunerd-plan \
  --resource-group myResourceGroup \
  --sku B2 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group myResourceGroup \
  --plan compunerd-plan \
  --name compunerd-jobworker \
  --runtime "NODE|22-lts"

# Set environment variables
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name compunerd-jobworker \
  --settings \
    DATABASE_URL="your-connection-string" \
    JWT_SECRET="your-secret" \
    OAUTH_SERVER_URL="https://api.manus.im" \
    VITE_OAUTH_PORTAL_URL="https://portal.manus.im" \
    VITE_APP_ID="your-app-id" \
    OWNER_NAME="CompuNerd Ghana" \
    OWNER_OPEN_ID="your-open-id" \
    BUILT_IN_FORGE_API_URL="https://api.manus.im" \
    BUILT_IN_FORGE_API_KEY="your-api-key" \
    VITE_FRONTEND_FORGE_API_URL="https://api.manus.im" \
    VITE_FRONTEND_FORGE_API_KEY="your-frontend-key"

# Build and deploy
npm run build
zip -r deploy.zip dist node_modules package.json

az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name compunerd-jobworker \
  --src deploy.zip
```

### Option B: Docker Container

```bash
# Create container registry
az acr create \
  --resource-group myResourceGroup \
  --name myregistry \
  --sku Basic

# Build and push image
az acr build \
  --registry myregistry \
  --image compunerd-jobworker:latest .

# Deploy to Container Instances
az container create \
  --resource-group myResourceGroup \
  --name compunerd-jobworker \
  --image myregistry.azurecr.io/compunerd-jobworker:latest \
  --cpu 2 \
  --memory 3.5 \
  --ports 3000 \
  --environment-variables \
    DATABASE_URL="your-connection-string" \
    JWT_SECRET="your-secret" \
    OAUTH_SERVER_URL="https://api.manus.im" \
    VITE_OAUTH_PORTAL_URL="https://portal.manus.im" \
    VITE_APP_ID="your-app-id" \
    OWNER_NAME="CompuNerd Ghana" \
    OWNER_OPEN_ID="your-open-id" \
    BUILT_IN_FORGE_API_URL="https://api.manus.im" \
    BUILT_IN_FORGE_API_KEY="your-api-key" \
    VITE_FRONTEND_FORGE_API_URL="https://api.manus.im" \
    VITE_FRONTEND_FORGE_API_KEY="your-frontend-key"
```

## Step 4: Verify Deployment

```bash
# Check application status
az webapp show \
  --resource-group myResourceGroup \
  --name compunerd-jobworker \
  --query "state"

# View logs
az webapp log tail \
  --name compunerd-jobworker \
  --resource-group myResourceGroup
```

## Application Features

The CompuNerd Ghana Job Worker application includes:

### Core Modules
- **Dashboard** - KPI overview and activity feed
- **CRM** - Client management and contact history
- **Jobs** - Ticket management with workflow (Open → In Progress → Resolved → Closed)
- **Devices** - Asset management with warranty tracking
- **Inventory** - Stock management with low-stock alerts
- **Engineers** - Field engineer portal with check-in/out
- **Finance** - Invoicing and payment tracking
- **Staff** - HR and employee management

### Role-Based Access Control
- **Admin** - Full system access
- **Manager** - Team and job management
- **Field Engineer** - Job assignment and work logging
- **Finance** - Invoice and payment management

### Technology Stack
- **Frontend**: React 19, Tailwind CSS 4, TypeScript
- **Backend**: Express 4, tRPC 11, Node.js 22
- **Database**: MySQL 8.0+ or Azure SQL Database
- **Authentication**: Manus OAuth 2.0
- **UI Components**: shadcn/ui, Radix UI

## Production Checklist

- [ ] Database is created and migrations applied
- [ ] All environment variables are configured
- [ ] HTTPS/SSL is enabled
- [ ] Database backups are configured
- [ ] Application logs are monitored
- [ ] Application has been tested in staging
- [ ] Firewall rules are configured
- [ ] Database connection is encrypted
- [ ] Admin user has been created
- [ ] Application is accessible via custom domain

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
mysql -h hostname -u username -p database_name

# Check connection string format
# MySQL: mysql://username:password@hostname:3306/dbname
# Azure SQL: Server=tcp:hostname.database.windows.net,1433;Initial Catalog=dbname;...
```

### Application Won't Start
```bash
# Check logs
az webapp log tail --name compunerd-jobworker --resource-group myResourceGroup

# Verify environment variables
az webapp config appsettings list \
  --resource-group myResourceGroup \
  --name compunerd-jobworker
```

### Authentication Issues
- Verify VITE_APP_ID is correct
- Check OAUTH_SERVER_URL is accessible
- Ensure JWT_SECRET is set

## Support

For additional help, refer to:
- Azure Documentation: https://docs.microsoft.com/azure/
- tRPC Documentation: https://trpc.io/
- Drizzle ORM: https://orm.drizzle.team/

## Security Notes

- Never commit `.env` files to version control
- Rotate JWT_SECRET regularly
- Use strong database passwords
- Enable SSL/TLS for all connections
- Configure firewall rules appropriately
- Enable Azure Monitor and Application Insights
- Regular database backups are essential
