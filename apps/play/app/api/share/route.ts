import {
  createServerClient as createSupabaseServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { cookies } from "next/headers";
import { type Track, type Artist } from "supabase";

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const cookieStore = cookies();

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

  const supabase = createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions): void {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          /* Server Component handling - ignore */
        }
      },
      remove(name: string, options: CookieOptions): void {
        try {
          cookieStore.set({ name, value: "", ...options }); // Or use delete if preferred/available
        } catch (error) {
          /* Server Component handling - ignore */
        }
      },
    },
  });

  try {
    const trackData = (await request.json()) as Track;

    // Basic validation (add more robust validation as needed)
    if (!trackData?.id || !trackData?.name || !trackData?.artists) {
      return NextResponse.json(
        { error: "Missing required track data" },
        { status: 400 },
      );
    }

    // Select specific fields to store to avoid storing overly large objects
    const dataToStore = {
      name: trackData.name,
      artists: trackData.artists.map((artist: Artist) => ({
        name: artist.name,
        id: artist.id,
      })), // Store artist names/ids
      album: {
        name: trackData.album.name,
        images: trackData.album.images, // Keep album images
        id: trackData.album.id,
      },
      preview_url: trackData.preview_url,
      external_urls: trackData.external_urls,
      spotify_id: trackData.id, // Assuming trackData.id is the Spotify Track ID
      duration_ms: trackData.duration_ms,
      // Add any other relevant fields you want to share
    };

    const shareId = uuidv4(); // Generate a unique ID for the share link

    const { error } = await supabase
      .from("shared_tracks") // Make sure 'shared_tracks' table exists and matches schema
      .insert({
        id: shareId, // Use the generated UUID as the primary key
        track_data: dataToStore,
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create share link", details: error.message },
        { status: 500 },
      );
    }

    // Construct the full share URL based on the request origin or environment variable
    const requestUrl = new URL(request.url);
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
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

// Optional: Add GET handler if needed later, or other methods
// export async function GET(request: Request) { ... }
