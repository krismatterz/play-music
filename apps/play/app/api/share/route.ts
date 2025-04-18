import {
  createServerClient as createSupabaseServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { type Track, type Artist } from "supabase";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { cookieManager } from "./cookie-manager";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface StoredTrackData {
  name: string;
  artists: Array<{
    name: string;
    id: string;
  }>;
  album: {
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    id: string;
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  spotify_id: string;
  duration_ms: number;
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("API Route: Missing Supabase environment variables");
    const errorDetails =
      process.env.NODE_ENV === "development"
        ? "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
        : "Server configuration error.";
    return NextResponse.json(
      { error: "Failed to initialize connection.", details: errorDetails },
      { status: 500 },
    );
  }

  const supabaseServerClient = createSupabaseServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name: string) => cookieManager.get(name),
        set: (name: string, value: string, options: CookieOptions) =>
          cookieManager.set(name, value, options),
        remove: (name: string, options: CookieOptions) =>
          cookieManager.remove(name, options),
      },
    },
  );

  try {
    const trackData = (await request.json()) as Track;

    // Basic validation
    if (!trackData?.id || !trackData?.name || !trackData?.artists) {
      return NextResponse.json(
        { error: "Missing required track data" },
        { status: 400 },
      );
    }

    // Select specific fields to store
    const dataToStore: StoredTrackData = {
      name: trackData.name,
      artists: trackData.artists.map((artist: Artist) => ({
        name: artist.name,
        id: artist.id,
      })),
      album: {
        name: trackData.album.name,
        images: trackData.album.images.map((image) => ({
          url: image.url,
          height: image.height ?? 0,
          width: image.width ?? 0,
        })),
        id: trackData.album.id,
      },
      preview_url: trackData.preview_url,
      external_urls: trackData.external_urls,
      spotify_id: trackData.id,
      duration_ms: trackData.duration_ms,
    };

    const shareId = uuidv4();

    const { error } = await supabaseServerClient.from("shared_tracks").insert({
      id: shareId,
      track_data: dataToStore,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create share link", details: error.message },
        { status: 500 },
      );
    }

    const requestUrl = new URL(request.url);
    const baseUrl =
      process.env.NEXT_PUBLIC_PLAY_URL ??
      `${requestUrl.protocol}//${requestUrl.host}`;
    const shareUrl = `${baseUrl}/share/${shareId}`;

    return NextResponse.json({ shareUrl });
  } catch (error) {
    console.error("API share error:", error);
    let errorMessage = "Internal Server Error";
    let statusCode = 500;

    if (error instanceof SyntaxError) {
      errorMessage = "Invalid JSON payload";
      statusCode = 400;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json(
      { error: "Failed to process request", details: errorMessage },
      { status: statusCode },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const response = await supabaseClient
    .from("shared_tracks")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = response as unknown as {
    data: { track_data: StoredTrackData } | null;
    error: Error | null;
  };

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch track", details: error.message },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// Optional: Add GET handler if needed later, or other methods
// export async function GET(request: Request) { ... }
