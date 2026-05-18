# Supabase Database Setup for CompuNerd Ghana Job Worker

## Overview

This application uses Supabase PostgreSQL as the database backend. Supabase provides a managed PostgreSQL database with built-in authentication, real-time capabilities, and storage.

## Getting Started with Supabase

### 1. Create a Supabase Account

1. Visit [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Create a new organization

### 2. Create a New Project

1. In Supabase Dashboard, click "New Project"
2. Fill in project details:
   - **Project Name**: `compunerd-ghana-jobworker`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Select closest to your users
     - Africa: South Africa (Johannesburg)
     - Europe: Ireland or London
     - Asia: Singapore or Tokyo
3. Click "Create new project"
4. Wait for the project to initialize (2-3 minutes)

### 3. Get Your Database Connection String

#### Method A: Direct Connection (for local development)

1. Go to **Settings** → **Database**
2. Under "Connection string", select **URI**
3. Copy the connection string
4. Replace `[YOUR-PASSWORD]` with your database password
5. This is your `DATABASE_URL`

Example:
```
postgresql://postgres:your-password@db.supabasehost.com:5432/postgres
```

#### Method B: Connection Pooling (recommended for production)

1. Go to **Settings** → **Database**
2. Under "Connection string", select **Pooling**
3. Copy the connection string
4. This provides better performance for serverless deployments

### 4. Create Database Tables

The application uses Drizzle ORM for database management. To create tables:

#### Option A: Using Supabase SQL Editor (Recommended)

1. In Supabase, go to **SQL Editor**
2. Click "New Query"
3. Copy the SQL schema from your project's migration files
4. Execute the query

#### Option B: Using Drizzle Migrations (Local)

```bash
# Set your Supabase connection string
export DATABASE_URL="postgresql://postgres:password@db.supabasehost.com:5432/postgres"

# Run migrations
pnpm drizzle-kit migrate
```

### 5. Verify Connection

Test your connection:

```bash
# Using psql (PostgreSQL client)
psql "postgresql://postgres:password@db.supabasehost.com:5432/postgres"

# Or using Node.js
node -e "require('mysql2/promise').createConnection({connectionString: 'postgresql://...'}).then(() => console.log('Connected!'))"
```

## Database Schema

The application includes the following tables:

| Table | Purpose |
|-------|---------|
| `users` | User accounts with authentication |
| `clients` | Client/customer information |
| `jobs` | Service jobs and tickets |
| `devices` | IT equipment and assets |
| `inventory` | Stock items and supplies |
| `fieldEngineers` | Field engineer profiles |
| `invoices` | Financial invoices |
| `staff` | Employee records |
| `payroll` | Payroll and compensation |
| `activityLogs` | System activity tracking |

## Security Best Practices

### 1. Database Password

- Use a strong password (min 16 characters, mix of upper/lower/numbers/symbols)
- Store securely in password manager
- Never commit to version control
- Rotate periodically

### 2. Connection String

- Never share your connection string
- Use environment variables (never hardcode)
- Different connection strings for dev/staging/production
- Use connection pooling in production

### 3. Network Security

- Supabase allows all IPs by default (safe for development)
- For production, consider IP whitelisting
- Use SSL/TLS for all connections (enabled by default)

### 4. Row Level Security (RLS)

Enable Row Level Security for sensitive tables:

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only see their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid()::text = open_id);
```

## Backup & Recovery

### Automatic Backups

Supabase automatically backs up your database:
- Daily backups retained for 7 days
- Weekly backups retained for 4 weeks
- Monthly backups retained for 1 year

### Manual Backup

```bash
# Export database to SQL file
pg_dump "postgresql://postgres:password@db.supabasehost.com:5432/postgres" > backup.sql

# Restore from backup
psql "postgresql://postgres:password@db.supabasehost.com:5432/postgres" < backup.sql
```

## Monitoring & Maintenance

### Monitor Database Performance

1. Go to **Logs** in Supabase Dashboard
2. Check for slow queries
3. Monitor connection count
4. Review error logs

### Database Optimization

```sql
-- Create indexes for frequently queried fields
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_client_id ON jobs(client_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM jobs WHERE status = 'open';
```

## Troubleshooting

### Connection Refused

**Problem**: `Error: connect ECONNREFUSED`

**Solution**:
- Verify connection string is correct
- Check database password
- Ensure project is active in Supabase
- Check firewall/network settings

### Authentication Failed

**Problem**: `FATAL: password authentication failed`

**Solution**:
- Verify password in connection string
- Check for special characters (URL encode if needed)
- Reset password in Supabase Settings

### Slow Queries

**Problem**: Application is slow

**Solution**:
- Check Supabase logs for slow queries
- Add indexes to frequently queried columns
- Use connection pooling
- Optimize queries with EXPLAIN ANALYZE

## Migration from Other Databases

If migrating from MySQL/MariaDB:

```bash
# Export from MySQL
mysqldump -u user -p database > dump.sql

# Convert MySQL syntax to PostgreSQL
# Use tools like: https://www.convert-in.com/mysql2pgsql.htm

# Import to Supabase
psql "postgresql://..." < converted.sql
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [Connection Pooling Guide](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooling-with-supabase)

---

**Last Updated**: May 2026
**Application**: CompuNerd Ghana Job Worker v1.0
