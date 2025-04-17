import { supabase } from "./index";

// Spotify API base URL
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

// Helper function to get the user's Spotify access token
async function getSpotifyToken() {
  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  if (!session?.provider_token) {
    throw new Error(
      "No Spotify access token available. User must log in with Spotify.",
    );
  }

  return session.provider_token;
}

// Helper function for making authenticated requests to Spotify API
async function fetchFromSpotify(endpoint: string, options: RequestInit = {}) {
  try {
    const token = await getSpotifyToken();

    const response = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message || "Error fetching from Spotify API");
    }

    return await response.json();
  } catch (error) {
    console.error("Spotify API error:", error);
    throw error;
  }
}

// Get current user's Spotify profile
export async function getSpotifyProfile() {
  return fetchFromSpotify("/me");
}

// Search tracks, artists, albums, playlists
export async function search(
  query: string,
  type: string = "track",
  limit: number = 20,
) {
  const params = new URLSearchParams({
    q: query,
    type,
    limit: limit.toString(),
  });

  return fetchFromSpotify(`/search?${params.toString()}`);
}

// Get a track's details
export async function getTrack(trackId: string) {
  return fetchFromSpotify(`/tracks/${trackId}`);
}

// Get multiple tracks
export async function getTracks(trackIds: string[]) {
  const params = new URLSearchParams({
    ids: trackIds.join(","),
  });

  return fetchFromSpotify(`/tracks?${params.toString()}`);
}

// Get user's saved tracks (liked songs)
export async function getSavedTracks(limit: number = 20, offset: number = 0) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  return fetchFromSpotify(`/me/tracks?${params.toString()}`);
}

// Save tracks to user's library
export async function saveTracks(trackIds: string[]) {
  return fetchFromSpotify("/me/tracks", {
    method: "PUT",
    body: JSON.stringify(trackIds),
  });
}

// Remove tracks from user's library
export async function removeSavedTracks(trackIds: string[]) {
  return fetchFromSpotify("/me/tracks", {
    method: "DELETE",
    body: JSON.stringify(trackIds),
  });
}

// Check if tracks are saved in user's library
export async function checkSavedTracks(trackIds: string[]) {
  const params = new URLSearchParams({
    ids: trackIds.join(","),
  });

  return fetchFromSpotify(`/me/tracks/contains?${params.toString()}`);
}

// Get user's playlists
export async function getUserPlaylists(limit: number = 20, offset: number = 0) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  return fetchFromSpotify(`/me/playlists?${params.toString()}`);
}

// Get a specific playlist
export async function getPlaylist(playlistId: string) {
  return fetchFromSpotify(`/playlists/${playlistId}`);
}

// Get a playlist's tracks
export async function getPlaylistTracks(
  playlistId: string,
  limit: number = 100,
  offset: number = 0,
) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  return fetchFromSpotify(
    `/playlists/${playlistId}/tracks?${params.toString()}`,
  );
}

// Create a playlist
export async function createPlaylist(
  userId: string,
  name: string,
  description: string = "",
  isPublic: boolean = true,
) {
  return fetchFromSpotify(`/users/${userId}/playlists`, {
    method: "POST",
    body: JSON.stringify({
      name,
      description,
      public: isPublic,
    }),
  });
}

// Add tracks to a playlist
export async function addTracksToPlaylist(
  playlistId: string,
  trackUris: string[],
) {
  return fetchFromSpotify(`/playlists/${playlistId}/tracks`, {
    method: "POST",
    body: JSON.stringify({
      uris: trackUris,
    }),
  });
}

// Get available devices for playback
export async function getAvailableDevices() {
  return fetchFromSpotify("/me/player/devices");
}

// Get currently playing track
export async function getCurrentlyPlaying() {
  return fetchFromSpotify("/me/player/currently-playing");
}

// Get playback state
export async function getPlaybackState() {
  return fetchFromSpotify("/me/player");
}

// Start or resume playback
export async function startPlayback(
  deviceId?: string,
  contextUri?: string,
  uris?: string[],
  offset?: number,
) {
  const params = deviceId
    ? new URLSearchParams({ device_id: deviceId })
    : new URLSearchParams();
  const body: any = {};

  if (contextUri) body.context_uri = contextUri;
  if (uris) body.uris = uris;
  if (offset !== undefined) body.offset = { position: offset };

  return fetchFromSpotify(`/me/player/play?${params.toString()}`, {
    method: "PUT",
    body: Object.keys(body).length ? JSON.stringify(body) : undefined,
  });
}

// Pause playback
export async function pausePlayback(deviceId?: string) {
  const params = deviceId
    ? new URLSearchParams({ device_id: deviceId })
    : new URLSearchParams();

  return fetchFromSpotify(`/me/player/pause?${params.toString()}`, {
    method: "PUT",
  });
}

// Skip to next track
export async function skipToNext(deviceId?: string) {
  const params = deviceId
    ? new URLSearchParams({ device_id: deviceId })
    : new URLSearchParams();

  return fetchFromSpotify(`/me/player/next?${params.toString()}`, {
    method: "POST",
  });
}

// Skip to previous track
export async function skipToPrevious(deviceId?: string) {
  const params = deviceId
    ? new URLSearchParams({ device_id: deviceId })
    : new URLSearchParams();

  return fetchFromSpotify(`/me/player/previous?${params.toString()}`, {
    method: "POST",
  });
}

// Set volume
export async function setVolume(volumePercent: number, deviceId?: string) {
  const params = new URLSearchParams({
    volume_percent: Math.min(100, Math.max(0, volumePercent)).toString(),
  });

  if (deviceId) params.append("device_id", deviceId);

  return fetchFromSpotify(`/me/player/volume?${params.toString()}`, {
    method: "PUT",
  });
}

// Seek to position
export async function seekToPosition(positionMs: number, deviceId?: string) {
  const params = new URLSearchParams({
    position_ms: positionMs.toString(),
  });

  if (deviceId) params.append("device_id", deviceId);

  return fetchFromSpotify(`/me/player/seek?${params.toString()}`, {
    method: "PUT",
  });
}

// Set repeat mode
export async function setRepeatMode(
  state: "track" | "context" | "off",
  deviceId?: string,
) {
  const params = new URLSearchParams({
    state,
  });

  if (deviceId) params.append("device_id", deviceId);

  return fetchFromSpotify(`/me/player/repeat?${params.toString()}`, {
    method: "PUT",
  });
}

// Set shuffle mode
export async function setShuffleMode(state: boolean, deviceId?: string) {
  const params = new URLSearchParams({
    state: state.toString(),
  });

  if (deviceId) params.append("device_id", deviceId);

  return fetchFromSpotify(`/me/player/shuffle?${params.toString()}`, {
    method: "PUT",
  });
}

// Transfer playback to another device
export async function transferPlayback(deviceId: string, play: boolean = true) {
  return fetchFromSpotify("/me/player", {
    method: "PUT",
    body: JSON.stringify({
      device_ids: [deviceId],
      play,
    }),
  });
}

// Get current user profile
export async function getCurrentUserProfile() {
  return fetchFromSpotify("/me");
}
