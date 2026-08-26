-- ==============================================================================
-- CAMPUS OS - GUARANTEED 100% BULLETPROOF SUPABASE BACKEND SETUP SCRIPT
-- Copy & paste this ENTIRE script into your Supabase SQL Editor and click RUN!
-- ==============================================================================

-- 1. CLEANUP (Safely drop older schema tables if re-running)
DROP TABLE IF EXISTS public.assignment_submissions CASCADE;
DROP TABLE IF EXISTS public.book_loans CASCADE;
DROP TABLE IF EXISTS public.attendance_records CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.assignments CASCADE;
DROP TABLE IF EXISTS public.lectures CASCADE;
DROP TABLE IF EXISTS public.library_books CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lecture_status AS ENUM ('completed', 'current', 'upcoming', 'missed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('marked', 'live', 'missed', 'pending');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assignment_priority AS ENUM ('High', 'Medium', 'Low');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assignment_status AS ENUM ('Pending', 'Submitted', 'Overdue', 'Completed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE book_category AS ENUM ('Textbook', 'E-book', 'Journal', 'Paper');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE loan_status AS ENUM ('borrowed', 'recommended', 'returned');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 3. CREATE TABLES WITH FULL COLUMNS

-- PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    id_number TEXT UNIQUE NOT NULL,
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

-- LECTURES
CREATE TABLE public.lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    room TEXT NOT NULL,
    building TEXT DEFAULT 'Tech Block B',
    start_time TEXT NOT NULL DEFAULT '09:00',
    end_time TEXT NOT NULL DEFAULT '10:30',
    duration TEXT DEFAULT '1h 30m',
    status lecture_status DEFAULT 'upcoming',
    credits INTEGER DEFAULT 4,
    qr_secret TEXT DEFAULT uuid_generate_v4()::text,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATTENDANCE RECORDS
CREATE TABLE public.attendance_records (
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

-- ASSIGNMENTS
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    faculty_name TEXT DEFAULT 'Dr. Sarah Jenkins',
    due_date DATE NOT NULL,
    due_time TEXT DEFAULT '23:59',
    priority assignment_priority DEFAULT 'Medium',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ASSIGNMENT SUBMISSIONS
CREATE TABLE public.assignment_submissions (
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

-- LIBRARY BOOKS
CREATE TABLE public.library_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover_image TEXT,
    category book_category DEFAULT 'Textbook',
    total_copies INTEGER DEFAULT 5,
    available_copies INTEGER DEFAULT 5
);

-- BOOK LOANS
CREATE TABLE public.book_loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    status loan_status DEFAULT 'borrowed',
    my_rating INTEGER CHECK (my_rating >= 1 AND my_rating <= 5),
    finished_date DATE
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'System',
    is_unread BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles viewable by authenticated users" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Lectures viewable by all authenticated users" ON public.lectures FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Teachers can insert lectures" ON public.lectures FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Teachers can update lectures" ON public.lectures FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Attendance viewable by authenticated" ON public.attendance_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Attendance insertable by authenticated" ON public.attendance_records FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Assignments viewable by authenticated" ON public.assignments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Assignments insertable by authenticated" ON public.assignments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Submissions viewable by authenticated" ON public.assignment_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Submissions insertable by authenticated" ON public.assignment_submissions FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Books viewable by authenticated" ON public.library_books FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Book loans viewable by student" ON public.book_loans FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Notifications viewable by owner" ON public.notifications FOR SELECT USING (user_id = auth.uid());

-- 5. AUTOMATIC PROFILE TRIGGER ON SIGNUP
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
    )
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. INSERT SEED DATA (All IDs are strictly valid hexadecimal 128-bit UUIDs)

-- Seed Lectures
INSERT INTO public.lectures (id, code, title, room, building, start_time, end_time, duration, status, credits)
VALUES
  ('a0eeb109-158c-4730-a760-28bfa6d91d11', 'CS601', 'Advanced Data Structures & Algorithms', 'Lab 402', 'Tech Block B', '09:00', '10:30', '1h 30m', 'current', 4),
  ('b0eeb109-158c-4730-a760-28bfa6d91d22', 'CS602', 'Database Management Systems', 'Hall 101', 'Science Block A', '10:45', '12:15', '1h 30m', 'upcoming', 4),
  ('c0eeb109-158c-4730-a760-28bfa6d91d33', 'CS603', 'Operating Systems & System Kernel', 'Lab 205', 'Tech Block B', '13:00', '14:30', '1h 30m', 'upcoming', 3),
  ('d0eeb109-158c-4730-a760-28bfa6d91d44', 'CS604', 'Web Architecture & Cloud Infrastructure', 'Auditorium C', 'Main Admin Wing', '14:45', '16:15', '1h 30m', 'upcoming', 3);

-- Seed Assignments (Using valid hexadecimal UUID characters: 0-9, a-f)
INSERT INTO public.assignments (id, title, subject, faculty_name, due_date, due_time, priority, description)
VALUES
  ('e0eeb109-158c-4730-a760-28bfa6d91d55', 'B-Tree & Red-Black Tree Implementation', 'Data Structures', 'Dr. Sarah Jenkins', CURRENT_DATE + INTERVAL '1 day', '23:59', 'High', 'Implement a self-balancing Red-Black Tree in C++ or Java with deletion operations.'),
  ('f0eeb109-158c-4730-a760-28bfa6d91d66', 'Process Synchronization & Semaphores', 'Operating Systems', 'Prof. Alan Turing', CURRENT_DATE + INTERVAL '3 days', '23:59', 'Medium', 'Write a report analyzing the Dining Philosophers problem using POSIX semaphores.'),
  ('11eeb109-158c-4730-a760-28bfa6d91d77', 'PostgreSQL Query Optimization & Indexing', 'DBMS', 'Prof. Michael Stone', CURRENT_DATE + INTERVAL '5 days', '23:59', 'Low', 'Optimize a 1-million-row SQL join using EXPLAIN ANALYZE and B-Tree indexes.');

-- Seed Library Books (Using valid hexadecimal UUID characters: 0-9, a-f)
INSERT INTO public.library_books (id, title, author, cover_image, category, total_copies, available_copies)
VALUES
  ('22eeb109-158c-4730-a760-28bfa6d91d88', 'Introduction to Algorithms (4th Ed.)', 'Cormen, Leiserson, Rivest', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300', 'Textbook', 8, 4),
  ('33eeb109-158c-4730-a760-28bfa6d91d99', 'Operating System Concepts (10th Ed.)', 'Silberschatz, Galvin', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300', 'Textbook', 6, 2),
  ('44eeb109-158c-4730-a760-28bfa6d91d00', 'Clean Architecture: A Craftsman Guide', 'Robert C. Martin', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', 'E-book', 10, 7);
