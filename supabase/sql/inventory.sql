-- Read-only inventory of what actually exists in Supabase.
-- Paste the four result sets back so unused tables, policies, functions,
-- and buckets can be matched against what the code uses.

-- 1. Tables with row counts
SELECT c.relname AS "table", c.reltuples::bigint AS approx_rows
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY c.relname;

-- 2. RLS policies
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
ORDER BY tablename, policyname;

-- 3. Functions
SELECT p.proname AS "function"
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- 4. Storage buckets
SELECT id, public, file_size_limit FROM storage.buckets ORDER BY id;
