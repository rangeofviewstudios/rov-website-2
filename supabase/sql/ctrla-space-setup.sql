-- ─────────────────────────────────────────────────────────────
-- CTRL-A Space: the pilot log that follows the person.
-- Store in: supabase/sql/ctrla-space-setup.sql
--
-- The game (app/ctrla/space) keeps everything in localStorage so it
-- works signed out and never waits on the network. When a person signs
-- in, the device copy is merged into this row and the merged row is
-- written back, so rank, missions, signals and trim follow them across
-- devices. One row per user; lists are unioned, numbers take the max,
-- so nothing a pilot did is ever undone by a sync.
--
-- Safe to run more than once (idempotent).
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ctrla_space_pilots (
    user_id     UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    -- Lifetime XP. Rank is derived from it in code (lib: _map/ranks.ts).
    xp          INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
    -- Seconds of boost held, lifetime. Feeds the Full Throttle mission.
    boost_time  REAL NOT NULL DEFAULT 0 CHECK (boost_time >= 0),
    -- Body ids docked at, planets landed on, drift signals found,
    -- mission ids paid out. All are ids from the game's own registries.
    visited     TEXT[] NOT NULL DEFAULT '{}',
    landed      TEXT[] NOT NULL DEFAULT '{}',
    signals     TEXT[] NOT NULL DEFAULT '{}',
    missions    TEXT[] NOT NULL DEFAULT '{}',
    -- Rank id whose trim the ship wears.
    trim        TEXT NOT NULL DEFAULT 'cadet',
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ctrla_space_pilots ENABLE ROW LEVEL SECURITY;

-- People read and write only their own row.
DROP POLICY IF EXISTS "ctrla_space_pilots_select_own" ON ctrla_space_pilots;
CREATE POLICY "ctrla_space_pilots_select_own" ON ctrla_space_pilots
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "ctrla_space_pilots_insert_own" ON ctrla_space_pilots;
CREATE POLICY "ctrla_space_pilots_insert_own" ON ctrla_space_pilots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ctrla_space_pilots_update_own" ON ctrla_space_pilots;
CREATE POLICY "ctrla_space_pilots_update_own" ON ctrla_space_pilots
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "ctrla_space_pilots_delete_own" ON ctrla_space_pilots;
CREATE POLICY "ctrla_space_pilots_delete_own" ON ctrla_space_pilots
    FOR DELETE USING (auth.uid() = user_id);

-- Public profiles can show a rank badge. XP and lists only, never the
-- trim or boost time (nobody needs those). Mirrors ctrla_public_progress.
CREATE OR REPLACE VIEW ctrla_public_pilots AS
    SELECT p.id AS user_id, p.handle, s.xp, s.missions, s.signals, s.updated_at
    FROM ctrla_space_pilots s
    JOIN profiles p ON p.id = s.user_id
    WHERE p.is_public = TRUE;

GRANT SELECT ON ctrla_public_pilots TO anon, authenticated;
