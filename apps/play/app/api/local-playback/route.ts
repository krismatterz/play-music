import { NextResponse } from "next/server";
import { supabase } from "supabase";
import { PostgrestError } from "@supabase/supabase-js";

// Define expected structure for track details
interface TrackDetails {
  name: string | null;
  artist: string | null;
  cover: string | null;
  url: string | null;
  duration: string | null;
  explicit: boolean | null;
}

// Define expected structure for playlist tracks from DB
interface PlaylistTrackFromDB {
  track_id: string;
  track_details: TrackDetails;
  position: number;
}

interface FormattedTrack {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  duration: string;
  explicit: boolean;
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

    const playlistId = playlistData.id as string;

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
    const formattedTracks: FormattedTrack[] = tracksData.map((track) => ({
      id: track.track_id,
      title: track.track_details?.name ?? "Unknown Title",
      artist: track.track_details?.artist ?? "Unknown Artist",
      cover: track.track_details?.cover ?? "/placeholder-cover.png",
      url: track.track_details?.url ?? "",
      duration: track.track_details?.duration ?? "0:00",
      explicit: track.track_details?.explicit ?? false,
    }));

    return NextResponse.json({ tracks: formattedTracks });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Unexpected error in /api/local-playback:", errorMessage);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
