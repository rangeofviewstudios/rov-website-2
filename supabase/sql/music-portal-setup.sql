-- Music portal: schema additions + policy cleanup for the five client-work
-- tables (profiles, projects, audio_tracks, mixed_audio_tracks,
-- mixed_track_revisions) and the two audio buckets.
--
-- Written against the live schema on 2026-09-21. Safe to run more than once.
-- Touches nothing under ctrla_*, credits, daily, predictions, or brand kits.
--
-- End state per table: one SELECT rule for clients, the minimum write rules
-- clients actually need, and one is_staff() rule for everything else. Every
-- DROP below removes a rule that is fully covered by one that stays.

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────
-- 1. New columns the portal reads
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS songs_included integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS revisions_included integer NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS closed_at timestamptz;

ALTER TABLE public.mixed_audio_tracks
  ADD COLUMN IF NOT EXISTS notes text;

-- ─────────────────────────────────────────────────────────────────────────
-- 2. profiles
--    Keep:  "Staff can view all profiles"     SELECT  is_staff() OR own row
--           "Users can update own profile"    UPDATE  own row
--           "Admins can update all profiles"  UPDATE  is_admin()  (role changes)
-- ─────────────────────────────────────────────────────────────────────────
-- Covered by "Staff can view all profiles" (which already includes own row).
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "admins view all profiles" ON public.profiles;
-- Identical to "Users can update own profile".
DROP POLICY IF EXISTS "update own community profile" ON public.profiles;

-- ─────────────────────────────────────────────────────────────────────────
-- 3. projects
-- ─────────────────────────────────────────────────────────────────────────
-- Old admin-only rule. Engineers were locked out of launching or editing
-- projects. Replaced by a staff rule below.
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.projects;
DROP POLICY IF EXISTS "Staff can manage projects" ON public.projects;
CREATE POLICY "Staff can manage projects" ON public.projects
  FOR ALL USING (is_staff()) WITH CHECK (is_staff());

-- Staff launch projects, clients never create their own.
DROP POLICY IF EXISTS "Clients can create their own project" ON public.projects;

-- Keep "Clients can view their own projects" and "Clients can update their
-- own project" as they are, but fence the update: a client may only flip
-- agreements_signed. Everything else on the row (status, invoice_paid,
-- songs_included, revisions_included, closed_at ...) is staff-only.
CREATE OR REPLACE FUNCTION public.guard_client_project_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF is_staff() THEN
    RETURN NEW;
  END IF;
  IF to_jsonb(NEW) - 'agreements_signed' IS DISTINCT FROM to_jsonb(OLD) - 'agreements_signed' THEN
    RAISE EXCEPTION 'Clients may only update agreements_signed on a project.';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS tr_guard_client_project_update ON public.projects;
CREATE TRIGGER tr_guard_client_project_update
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.guard_client_project_update();

-- ─────────────────────────────────────────────────────────────────────────
-- 4. audio_tracks (stems the client uploads)
--    Keep:  "clients view own tracks"        SELECT  own
--           "clients insert own tracks"      INSERT  own
--           "Staff can manage audio tracks"  ALL     is_staff()
-- ─────────────────────────────────────────────────────────────────────────
-- Both covered by "Staff can manage audio tracks".
DROP POLICY IF EXISTS "admins view all tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "admins delete any track" ON public.audio_tracks;

-- Replace the hardcoded "6 per client" trigger with one that reads the
-- client's current project. Falls back to 6 when no project exists yet so
-- nothing gets stricter for people already mid-flow. Staff bypass it.
DROP TRIGGER IF EXISTS tr_check_audio_track_limit ON public.audio_tracks;
DROP FUNCTION IF EXISTS public.check_audio_track_limit();

CREATE OR REPLACE FUNCTION public.check_stem_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  allowed integer;
  used integer;
  is_closed boolean;
BEGIN
  IF is_staff() THEN
    RETURN NEW;
  END IF;

  SELECT p.songs_included, p.closed_at IS NOT NULL
    INTO allowed, is_closed
  FROM public.projects p
  WHERE p.client_id = NEW.client_id
  ORDER BY p.created_at DESC
  LIMIT 1;

  IF is_closed THEN
    RAISE EXCEPTION 'This project is closed. No further uploads.';
  END IF;

  allowed := COALESCE(allowed, 6);
  SELECT count(*) INTO used FROM public.audio_tracks WHERE client_id = NEW.client_id;

  IF used >= allowed THEN
    RAISE EXCEPTION 'Your project covers % song(s). Reach out to add more.', allowed;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS tr_check_stem_limit ON public.audio_tracks;
CREATE TRIGGER tr_check_stem_limit
  BEFORE INSERT ON public.audio_tracks
  FOR EACH ROW EXECUTE FUNCTION public.check_stem_limit();

-- ─────────────────────────────────────────────────────────────────────────
-- 5. mixed_audio_tracks (mixes staff send back)
--    Keep:  "Clients can only view their own mixed tracks"  SELECT  own
--           "Staff can manage mixed tracks"                 ALL     is_staff()
-- ─────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins have full access to mixed_audio_tracks" ON public.mixed_audio_tracks;

-- ─────────────────────────────────────────────────────────────────────────
-- 6. mixed_track_revisions (client change requests)
--    Keep:  "Staff can manage revisions"  ALL  is_staff()
-- ─────────────────────────────────────────────────────────────────────────
-- Both admin-only and covered by the staff rule.
DROP POLICY IF EXISTS "Admins can view all revisions" ON public.mixed_track_revisions;
DROP POLICY IF EXISTS "admin_final_fix" ON public.mixed_track_revisions;

-- Was ALL: clients could edit or delete a request after staff had read it.
-- Now: read your own, create your own, nothing else.
DROP POLICY IF EXISTS "Users can manage their own revisions" ON public.mixed_track_revisions;
DROP POLICY IF EXISTS "Clients view own revisions" ON public.mixed_track_revisions;
CREATE POLICY "Clients view own revisions" ON public.mixed_track_revisions
  FOR SELECT USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "Clients request own revisions" ON public.mixed_track_revisions;
CREATE POLICY "Clients request own revisions" ON public.mixed_track_revisions
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Server-side revision cap, mirroring the stem cap. Staff bypass.
CREATE OR REPLACE FUNCTION public.check_revision_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  allowed integer;
  used integer;
  is_closed boolean;
BEGIN
  IF is_staff() THEN
    RETURN NEW;
  END IF;

  SELECT p.revisions_included, p.closed_at IS NOT NULL
    INTO allowed, is_closed
  FROM public.projects p WHERE p.id = NEW.project_id;

  IF is_closed THEN
    RAISE EXCEPTION 'This project is closed. Revisions are no longer open.';
  END IF;

  SELECT count(*) INTO used FROM public.mixed_track_revisions WHERE project_id = NEW.project_id;
  IF used >= COALESCE(allowed, 2) THEN
    RAISE EXCEPTION 'All % included revision(s) have been used.', COALESCE(allowed, 2);
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS tr_check_revision_limit ON public.mixed_track_revisions;
CREATE TRIGGER tr_check_revision_limit
  BEFORE INSERT ON public.mixed_track_revisions
  FOR EACH ROW EXECUTE FUNCTION public.check_revision_limit();

-- ─────────────────────────────────────────────────────────────────────────
-- 7. Dead helper
-- ─────────────────────────────────────────────────────────────────────────
-- Duplicate of is_admin(). Its only user was "admin_final_fix", dropped above.
DROP FUNCTION IF EXISTS public.check_is_admin();

-- ─────────────────────────────────────────────────────────────────────────
-- 8. Storage
--    Keep:  "auth users upload audio"  INSERT  audio-tracks, signed in
--           "public read audio"        SELECT  audio-tracks (bucket is public)
--           the three signed-documents rules (admin write, public read)
-- ─────────────────────────────────────────────────────────────────────────
-- Staff could delete the database row for a stem but not the file behind it,
-- so the admin delete button left orphans in the bucket.
DROP POLICY IF EXISTS "Staff manage audio files" ON storage.objects;
CREATE POLICY "Staff manage audio files"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'audio-tracks' AND is_staff())
  WITH CHECK (bucket_id = 'audio-tracks' AND is_staff());

COMMIT;
