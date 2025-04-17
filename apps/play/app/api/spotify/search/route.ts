import { NextResponse } from "next/server";
import { supabase } from "../../../../../../packages/supabase";
import * as spotifyApi from "../../../../../../packages/supabase/spotify";

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
    const response = await spotifyApi.search(query, types);

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Spotify search error:", error);
    return NextResponse.json(
      { error: "Failed to search Spotify" },
      { status: 500 },
    );
  }
}
