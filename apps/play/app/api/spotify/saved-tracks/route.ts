import { NextResponse } from "next/server";
import { supabase } from "supabase";
import * as spotifyApi from "supabase/spotify";

interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  uri: string;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
}

interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  explicit: boolean;
  preview_url: string | null;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
}

interface SavedTrack {
  added_at: string;
  track: SpotifyTrack;
}

interface SavedTracksResponse {
  items: SavedTrack[];
  total: number;
  limit: number;
  offset: number;
}

export async function GET() {
  try {
    // Get the current session
    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch saved tracks using the Spotify API wrapper
    const savedTracks = (await spotifyApi.getSavedTracks(
      50,
      0,
    )) as SavedTracksResponse;

    return NextResponse.json(savedTracks);
  } catch (error) {
    console.error("Error fetching saved tracks:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch saved tracks", details: errorMessage },
      { status: 500 },
    );
  }
}
