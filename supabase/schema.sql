-- ==============================================================================
-- CAMPUS OS - SUPABASE DATABASE BACKEND SCHEMA & RLS POLICIES
-- Supports: Student Mobile App & Teacher Portal (Multi-role Architecture)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- STEP 1: ENUMS & EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE lecture_status AS ENUM ('completed', 'current', 'upcoming', 'missed');
CREATE TYPE attendance_status AS ENUM ('marked', 'live', 'missed', 'pending');
CREATE TYPE assignment_priority AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE assignment_status AS ENUM ('Pending', 'Submitted', 'Overdue', 'Completed');
CREATE TYPE book_category AS ENUM ('Textbook', 'E-book', 'Journal', 'Paper');
CREATE TYPE loan_status AS ENUM ('borrowed', 'recommended', 'returned');

-- ------------------------------------------------------------------------------
-- STEP 2: TABLES
-- ------------------------------------------------------------------------------

-- 2.1 PROFILES (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    id_number TEXT UNIQUE NOT NULL, -- Student Roll No or Employee ID
    college_name TEXT DEFAULT 'Global Institute of Technology',
    department TEXT DEFAULT 'Computer Science & Engineering',
    semester TEXT DEFAULT 'Semester 6',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    overall_attendance NUMERIC DEFAULT 92.0,
    cgpa NUMERIC DEFAULT 3.88,
    total_credits INTEGER DEFAULT 114,
    required_credits INTEGER DEFAULT 140,
    class_rank INTEGER DEFAULT 5,
    scholarship_eligible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 LECTURES / TIMETABLE (Managed by Teachers, Viewed by Students)
CREATE TABLE IF NOT EXISTS public.lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    code TEXT NOT NULL, -- e.g. CS601
    title TEXT NOT NULL, -- e.g. Advanced Data Structures
    room TEXT NOT NULL, -- e.g. Lab 402
    building TEXT DEFAULT 'Tech Block B',
    start_time TEXT NOT NULL, -- e.g. 09:00
    end_time TEXT NOT NULL, -- e.g. 10:30
    duration TEXT DEFAULT '1h 30m',
    status lecture_status DEFAULT 'upcoming',
    credits INTEGER DEFAULT 4,
    qr_secret TEXT DEFAULT uuid_generate_v4()::text, -- Secret token for live QR verification
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 ATTENDANCE RECORDS (Scan Logs)
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT,
    roll_no TEXT,
    method TEXT DEFAULT 'qr',
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    qr_payload TEXT NOT NULL,
    status attendance_status DEFAULT 'marked',
    device_info TEXT,
    is_offline_synced BOOLEAN DEFAULT FALSE,
    UNIQUE(lecture_id, student_id)
);

-- 2.4 ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    faculty_name TEXT NOT NULL,
    due_date DATE NOT NULL,
    due_time TEXT DEFAULT '23:59',
    priority assignment_priority DEFAULT 'Medium',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 ASSIGNMENT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status assignment_status DEFAULT 'Pending',
    readiness_percentage INTEGER DEFAULT 0,
    submission_file_url TEXT,
    submitted_at TIMESTAMPTZ,
    marks_awarded NUMERIC,
    teacher_feedback TEXT,
    UNIQUE(assignment_id, student_id)
);

-- 2.6 LIBRARY BOOKS
CREATE TABLE IF NOT EXISTS public.library_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover_image TEXT,
    category book_category DEFAULT 'Textbook',
    total_copies INTEGER DEFAULT 5,
    available_copies INTEGER DEFAULT 5
);

-- 2.7 BOOK LOANS
CREATE TABLE IF NOT EXISTS public.book_loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    status loan_status DEFAULT 'borrowed',
    my_rating INTEGER CHECK (my_rating >= 1 AND my_rating <= 5),
    finished_date DATE
);

-- 2.8 NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'System',
    is_unread BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- STEP 3: ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3.1 Profiles RLS
CREATE POLICY "Public profiles viewable by authenticated users"
    ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3.2 Lectures RLS
CREATE POLICY "Lectures viewable by all authenticated users"
    ON public.lectures FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers can insert lectures"
    ON public.lectures FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    ));

CREATE POLICY "Teachers can update their lectures"
    ON public.lectures FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    ));

-- 3.3 Attendance Records RLS
CREATE POLICY "Students view own attendance, Teachers view all"
    ON public.attendance_records FOR SELECT
    USING (
        student_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin'))
    );

CREATE POLICY "Students and Teachers can insert attendance"
    ON public.attendance_records FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 3.4 Assignments RLS
CREATE POLICY "Assignments viewable by all"
    ON public.assignments FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers can create assignments"
    ON public.assignments FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    ));

-- 3.5 Assignment Submissions RLS
CREATE POLICY "Submissions viewable by student or teacher"
    ON public.assignment_submissions FOR SELECT
    USING (
        student_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin'))
    );

CREATE POLICY "Students can submit assignments"
    ON public.assignment_submissions FOR INSERT
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students and Teachers can update submissions"
    ON public.assignment_submissions FOR UPDATE
    USING (
        student_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin'))
    );

-- 3.6 Notifications RLS
CREATE POLICY "Users view own notifications"
    ON public.notifications FOR SELECT USING (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- STEP 4: AUTOMATIC USER CREATION TRIGGER
-- Automatically populates public.profiles when a new user signs up in Supabase Auth
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, id_number)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student User'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
        COALESCE(NEW.raw_user_meta_data->>'id_number', 'STU-' || SUBSTRING(NEW.id::text, 1, 6))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- STEP 5: SAMPLE SEED DATA FOR TESTING (TEACHER & STUDENT)
-- ------------------------------------------------------------------------------

-- Seed sample library books
INSERT INTO public.library_books (title, author, cover_image, category, total_copies, available_copies)
VALUES
('Introduction to Algorithms (4th Ed.)', 'Cormen, Leiserson, Rivest', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300', 'Textbook', 8, 4),
('Operating System Concepts', 'Silberschatz, Galvin, Gagne', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300', 'Textbook', 6, 2),
('Clean Code: Agile Software Craftsmanship', 'Robert C. Martin', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', 'E-book', 10, 7)
ON CONFLICT DO NOTHING;
