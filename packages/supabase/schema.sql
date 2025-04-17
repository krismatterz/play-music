-- Enable RLS (Row Level Security)
alter default privileges revoke execute on functions from public;

-- Create Schema for Play music
create schema if not exists play;

-- Create extension for UUID generation
create extension if not exists "uuid-ossp";

-- Set default privileges
grant usage on schema play to service_role, authenticated, anon;
alter default privileges in schema play grant all on tables to service_role, authenticated;
alter default privileges in schema play grant all on functions to service_role, authenticated;
alter default privileges in schema play grant all on sequences to service_role, authenticated;

-- Table for user favorite tracks
create table play.favorite_tracks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  track_details jsonb not null,
  created_at timestamp with time zone default now(),
  unique (user_id, track_id)
);

-- Table for user playlists
create table play.playlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  is_public boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Table for tracks in playlists
create table play.playlist_tracks (
  id uuid primary key default uuid_generate_v4(),
  playlist_id uuid not null references play.playlists(id) on delete cascade,
  track_id text not null,
  track_details jsonb not null,
  position integer not null default 0,
  added_at timestamp with time zone default now(),
  unique (playlist_id, track_id)
);

-- Table for user listening history
create table play.listening_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  track_details jsonb not null,
  played_at timestamp with time zone default now()
);

-- Table for user follows
create table play.user_follows (
  id uuid primary key default uuid_generate_v4(),
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (follower_id, following_id)
);

-- Row Level Security Policies

-- Favorite tracks policies
alter table play.favorite_tracks enable row level security;

create policy "Users can view their own favorite tracks"
  on play.favorite_tracks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorite tracks"
  on play.favorite_tracks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own favorite tracks"
  on play.favorite_tracks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own favorite tracks"
  on play.favorite_tracks for delete
  using (auth.uid() = user_id);

-- Playlists policies
alter table play.playlists enable row level security;

create policy "Anyone can view public playlists"
  on play.playlists for select
  using (is_public = true or auth.uid() = user_id);

create policy "Users can insert their own playlists"
  on play.playlists for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own playlists"
  on play.playlists for update
  using (auth.uid() = user_id);

create policy "Users can delete their own playlists"
  on play.playlists for delete
  using (auth.uid() = user_id);

-- Playlist tracks policies
alter table play.playlist_tracks enable row level security;

create policy "Anyone can view tracks in public playlists"
  on play.playlist_tracks for select
  using (
    exists (
      select 1 from play.playlists
      where playlists.id = playlist_tracks.playlist_id
      and (playlists.is_public = true or playlists.user_id = auth.uid())
    )
  );

create policy "Users can insert tracks into their own playlists"
  on play.playlist_tracks for insert
  with check (
    exists (
      select 1 from play.playlists
      where playlists.id = playlist_tracks.playlist_id
      and playlists.user_id = auth.uid()
    )
  );

create policy "Users can update tracks in their own playlists"
  on play.playlist_tracks for update
  using (
    exists (
      select 1 from play.playlists
      where playlists.id = playlist_tracks.playlist_id
      and playlists.user_id = auth.uid()
    )
  );

create policy "Users can delete tracks from their own playlists"
  on play.playlist_tracks for delete
  using (
    exists (
      select 1 from play.playlists
      where playlists.id = playlist_tracks.playlist_id
      and playlists.user_id = auth.uid()
    )
  );

-- Listening history policies
alter table play.listening_history enable row level security;

create policy "Users can view their own listening history"
  on play.listening_history for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own listening history"
  on play.listening_history for insert
  with check (auth.uid() = user_id);

-- User follows policies
alter table play.user_follows enable row level security;

create policy "Anyone can view user follows"
  on play.user_follows for select
  using (true);

create policy "Users can follow others"
  on play.user_follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow others"
  on play.user_follows for delete
  using (auth.uid() = follower_id);

-- Indices for better performance
create index idx_favorite_tracks_user_id on play.favorite_tracks(user_id);
create index idx_playlists_user_id on play.playlists(user_id);
create index idx_playlist_tracks_playlist_id on play.playlist_tracks(playlist_id);
create index idx_listening_history_user_id on play.listening_history(user_id);
create index idx_listening_history_played_at on play.listening_history(played_at);
create index idx_user_follows_follower_id on play.user_follows(follower_id);
create index idx_user_follows_following_id on play.user_follows(following_id);

-- Function to update updated_at column
create or replace function play.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger update_playlists_updated_at
before update on play.playlists
for each row
execute function play.update_updated_at();

-- Seed fallback playlist and tracks (replace '<YOUR_USER_ID>' with your Supabase user ID)
with fallback_playlist as (
  insert into play.playlists (user_id, name, description, is_public)
  values ('<YOUR_USER_ID>', 'Fallback Playlist', 'Local MP3 fallback', true)
  returning id
)
insert into play.playlist_tracks (playlist_id, track_id, track_details, position)
values
((select id from fallback_playlist), 'eladio-invencible', '{"name":"Eladio Carrión - Invencible","url":"/music/Eladio Carrión - Invencible.mp3"}', 1),
((select id from fallback_playlist), 'tayna-thana', '{"name":"Tayna - Thana","url":"/music/Tayna - Thana.mp3"}', 2),
((select id from fallback_playlist), 'martin-weightless', '{"name":"Martin Garrix & Arjit Singh - Weightless","url":"/music/Martin Garrix & Arjit Singh - Weightless.mp3"}', 3),
((select id from fallback_playlist), 'anyma-work', '{"name":"Anyma - Work (feat. Yeat)","url":"/music/Anyma - Work (feat. Yeat).mp3"}', 4),
((select id from fallback_playlist), 'bele-frente-al-mar', '{"name":"Beéle - frente al mar","url":"/music/Beéle - frente al mar.mp3"}', 5),
((select id from fallback_playlist), 'badbunny-perfumito', '{"name":"BAD BUNNY ft. RaiNao - PERFuMITO NUEVO","url":"/music/BAD BUNNY ft. RaiNao - PERFuMITO NUEVO.mp3"}', 6); 