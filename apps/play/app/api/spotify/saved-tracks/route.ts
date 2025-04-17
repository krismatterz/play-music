import { NextResponse } from "next/server";
import { supabase } from "../../../../../packages/supabase";
import * as spotifyApi from "../../../../../packages/supabase/spotify";

export async function GET() {
  try {
    // Get the current session
    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch saved tracks using the Spotify API wrapper
    const savedTracks = await spotifyApi.getSavedTracks(50, 0);

    return NextResponse.json(savedTracks);
  } catch (error) {
    console.error("Error fetching saved tracks:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved tracks" },
      { status: 500 },
    );
  }
}
