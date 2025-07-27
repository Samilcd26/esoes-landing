-- =============================================
-- VERİTABANI TEMİZLİK & YENİDEN YAPILANDIRMA
-- Gereksiz tabloları, view'leri ve fonksiyonları siler,
-- gerekli olanları tekrar oluşturur.
-- =============================================

-- 1. Gereksiz fonksiyonları sil
DROP FUNCTION IF EXISTS public.get_department_personnel(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_all_department_personnel() CASCADE;
DROP FUNCTION IF EXISTS public.get_department_personnel_statistics() CASCADE;
DROP FUNCTION IF EXISTS public.toggle_personnel_status(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.refresh_users_with_department() CASCADE;

-- 2. Gereksiz view'leri sil
DROP VIEW IF EXISTS public.users_with_department CASCADE;

-- 3. Gereksiz tabloları sil
DROP TABLE IF EXISTS public.department_personnel CASCADE;

-- 4. Yeniden tanımlanacak fonksiyonları önceden sil
DROP FUNCTION IF EXISTS public.get_department_statistics() CASCADE;
DROP FUNCTION IF EXISTS public.get_department_members(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.assign_user_to_department(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.remove_user_from_department(UUID) CASCADE;

-- =============================================
-- FONKSİYONLARI YENİDEN OLUŞTUR
-- =============================================

-- Departman istatistikleri (gerçek kullanıcılar)
CREATE OR REPLACE FUNCTION public.get_department_statistics()
RETURNS TABLE (
    department_id UUID,
    department_name VARCHAR(255),
    member_count BIGINT,
    admin_count BIGINT,
    organizer_count BIGINT,
    user_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.name,
        COUNT(u.id) as member_count,
        COUNT(u.id) FILTER (WHERE u.role = 'admin') as admin_count,
        COUNT(u.id) FILTER (WHERE u.role = 'organizer') as organizer_count,
        COUNT(u.id) FILTER (WHERE u.role = 'user') as user_count
    FROM public.departments d
    LEFT JOIN public.users u ON d.id = u.department_id
    GROUP BY d.id, d.name
    ORDER BY d.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Departman üyelerini getir (gerçek kullanıcılar)
CREATE OR REPLACE FUNCTION public.get_department_members(dept_id UUID)
RETURNS TABLE (
    user_id UUID,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        u.avatar_url,
        u.created_at
    FROM public.users u
    WHERE u.department_id = dept_id
    ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcıyı departmana ata
CREATE OR REPLACE FUNCTION public.assign_user_to_department(user_id UUID, dept_id UUID)
RETURNS TEXT AS $$
DECLARE
    dept_name VARCHAR(255);
    user_email VARCHAR(255);
BEGIN
    SELECT name INTO dept_name FROM public.departments WHERE id = dept_id;
    IF dept_name IS NULL THEN
        RETURN 'Departman bulunamadı!';
    END IF;

    SELECT email INTO user_email FROM public.users WHERE id = user_id;
    IF user_email IS NULL THEN
        RETURN 'Kullanıcı bulunamadı!';
    END IF;

    UPDATE public.users 
    SET department_id = dept_id, updated_at = NOW()
    WHERE id = user_id;

    RETURN user_email || ' başarıyla ' || dept_name || ' departmanına atandı!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcıyı departmandan çıkar
CREATE OR REPLACE FUNCTION public.remove_user_from_department(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_email VARCHAR(255);
BEGIN
    SELECT email INTO user_email FROM public.users WHERE id = user_id;
    IF user_email IS NULL THEN
        RETURN 'Kullanıcı bulunamadı!';
    END IF;

    UPDATE public.users 
    SET department_id = NULL, updated_at = NOW()
    WHERE id = user_id;

    RETURN user_email || ' departmandan çıkarıldı!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- DOĞRULAMA SORGULARI
-- =============================================

-- Kalan tabloları listele
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'departments', 'events', 'event_registrations', 'faqs', 'contact_messages', 'uploaded_files')
ORDER BY tablename;

-- Kalan fonksiyonları listele
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
    AND routine_name LIKE '%department%'
ORDER BY routine_name;

-- Departman-kullanıcı ilişkilerini kontrol et
SELECT 
    d.name as department_name,
    COUNT(u.id) as user_count
FROM public.departments d
LEFT JOIN public.users u ON d.id = u.department_id
GROUP BY d.id, d.name
ORDER BY d.name;

-- =============================================
-- TEMİZLİK VE YENİDEN TANIMLAMA TAMAMLANDI ✅
-- =============================================
