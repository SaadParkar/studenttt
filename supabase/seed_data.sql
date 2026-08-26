-- ==============================================================================
-- CAMPUS OS - COMPLETE DEFENSIVE SEED DATA SCRIPT
-- Safely ensures all columns exist on tables before executing seed inserts
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. DEFENSIVE COLUMN UPGRADES (Prevents 42703 Missing Column Errors)
-- ------------------------------------------------------------------------------

-- Ensure all expected columns on public.lectures
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '1h 30m';
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS qr_secret TEXT DEFAULT uuid_generate_v4()::text;
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS building TEXT DEFAULT 'Tech Block B';
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 4;
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS start_time TEXT DEFAULT '09:00';
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS end_time TEXT DEFAULT '10:30';

-- Ensure all expected columns on public.assignments
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS faculty_name TEXT DEFAULT 'Dr. Sarah Jenkins';
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS due_time TEXT DEFAULT '23:59';
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS priority assignment_priority DEFAULT 'Medium';
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Ensure all expected columns on public.library_books
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS category book_category DEFAULT 'Textbook';
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS total_copies INTEGER DEFAULT 5;
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS available_copies INTEGER DEFAULT 5;

-- ------------------------------------------------------------------------------
-- 1. SEED DATA INSERTS
-- ------------------------------------------------------------------------------

-- 1.1 Insert Initial Sample Lectures
INSERT INTO public.lectures (id, code, title, room, building, start_time, end_time, duration, status, credits)
VALUES
  ('a0eeb109-158c-4730-a760-28bfa6d91d11', 'CS601', 'Advanced Data Structures & Algorithms', 'Lab 402', 'Tech Block B', '09:00', '10:30', '1h 30m', 'current', 4),
  ('b0eeb109-158c-4730-a760-28bfa6d91d22', 'CS602', 'Database Management Systems', 'Hall 101', 'Science Block A', '10:45', '12:15', '1h 30m', 'upcoming', 4),
  ('c0eeb109-158c-4730-a760-28bfa6d91d33', 'CS603', 'Operating Systems & System Kernel', 'Lab 205', 'Tech Block B', '13:00', '14:30', '1h 30m', 'upcoming', 3),
  ('d0eeb109-158c-4730-a760-28bfa6d91d44', 'CS604', 'Web Architecture & Cloud Infrastructure', 'Auditorium C', 'Main Admin Wing', '14:45', '16:15', '1h 30m', 'upcoming', 3)
ON CONFLICT (id) DO NOTHING;

-- 1.2 Insert Initial Assignments
INSERT INTO public.assignments (id, title, subject, faculty_name, due_date, due_time, priority, description)
VALUES
  ('e0eeb109-158c-4730-a760-28bfa6d91d55', 'B-Tree & Red-Black Tree Implementation', 'Data Structures', 'Dr. Sarah Jenkins', CURRENT_DATE + INTERVAL '1 day', '23:59', 'High', 'Implement a self-balancing Red-Black Tree in C++ or Java with deletion operations.'),
  ('f0eeb109-158c-4730-a760-28bfa6d91d66', 'Process Synchronization & Semaphores', 'Operating Systems', 'Prof. Alan Turing', CURRENT_DATE + INTERVAL '3 days', '23:59', 'Medium', 'Write a report analyzing the Dining Philosophers problem using POSIX semaphores.'),
  ('g0eeb109-158c-4730-a760-28bfa6d91d77', 'PostgreSQL Query Optimization & Indexing', 'DBMS', 'Prof. Michael Stone', CURRENT_DATE + INTERVAL '5 days', '23:59', 'Low', 'Optimize a 1-million-row SQL join using EXPLAIN ANALYZE and B-Tree indexes.')
ON CONFLICT (id) DO NOTHING;

-- 1.3 Insert Initial Library Books
INSERT INTO public.library_books (id, title, author, cover_image, category, total_copies, available_copies)
VALUES
  ('h0eeb109-158c-4730-a760-28bfa6d91d88', 'Introduction to Algorithms (4th Ed.)', 'Cormen, Leiserson, Rivest', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300', 'Textbook', 8, 4),
  ('i0eeb109-158c-4730-a760-28bfa6d91d99', 'Operating System Concepts (10th Ed.)', 'Silberschatz, Galvin', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300', 'Textbook', 6, 2),
  ('j0eeb109-158c-4730-a760-28bfa6d91d00', 'Clean Architecture: A Craftsman Guide', 'Robert C. Martin', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', 'E-book', 10, 7)
ON CONFLICT (id) DO NOTHING;
