import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testRpc() {
  console.log('Testing if we can execute SQL via common RPC names...');
  
  const sql = `
    ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS grade_class TEXT;
    ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS preferred_subjects TEXT;
    ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS teaching_experience TEXT;
    ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS subjects_taught TEXT;
    ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS child_grade TEXT;
    ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS number_of_children INTEGER;
    ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS learning_goals TEXT;
    ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS department TEXT;
    ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS role_title TEXT;
    ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS access_level TEXT;
  `;

  // Try some common custom RPC names that developers create
  const rpcNames = ['exec_sql', 'execute_sql', 'run_sql', 'sql'];
  
  for (const rpcName of rpcNames) {
    try {
      const { data, error } = await supabase.rpc(rpcName, { sql_query: sql, query: sql, sql: sql });
      if (error) {
        console.log(`RPC '${rpcName}' returned error:`, error.message);
      } else {
        console.log(`RPC '${rpcName}' executed successfully! Data:`, data);
        return;
      }
    } catch (e: any) {
      console.log(`RPC '${rpcName}' threw exception:`, e.message);
    }
  }
}

testRpc();
