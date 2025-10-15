const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ebpqinieiovvpseneqtl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicHFpbmllaW92dnBzZW5lcXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjI1NzMsImV4cCI6MjA3MDYzODU3M30.3uDVdCrZjx5PHgH1UPhxeHF9rL4YCiMiv65KYN6YgXI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUserData() {
  console.log('Checking user data for mamadiankha@gmail.com...\n');

  // Query profiles table
  console.log('1. Checking profiles table:');
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (profileError) {
    console.log('   Error:', profileError.message);
  } else {
    console.log('   Data:', JSON.stringify(profileData, null, 2));
  }

  console.log('\n2. Checking if user is authenticated:');
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.log('   Not authenticated - cannot query auth.users directly');
    console.log('   Error:', userError.message);
  } else {
    console.log('   Current user:', JSON.stringify(user, null, 2));
  }

  console.log('\n3. To properly check the database, you need to:');
  console.log('   a) Go to Supabase Dashboard SQL Editor');
  console.log('   b) Run this query:');
  console.log('');
  console.log('      SELECT email, phone, raw_user_meta_data');
  console.log('      FROM auth.users');
  console.log('      WHERE email = \'mamadiankha@gmail.com\';');
  console.log('');
  console.log('   c) Share the output so I can see what fields are available');
}

checkUserData();
