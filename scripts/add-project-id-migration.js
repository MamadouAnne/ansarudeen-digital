// Script to add project_id column to messages table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables!');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addProjectIdColumn() {
  try {
    console.log('Adding project_id column to messages table...');

    // Run the SQL migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add project_id field to messages table for sharing projects
        ALTER TABLE public.messages
        ADD COLUMN IF NOT EXISTS project_id INTEGER REFERENCES public.projects(id) ON DELETE CASCADE;

        -- Add index for faster queries
        CREATE INDEX IF NOT EXISTS idx_messages_project_id ON public.messages(project_id);
      `
    });

    if (error) {
      console.error('Error executing SQL:', error);

      // Try alternative approach using raw SQL
      console.log('\nTrying alternative approach...');
      const { error: altError } = await supabase
        .from('messages')
        .select('project_id')
        .limit(1);

      if (altError && altError.message.includes('does not exist')) {
        console.error('\nColumn does not exist. Please run this SQL directly in Supabase Dashboard:');
        console.log('\n---SQL TO RUN---');
        console.log('ALTER TABLE public.messages ADD COLUMN project_id INTEGER REFERENCES public.projects(id) ON DELETE CASCADE;');
        console.log('CREATE INDEX idx_messages_project_id ON public.messages(project_id);');
        console.log('---END SQL---\n');
        process.exit(1);
      }
    }

    console.log('✅ Migration completed successfully!');

  } catch (err) {
    console.error('Exception:', err);
    process.exit(1);
  }
}

addProjectIdColumn();
