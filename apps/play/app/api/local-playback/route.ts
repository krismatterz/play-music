import { NextResponse } from "next/server";
import { supabase } from "supabase";
import { PostgrestError } from "@supabase/supabase-js";

// Define expected structure for track details
interface TrackDetails {
  name?: string;
  artist?: string;
  cover?: string;
  url?: string;
  duration?: string;
  explicit?: boolean;
}

// Define expected structure for playlist tracks from DB
interface PlaylistTrackFromDB {
  track_id: string;
  track_details: TrackDetails | null | unknown; // Allow for potential null or unknown structure
  position: number;
}

export async function GET() {
  try {
    // Find the fallback playlist
    const { data: playlistData, error: playlistError } = await supabase
      .from("playlists")
      .select("id")
      .eq("name", "Fallback Playlist")
      .limit(1)
      .single();

    // Explicitly check for PostgrestError or null data
    if (playlistError || !playlistData) {
      console.error(
        "Error fetching fallback playlist:",
        playlistError instanceof PostgrestError
          ? playlistError.message
          : "Playlist not found",
      );
      const status = playlistError ? 500 : 404;
      return NextResponse.json({ tracks: [] }, { status });
    }

    const playlistId = playlistData.id;

    // Fetch tracks for that playlist
    const { data: tracksData, error: tracksError } = await supabase
      .from("playlist_tracks")
      .select<string, PlaylistTrackFromDB>("track_id, track_details, position")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: true });

    // Explicitly check for PostgrestError
    if (tracksError) {
      console.error("Error fetching fallback tracks:", tracksError.message);
      return NextResponse.json(
        { error: `Failed to fetch fallback tracks: ${tracksError.message}` },
        { status: 500 },
      );
    }

    // Handle case where tracksData might be null
    if (!tracksData) {
      return NextResponse.json({ tracks: [] });
    }

    // Format tracks safely
    const formattedTracks = tracksData.map((track: PlaylistTrackFromDB) => {
      // Type guard for track_details
      const details = track.track_details as TrackDetails | null;

      return {
        id: track.track_id,
        title: details?.name ?? "Unknown Title",
        artist: details?.artist ?? "Unknown Artist",
        cover: details?.cover ?? "/placeholder-cover.png",
        url: details?.url ?? "",
        duration: details?.duration ?? "0:00",
        explicit: details?.explicit ?? false,
      };
    });

    return NextResponse.json({ tracks: formattedTracks });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Unexpected error in /api/local-playback:", errorMessage);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
