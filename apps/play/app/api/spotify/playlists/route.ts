import { NextResponse } from "next/server";
import { supabase } from "../../../../../../packages/supabase";
import * as spotifyApi from "../../../../../../packages/supabase/spotify";

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
}

interface SpotifyPlaylistsResponse {
  items: SpotifyPlaylist[];
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

    // Fetch user's playlists
    const playlists = (await spotifyApi.getUserPlaylists(
      50,
      0,
    )) as SpotifyPlaylistsResponse;

    return NextResponse.json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch playlists", details: errorMessage },
      { status: 500 },
    );
  }
}
