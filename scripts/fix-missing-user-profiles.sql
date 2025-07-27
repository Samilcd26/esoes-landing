-- Fix missing user profiles
-- This script creates user profiles for users who exist in auth.users but not in public.users

-- Insert missing user profiles
INSERT INTO public.users (id, email, first_name, last_name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'first_name', ''),
    COALESCE(au.raw_user_meta_data->>'last_name', ''),
    COALESCE(au.raw_user_meta_data->>'role', 'user'),
    au.created_at,
    au.updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
  AND au.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Verify the fix
SELECT 
    'Users in auth.users' as table_name,
    COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
    'Users in public.users' as table_name,
    COUNT(*) as count
FROM public.users; 