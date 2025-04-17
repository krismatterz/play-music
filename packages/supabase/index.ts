import { createClient } from "@supabase/supabase-js";

// These will be loaded from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase URL or key not found. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// User-related functions
export async function signInWithSpotify() {
  return await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: {
      scopes:
        "user-read-email user-read-private streaming user-library-read user-library-modify user-read-playback-state user-modify-playback-state",
    },
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { user: null };

  return await supabase.auth.getUser();
}

// Spotify track-related functions
export async function saveFavoriteTrack(
  userId: string,
  trackId: string,
  trackDetails: any,
) {
  return await supabase.from("favorite_tracks").upsert({
    user_id: userId,
    track_id: trackId,
    track_details: trackDetails,
    created_at: new Date().toISOString(),
  });
}

export async function getFavoriteTracks(userId: string) {
  return await supabase
    .from("favorite_tracks")
    .select("*")
    .eq("user_id", userId);
}

export async function removeFavoriteTrack(userId: string, trackId: string) {
  return await supabase
    .from("favorite_tracks")
    .delete()
    .match({ user_id: userId, track_id: trackId });
}

// Playlist-related functions
export async function createPlaylist(
  userId: string,
  name: string,
  description: string = "",
) {
  return await supabase
    .from("playlists")
    .insert({
      user_id: userId,
      name,
      description,
      created_at: new Date().toISOString(),
    })
    .select();
}

export async function getPlaylists(userId: string) {
  return await supabase.from("playlists").select("*").eq("user_id", userId);
}

export async function addTrackToPlaylist(
  playlistId: string,
  trackId: string,
  trackDetails: any,
) {
  return await supabase.from("playlist_tracks").insert({
    playlist_id: playlistId,
    track_id: trackId,
    track_details: trackDetails,
    added_at: new Date().toISOString(),
  });
}

export async function getPlaylistTracks(playlistId: string) {
  return await supabase
    .from("playlist_tracks")
    .select("*")
    .eq("playlist_id", playlistId)
    .order("added_at", { ascending: false });
}

// User listening history
export async function saveListeningHistory(
  userId: string,
  trackId: string,
  trackDetails: any,
) {
  return await supabase.from("listening_history").insert({
    user_id: userId,
    track_id: trackId,
    track_details: trackDetails,
    played_at: new Date().toISOString(),
  });
}

export async function getListeningHistory(userId: string, limit: number = 50) {
  return await supabase
    .from("listening_history")
    .select("*")
    .eq("user_id", userId)
    .order("played_at", { ascending: false })
    .limit(limit);
}
