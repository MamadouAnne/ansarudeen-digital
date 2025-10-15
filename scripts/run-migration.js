const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

console.log(`${colors.yellow}==========================================${colors.reset}`);
console.log(`${colors.yellow}   Marketplace Migration Runner${colors.reset}`);
console.log(`${colors.yellow}==========================================${colors.reset}\n`);

const SUPABASE_URL = 'https://ebpqinieiovvpseneqtl.supabase.co';
const MIGRATION_FILE = path.join(__dirname, '../supabase/migrations/20251015040748_create_marketplace_tables.sql');

async function runMigration() {
  try {
    // Read the migration file
    console.log(`${colors.cyan}Reading migration file...${colors.reset}`);

    if (!fs.existsSync(MIGRATION_FILE)) {
      console.log(`${colors.red}✗ Migration file not found at: ${MIGRATION_FILE}${colors.reset}`);
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(MIGRATION_FILE, 'utf8');
    console.log(`${colors.green}✓ Migration file loaded${colors.reset}\n`);

    // Prompt for service role key or database password
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(`${colors.yellow}Please choose how to run the migration:${colors.reset}`);
    console.log(`  1. Use Supabase Service Role Key (recommended)`);
    console.log(`  2. Copy SQL to clipboard and open Supabase Dashboard\n`);

    rl.question('Enter your choice (1 or 2): ', async (choice) => {
      if (choice === '1') {
        rl.question('\nEnter your Supabase Service Role Key: ', async (serviceKey) => {
          rl.close();

          if (!serviceKey || serviceKey.trim() === '') {
            console.log(`${colors.red}✗ Service role key is required${colors.reset}`);
            process.exit(1);
          }

          console.log(`\n${colors.cyan}Running migration via REST API...${colors.reset}\n`);

          try {
            const fetch = (await import('node-fetch')).default;

            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': serviceKey,
                'Authorization': `Bearer ${serviceKey}`
              },
              body: JSON.stringify({ query: sqlContent })
            });

            if (response.ok) {
              console.log(`${colors.green}✓ Migration completed successfully!${colors.reset}\n`);
            } else {
              const error = await response.text();
              console.log(`${colors.red}✗ Migration failed:${colors.reset}`);
              console.log(error);
              console.log(`\n${colors.yellow}Fallback option: Use option 2 to run manually in Supabase Dashboard${colors.reset}`);
            }
          } catch (error) {
            console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
            console.log(`\n${colors.yellow}Please use option 2 instead${colors.reset}`);
          }
        });
      } else if (choice === '2') {
        rl.close();

        console.log(`\n${colors.green}SQL Migration Content:${colors.reset}`);
        console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}`);
        console.log(sqlContent);
        console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);

        console.log(`${colors.yellow}Instructions:${colors.reset}`);
        console.log(`  1. Copy the SQL content above`);
        console.log(`  2. Go to: ${colors.cyan}${SUPABASE_URL}/project/ebpqinieiovvpseneqtl/sql${colors.reset}`);
        console.log(`  3. Paste the SQL in the editor`);
        console.log(`  4. Click "Run" or press Cmd+Enter\n`);

        console.log(`${colors.green}The migration will:${colors.reset}`);
        console.log(`  - Create marketplace_categories table`);
        console.log(`  - Create marketplace_items table`);
        console.log(`  - Insert 6 categories`);
        console.log(`  - Insert 8 items linked to mamadiankha@gmail.com`);
        console.log(`  - Use your real name and phone from the database\n`);
      } else {
        rl.close();
        console.log(`${colors.red}Invalid choice. Please run the script again.${colors.reset}`);
      }
    });

  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

runMigration();
