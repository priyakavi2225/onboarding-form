import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Connecting to Supabase URL:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDb() {
  try {
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
    if (pError) throw pError;
    console.log('\n--- PROFILES TABLE ---');
    console.log(profiles);

    const { data: roles, error: rError } = await supabase.from('roles').select('*');
    if (rError) throw rError;
    console.log('\n--- ROLES TABLE ---');
    console.log(roles);

    const { data: preferences, error: prError } = await supabase.from('preferences').select('*');
    if (prError) throw prError;
    console.log('\n--- PREFERENCES TABLE ---');
    console.log(preferences);

  } catch (err: any) {
    console.error('Error querying Supabase:', err.message);
  }
}

checkDb();
