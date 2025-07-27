-- =============================================
-- İlk Admin Kullanıcı Oluşturma Script'i
-- =============================================

-- NOT: Bu script'i çalıştırmadan önce, kullanıcı Supabase Auth sistemi üzerinden
-- kayıt olmalı veya aşağıdaki bilgilerle manuel olarak oluşturulmalıdır.

-- 1. ADIM: Supabase Dashboard'da Authentication > Users seçin
-- 2. ADIM: "Add User" butonuna tıklayın
-- 3. ADIM: Aşağıdaki bilgileri girin:
--    - Email: admin@esoes.com (veya kendi email adresiniz)
--    - Password: güvenli bir şifre
--    - Confirm Password: aynı şifre
--    - Auto Confirm User: true (işaretleyin)

-- 4. ADIM: Bu script'i çalıştırarak kullanıcıyı admin yapın

-- =============================================
-- MANUEL ADMIN KULLANICI OLUŞTURMA
-- =============================================

-- Aşağıdaki bilgileri kendi bilgilerinizle değiştirin:
DO $$ 
DECLARE
    admin_email VARCHAR(255) := 'admin@esoes.com'; -- Buraya kendi email adresinizi yazın
    admin_first_name VARCHAR(100) := 'Admin'; -- Buraya adınızı yazın
    admin_last_name VARCHAR(100) := 'User'; -- Buraya soyadınızı yazın
    user_uuid UUID;
BEGIN
    -- Kullanıcının UUID'sini al
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = admin_email;
    
    -- Eğer kullanıcı bulunamazsa hata ver
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'Kullanıcı bulunamadı: %. Lütfen önce Supabase Auth üzerinden kullanıcı oluşturun.', admin_email;
    END IF;
    
    -- Kullanıcının public.users tablosundaki kaydını güncelle
    UPDATE public.users 
    SET 
        role = 'admin',
        first_name = admin_first_name,
        last_name = admin_last_name,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    -- Eğer kullanıcı public.users tablosunda yoksa oluştur
    IF NOT FOUND THEN
        INSERT INTO public.users (id, email, first_name, last_name, role)
        VALUES (user_uuid, admin_email, admin_first_name, admin_last_name, 'admin');
    END IF;
    
    -- Kullanıcının auth.users tablosundaki metadata'sını güncelle
    UPDATE auth.users 
    SET 
        raw_user_meta_data = raw_user_meta_data || jsonb_build_object(
            'role', 'admin',
            'first_name', admin_first_name,
            'last_name', admin_last_name
        )
    WHERE id = user_uuid;
    
    RAISE NOTICE 'Admin kullanıcı başarıyla oluşturuldu: %', admin_email;
END $$;

-- =============================================
-- ADMIN KULLANICI DOĞRULAMA
-- =============================================

-- Admin kullanıcının doğru şekilde oluşturulduğunu kontrol et
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
FROM public.users 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- =============================================
-- OPSIYONEL: DAHA FAZLA ADMIN KULLANICI EKLEME
-- =============================================

-- Başka admin kullanıcılar eklemek isterseniz, aşağıdaki örneği kullanabilirsiniz:
-- (Önce bu kullanıcıların Supabase Auth'da kayıtlı olması gerekir)

/*
-- Örnek: Organizer rolü verme
UPDATE public.users 
SET role = 'organizer' 
WHERE email = 'organizer@esoes.com';

-- Örnek: Birden fazla kullanıcıyı admin yapma
UPDATE public.users 
SET role = 'admin' 
WHERE email IN ('admin1@esoes.com', 'admin2@esoes.com');
*/

-- =============================================
-- GÜVENLIK NOTU
-- =============================================

-- NOT: Bu script'i çalıştırdıktan sonra, admin paneline erişebilirsiniz:
-- 1. Uygulamaya giriş yapın
-- 2. /admin rotasına gidin
-- 3. Admin paneli açılacaktır

-- ÖNEMLI: Bu script'i production ortamında çalıştırmadan önce,
-- email adresini ve diğer bilgileri kontrol edin! 