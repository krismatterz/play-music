import { NextResponse } from "next/server";
import { supabase } from "../../../../../../packages/supabase";
import * as spotifyApi from "../../../../../../packages/supabase/spotify";

export async function GET(request: Request) {
  try {
    // Get the query parameter
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 },
      );
    }

    // Get the current session
    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Search tracks, artists, albums, and playlists
    const searchResults = await spotifyApi.search(
      query,
      "track,artist,album,playlist",
      20,
    );

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Error searching Spotify:", error);
    return NextResponse.json(
      { error: "Failed to search Spotify" },
      { status: 500 },
    );
  }
}
