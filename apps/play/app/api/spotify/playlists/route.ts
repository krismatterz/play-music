import { NextResponse } from "next/server";
import { supabase } from "../../../../../../packages/supabase";
import * as spotifyApi from "../../../../../../packages/supabase/spotify";

export async function GET() {
  try {
    // Get the current session
    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch user's playlists
    const playlists = await spotifyApi.getUserPlaylists(50, 0);

    return NextResponse.json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 },
    );
  }
}
