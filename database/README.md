# Database Directory

This directory contains all database-related files for the Ansarudeen Digital app.

## Structure

```
database/
├── scripts/          # Database setup and utility scripts
├── migrations/       # Database migration files (empty - migrations are in supabase/migrations)
└── archive/          # Archived/deprecated database files
```

## Files

### `/scripts`
- `setup-database.sql` - Main database setup script
- `fix-existing-user.sql` - Script to fix user profile issues
- `supabase-setup-simple.sql` - Simplified setup script

## Active Migrations

All active database migrations are located in:
```
/supabase/migrations/
```

These are managed by Supabase CLI and follow the naming convention:
```
YYYYMMDDHHMMSS_description.sql
```

## Usage

### Running Setup Scripts
```bash
# Using Supabase CLI
supabase db reset --local

# Or manually
psql -h localhost -p 54322 -U postgres -d postgres -f database/scripts/setup-database.sql
```

### Creating New Migrations
```bash
supabase migration new migration_name
```

## Notes
- Never modify migration files directly after they've been run
- Always use the Supabase CLI to create new migrations
- Keep scripts in this folder for reference and manual fixes only
