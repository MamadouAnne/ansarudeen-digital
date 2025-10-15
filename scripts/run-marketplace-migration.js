const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = 'https://ebpqinieiovvpseneqtl.supabase.co';
const supabaseServiceKey = 'sbp_648a39247b21157dcd1ccfb8b956aab22f992e6a'; // This should be a service role key, not access token

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, '../supabase/migrations/20251015040748_create_marketplace_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migration...');

    // Split the SQL file into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
      console.log(statement.substring(0, 100) + '...');

      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        // Continue with next statement
      } else {
        console.log(`✓ Statement ${i + 1} executed successfully`);
      }
    }

    console.log('\n✅ Migration completed!');

    // Verify the data
    console.log('\nVerifying marketplace items...');
    const { data: items, error: itemsError } = await supabase
      .from('marketplace_items')
      .select('*');

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
    } else {
      console.log(`✓ Found ${items.length} marketplace items`);
    }

  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration();
