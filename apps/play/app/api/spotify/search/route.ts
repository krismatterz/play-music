import { NextResponse } from "next/server";
import { supabase } from "../../../../../../packages/supabase";
import * as spotifyApi from "../../../../../../packages/supabase/spotify";

interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
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
  artists: SpotifyArtist[];
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

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  uri: string;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
}

interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrack[];
    total: number;
  };
  artists?: {
    items: SpotifyArtist[];
    total: number;
  };
  albums?: {
    items: SpotifyAlbum[];
    total: number;
  };
  playlists?: {
    items: SpotifyPlaylist[];
    total: number;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const types = searchParams.get("types") ?? "track,artist,album,playlist";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 },
    );
  }

  try {
    // Get the current session
    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Search Spotify API
    const response = (await spotifyApi.search(
      query,
      types,
    )) as SpotifySearchResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error("Spotify search error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to search Spotify", details: errorMessage },
      { status: 500 },
    );
  }
}
