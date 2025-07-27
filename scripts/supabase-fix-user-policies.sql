-- =============================================
-- KULLANICI ROL SİSTEMİ DÜZELTMESİ
-- =============================================

-- Önce mevcut problem politikayı kaldır
DROP POLICY IF EXISTS "Only admins can insert users" ON public.users;

-- Yeni politikalar - daha esnek
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Trigger'ın çalışması için INSERT politikası
CREATE POLICY "Allow user creation via trigger" ON public.users
    FOR INSERT WITH CHECK (true);

-- Sadece admin'ler başka kullanıcıların rollerini değiştirebilir
CREATE POLICY "Only admins can change user roles" ON public.users
    FOR UPDATE USING (
        -- Kendi profilini güncelleyebilir VEYA admin ise
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    )
    WITH CHECK (
        -- Rol değiştirmiyorsa herkes güncelleyebilir
        -- Rol değiştiriyorsa sadece admin
        (OLD.role = NEW.role) OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =============================================
-- MANUEL ADMIN KULLANICI OLUŞTURMA
-- =============================================

-- İlk admin kullanıcıyı oluşturmak için bu adımları takip edin:
-- 1. Supabase Dashboard → Authentication → Users
-- 2. "Add User" butonuna tıklayın
-- 3. Email ve password girin
-- 4. Kullanıcı oluşturulduktan sonra, aşağıdaki SQL'i çalıştırın:

-- KULLANICI ID'SİNİ BURAYA YAZIP ÇALIŞTIRIN:
-- UPDATE public.users 
-- SET role = 'admin' 
-- WHERE email = 'admin@example.com';

-- =============================================
-- KULLANICI ROLÜ KONTROL ETME
-- =============================================

-- Mevcut kullanıcıları ve rollerini görmek için:
-- SELECT id, email, first_name, last_name, role, created_at 
-- FROM public.users 
-- ORDER BY created_at DESC;

-- Belirli bir kullanıcının rolünü değiştirmek için:
-- UPDATE public.users 
-- SET role = 'admin'  -- veya 'organizer' veya 'user'
-- WHERE email = 'kullanici@example.com';

-- =============================================
-- OTOMATIK TRIGGER KONTROLÜ
-- =============================================

-- Trigger'ın çalışıp çalışmadığını kontrol etmek için:
-- SELECT 
--     au.id,
--     au.email as auth_email,
--     au.created_at as auth_created,
--     pu.email as public_email,
--     pu.role,
--     pu.created_at as public_created
-- FROM auth.users au
-- LEFT JOIN public.users pu ON au.id = pu.id
-- ORDER BY au.created_at DESC
-- LIMIT 10;

-- =============================================
-- HIZLI ADMIN OLUŞTURMA FONKSİYONU
-- =============================================

CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    user_count INTEGER;
BEGIN
    -- Kullanıcı var mı kontrol et
    SELECT COUNT(*) INTO user_count
    FROM public.users
    WHERE email = user_email;
    
    IF user_count = 0 THEN
        RETURN 'Hata: ' || user_email || ' email adresli kullanıcı bulunamadı!';
    END IF;
    
    -- Kullanıcıyı admin yap
    UPDATE public.users
    SET role = 'admin'
    WHERE email = user_email;
    
    RETURN 'Başarılı: ' || user_email || ' artık admin!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanım örneği:
-- SELECT public.make_user_admin('admin@example.com');

-- =============================================
-- HIZLI ORGANIZER OLUŞTURMA FONKSİYONU
-- =============================================

CREATE OR REPLACE FUNCTION public.make_user_organizer(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    user_count INTEGER;
BEGIN
    -- Kullanıcı var mı kontrol et
    SELECT COUNT(*) INTO user_count
    FROM public.users
    WHERE email = user_email;
    
    IF user_count = 0 THEN
        RETURN 'Hata: ' || user_email || ' email adresli kullanıcı bulunamadı!';
    END IF;
    
    -- Kullanıcıyı organizer yap
    UPDATE public.users
    SET role = 'organizer'
    WHERE email = user_email;
    
    RETURN 'Başarılı: ' || user_email || ' artık organizer!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanım örneği:
-- SELECT public.make_user_organizer('organizer@example.com'); 