-- =============================================
-- ESOES Landing Page Database Schema
-- Supabase PostgreSQL Database
-- =============================================

-- Drop existing objects (for idempotent execution)
-- Drop functions with CASCADE to remove all dependencies
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.increment_event_registration_count(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.decrement_event_registration_count(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_event_statistics() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS public.uploaded_files CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;
DROP TABLE IF EXISTS public.event_registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Enable necessary extensions (these should already be available in Supabase image)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- USERS TABLE
-- =============================================
-- Bu tablo Supabase Auth ile entegre çalışır
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'organizer')),
    avatar_url TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url TEXT,
    capacity INTEGER NOT NULL DEFAULT 0 CHECK (capacity >= 0),
    registered_count INTEGER NOT NULL DEFAULT 0 CHECK (registered_count >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date > start_date),
    CONSTRAINT valid_capacity CHECK (registered_count <= capacity)
);

-- =============================================
-- EVENT_REGISTRATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Bir kullanıcı aynı etkinliğe birden fazla kayıt olamaz
    UNIQUE(event_id, user_id)
);

-- =============================================
-- DEPARTMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- FAQS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- CONTACT_MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- UPLOADED_FILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.uploaded_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('image', 'video')),
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    compressed_size BIGINT,
    width INTEGER,
    height INTEGER,
    duration INTEGER, -- video duration in seconds
    r2_bucket VARCHAR(100) NOT NULL,
    r2_key VARCHAR(500) NOT NULL,
    cdn_url TEXT NOT NULL,
    is_compressed BOOLEAN DEFAULT false,
    compression_ratio DECIMAL(5,2),
    status VARCHAR(20) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================
-- INDEXES
-- =============================================
-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_status_start_date ON public.events(status, start_date);

-- Event registrations indexes
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_department_id ON public.users(department_id);

-- FAQs indexes
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON public.faqs(order_index);

-- Contact messages indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at);

-- Uploaded files indexes
CREATE INDEX IF NOT EXISTS idx_uploaded_files_user_id ON public.uploaded_files(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_file_type ON public.uploaded_files(file_type);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_status ON public.uploaded_files(status);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_created_at ON public.uploaded_files(created_at);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_r2_key ON public.uploaded_files(r2_key);

-- =============================================
-- TRIGGERS FOR updated_at
-- =============================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER handle_updated_at_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_events
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_departments
    BEFORE UPDATE ON public.departments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_faqs
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_contact_messages
    BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_uploaded_files
    BEFORE UPDATE ON public.uploaded_files
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- RPC FUNCTIONS
-- =============================================
-- Function to increment event registration count
CREATE OR REPLACE FUNCTION public.increment_event_registration_count(event_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.events 
    SET registered_count = registered_count + 1 
    WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement event registration count
CREATE OR REPLACE FUNCTION public.decrement_event_registration_count(event_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.events 
    SET registered_count = GREATEST(registered_count - 1, 0) 
    WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get event statistics
CREATE OR REPLACE FUNCTION public.get_event_statistics()
RETURNS TABLE (
    total_events BIGINT,
    published_events BIGINT,
    draft_events BIGINT,
    cancelled_events BIGINT,
    total_registrations BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE status = 'published') as published_events,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_events,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_events,
        COALESCE(SUM(registered_count), 0) as total_registrations
    FROM public.events;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get department statistics
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

-- Function to get department members
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

-- Function to assign user to department
CREATE OR REPLACE FUNCTION public.assign_user_to_department(user_id UUID, dept_id UUID)
RETURNS TEXT AS $$
DECLARE
    dept_name VARCHAR(255);
    user_email VARCHAR(255);
BEGIN
    -- Check if department exists
    SELECT name INTO dept_name FROM public.departments WHERE id = dept_id;
    IF dept_name IS NULL THEN
        RETURN 'Departman bulunamadı!';
    END IF;
    
    -- Check if user exists
    SELECT email INTO user_email FROM public.users WHERE id = user_id;
    IF user_email IS NULL THEN
        RETURN 'Kullanıcı bulunamadı!';
    END IF;
    
    -- Assign user to department
    UPDATE public.users 
    SET department_id = dept_id, updated_at = NOW()
    WHERE id = user_id;
    
    RETURN user_email || ' başarıyla ' || dept_name || ' departmanına atandı!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove user from department
CREATE OR REPLACE FUNCTION public.remove_user_from_department(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_email VARCHAR(255);
BEGIN
    -- Check if user exists
    SELECT email INTO user_email FROM public.users WHERE id = user_id;
    IF user_email IS NULL THEN
        RETURN 'Kullanıcı bulunamadı!';
    END IF;
    
    -- Remove user from department
    UPDATE public.users 
    SET department_id = NULL, updated_at = NOW()
    WHERE id = user_id;
    
    RETURN user_email || ' departmandan çıkarıldı!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECURITY POLICIES
-- =============================================

-- Users policies
CREATE POLICY "Users can view all users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Only admins can insert users" ON public.users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

-- Events policies
CREATE POLICY "Everyone can view published events" ON public.events
    FOR SELECT USING (
        status = 'published' OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

CREATE POLICY "Only admins can manage events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

-- Event registrations policies
CREATE POLICY "Users can view own registrations" ON public.event_registrations
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

CREATE POLICY "Users can manage own registrations" ON public.event_registrations
    FOR ALL USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

-- Departments policies
CREATE POLICY "Everyone can view departments" ON public.departments
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage departments" ON public.departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

-- FAQs policies
CREATE POLICY "Everyone can view FAQs" ON public.faqs
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage FAQs" ON public.faqs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

-- Contact messages policies
CREATE POLICY "Everyone can insert contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages" ON public.contact_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

CREATE POLICY "Only admins can update contact messages" ON public.contact_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

-- Uploaded files policies
CREATE POLICY "Users can view own uploaded files" ON public.uploaded_files
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

CREATE POLICY "Users can upload files" ON public.uploaded_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own uploaded files" ON public.uploaded_files
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

CREATE POLICY "Users can delete own uploaded files" ON public.uploaded_files
    FOR DELETE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'organizer')
        )
    );

-- =============================================
-- TRIGGER FOR USER CREATION
-- =============================================
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- User already exists, just return
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log the error but don't fail the auth process
        RAISE WARNING 'Failed to create user profile: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SAMPLE DATA (Optional)
-- =============================================
-- Insert sample departments
INSERT INTO public.departments (name, description) VALUES 
    ('Yazılım Geliştirme', 'Yazılım projeleri ve teknoloji etkinlikleri'),
    ('Proje Yönetimi', 'Proje planlama ve yönetim süreçleri'),
    ('Sosyal Aktiviteler', 'Sosyal etkinlikler ve networking')
ON CONFLICT (name) DO NOTHING;

-- Insert sample FAQs
INSERT INTO public.faqs (question, answer, category, order_index) VALUES 
    ('ESOES nedir?', 'ESOES, öğrenciler için sosyal ve eğitim odaklı etkinlikler düzenleyen bir kulüptür.', 'genel', 1),
    ('Etkinliklere nasıl katılabilirim?', 'Web sitemizden etkinlik takvimini görüntüleyebilir ve kayıt olabilirsiniz.', 'etkinlik', 2),
    ('Üyelik ücreti var mı?', 'Hayır, kulübümüze üyelik ve etkinliklerimiz ücretsizdir.', 'genel', 3)
ON CONFLICT DO NOTHING;

-- =============================================
-- GRANTS (Public Access)
-- =============================================
-- Grant usage to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant usage to anonymous users (for public content)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.departments TO anon;
GRANT SELECT ON public.faqs TO anon;
GRANT INSERT ON public.contact_messages TO anon;

-- =============================================
-- SCHEMA CREATION COMPLETED
-- =============================================
-- Database schema has been created successfully!
-- Next steps:
-- 1. Run this script in your Supabase SQL Editor
-- 2. Verify all tables are created
-- 3. Test the RLS policies
-- 4. Add any additional sample data if needed 