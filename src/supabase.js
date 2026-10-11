import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uuhecsyknykhmmhdfifh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aGVjc3lrbnlraG1taGRmaWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTEwMTIsImV4cCI6MjEwNTQ2NzAxMn0.JWDlwXPJMHfQnHjsVnyPgVtdKvJQ79Ojzz8YYIZ8_rU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
