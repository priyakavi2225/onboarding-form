import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspect() {
  console.log('Querying database columns for profiles and roles tables...');
  
  // Try querying information_schema via sql if possible, or just fetch one row or see structure
  const { data: cols, error: colsErr } = await supabase
    .from('roles')
    .select('*')
    .limit(1);

  if (colsErr) {
    console.error('Error fetching from roles:', colsErr);
  } else {
    console.log('Roles sample row:', cols);
  }

  // Let's query information_schema.columns using a custom query if allowed, 
  // or check if there is an error when selecting specific columns.
  // We can try to select custom fields to see if they exist or fail:
  const testColumns = [
    'department', 
    'role_title', 
    'access_level',
    'grade_class',
    'preferred_subjects',
    'teaching_experience',
    'subjects_taught',
    'child_grade',
    'number_of_children',
    'learning_goals'
  ];
  for (const col of testColumns) {
    const { error } = await supabase
      .from('roles')
      .select(col)
      .limit(1);
    if (error) {
      console.log(`Column '${col}' does NOT exist in roles table: [Code: ${error.code}] ${error.message}`);
    } else {
      console.log(`Column '${col}' EXISTS in roles table!`);
    }
  }
}

inspect();
