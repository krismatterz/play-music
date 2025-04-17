"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ExplicitBadge from "../ui/ExplicitBadge";
import { useSpotify } from "../../context/SpotifyContext";
import { usePlayer } from "../../context/PlayerContext";
import type { DisplayableTrack } from "../../context/PlayerContext";
import { formatDuration } from "../../utils/formatDuration";
import { Play, Pause } from "lucide-react";

export const AppPreview: React.FC = () => {
  const previewRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;

      const { left, top, width, height } =
        previewRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      previewRef.current.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    };

    const handleMouseLeave = () => {
      if (!previewRef.current) return;
      previewRef.current.style.transform =
        "perspective(1000px) rotateY(0deg) rotateX(0deg)";
      previewRef.current.style.transition = "transform 0.5s ease";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={previewRef}
      className="relative w-full max-w-md overflow-hidden rounded-xl border border-black/20 bg-transparent shadow-2xl transition-transform duration-300 ease-out"
      style={{ transformStyle: "preserve-3d" }}
    ></div>
  );
};

// Type for the Spotify API response (Saved Tracks)
interface SavedTracksResponse {
  items: Array<{
    track: {
      id: string;
      uri: string;
      name: string;
      duration_ms: number;
      explicit: boolean;
      album: {
        name: string;
        images: { url: string }[];
      };
      artists: { name: string }[];
    };
  }>;
}

// Type for the local playback API response
// Ensure this matches the shape returned by /api/local-playback
interface LocalTrackFromAPI {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  duration: string; // API returns string, PlayerContext expects number (ms)
  explicit: boolean;
}
interface LocalTracksResponse {
  tracks: LocalTrackFromAPI[];
}

const SmartPlaylistView: React.FC = () => {
  const spotify = useSpotify();
  const player = usePlayer();

  // Local state only for the list of tracks to display
  const [displayTracks, setDisplayTracks] = useState<DisplayableTrack[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tracks on mount or auth change
  useEffect(() => {
    const fetchAndSetTracks = async () => {
      setLoading(true);
      let fetchedTracks: DisplayableTrack[] = [];

      try {
        if (spotify.isAuthenticated) {
          // --- Fetch from Spotify --- //
          const response = await fetch("/api/spotify/saved-tracks");
          if (!response.ok)
            throw new Error(`Spotify API Error: ${response.status}`);
          const data = (await response.json()) as SavedTracksResponse;

          if (data.items && data.items.length > 0) {
            fetchedTracks = data.items.slice(0, 6).map((item) => ({
              id: item.track.id,
              uri: item.track.uri,
              title: item.track.name,
              artist: item.track.artists.map((a) => a.name).join(", "),
              album: item.track.album.name,
              cover:
                item.track.album.images[0]?.url ?? "/placeholder-cover.png",
              durationMs: item.track.duration_ms,
              explicit: item.track.explicit,
              // url is not applicable for Spotify tracks
            }));
          } else {
            // Fallback to local if no Spotify tracks
            fetchedTracks = await fetchLocalTracks();
          }
        } else {
          // --- Fetch from Local API --- //
          fetchedTracks = await fetchLocalTracks();
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
        try {
          // Attempt local fetch as a last resort on any error
          fetchedTracks = await fetchLocalTracks();
        } catch (localError) {
          console.error("Error fetching local fallback tracks:", localError);
          fetchedTracks = []; // Set empty on final error
        }
      } finally {
        setDisplayTracks(fetchedTracks);
        setLoading(false);
      }
    };

    // Helper function to fetch local tracks
    const fetchLocalTracks = async (): Promise<DisplayableTrack[]> => {
      const response = await fetch("/api/local-playback");
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Fallback playlist not found in DB.");
        } else {
          throw new Error(`Local API Error: ${response.status}`);
        }
        return []; // Return empty array on error/404
      } else {
        const data = (await response.json()) as LocalTracksResponse;
        // Convert API data to DisplayableTrack format
        return data.tracks.map((track) => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          cover: track.cover,
          url: track.url,
          // durationMs: parseDurationStringToMs(track.duration), // Needs parsing helper
          durationMs: 0, // Placeholder - needs parsing
          explicit: track.explicit,
          // uri and album might not be applicable
        }));
      }
    };

    void fetchAndSetTracks();
  }, [spotify.isAuthenticated]); // Re-fetch when auth status changes

  // Handle track click - delegate to PlayerContext
  const handleTrackClick = (track: DisplayableTrack) => {
    if (spotify.isAuthenticated) {
      if (track.uri) {
        // Play using Spotify via PlayerContext
        player.play({ source: "spotify", uri: track.uri }).catch(console.error);
      } else {
        console.warn("Clicked Spotify track has no URI:", track);
      }
    } else {
      if (track.url) {
        // Play using local source via PlayerContext
        player.play({ source: "local", track: track }).catch(console.error);
      } else {
        console.warn("Clicked local track has no URL:", track);
      }
    }
  };

  // Determine if a specific track in the list is the one currently playing
  const isTrackPlaying = (track: DisplayableTrack): boolean => {
    if (!player.currentTrack) return false;
    return player.isPlaying && player.currentTrack.id === track.id;
  };

  return (
    <div className="rounded-xl bg-white/5 shadow-md">
      <div className="rounded-t-xl bg-gradient-to-r from-amber-900 to-amber-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/landing/Sparkle_AI.svg"
              alt="AI Sparkle"
              width={20}
              height={20}
              className="inline-block"
            />
            <span className="text-sm font-medium text-white">
              {spotify.isAuthenticated ? "Your Top Tracks" : "Local Playback"}
            </span>
          </div>
          {!spotify.isAuthenticated && displayTracks.length > 0 && (
            <span className="text-xs text-amber-200">Using local files</span>
          )}
          {!spotify.isAuthenticated &&
            displayTracks.length === 0 &&
            !loading && (
              <span className="text-xs text-red-400">
                Fallback playlist empty/not found
              </span>
            )}
          {!spotify.isAuthenticated && (
            <button
              onClick={() => spotify.login().catch(console.error)}
              className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-500"
            >
              Connect Spotify
            </button>
          )}
        </div>
      </div>

      <div className="p-2">
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {displayTracks.map((track, i) => {
              const isPlaying = isTrackPlaying(track);
              return (
                <div
                  key={track.id || track.title + i}
                  className={`flex cursor-pointer items-center gap-3 p-3 ${isPlaying ? "bg-white/10" : "hover:bg-white/5"}`}
                  onClick={() => handleTrackClick(track)}
                >
                  <div className="flex w-8 items-center justify-center font-mono text-sm text-neutral-400">
                    {isPlaying ? (
                      <Pause className="h-4 w-4 text-green-500" />
                    ) : player.currentTrack?.id === track.id ? (
                      <Play className="h-4 w-4 text-white" />
                    ) : (
                      i + 1
                    )}
                  </div>

                  <Image
                    src={track.cover}
                    alt={track.title + " cover"}
                    width={40}
                    height={40}
                    className="rounded shadow"
                  />

                  <div className="flex-1 overflow-hidden">
                    <div
                      className={`flex items-center truncate text-sm font-medium text-white ${isPlaying ? "text-green-500" : ""}`}
                    >
                      {track.title}
                      {track.explicit && <ExplicitBadge />}
                    </div>
                    <div className="truncate text-xs text-neutral-400">
                      {track.artist}
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400">
                    {player.currentTrack?.id === track.id && player.duration > 0
                      ? formatDuration(player.duration * 1000)
                      : formatDuration(track.durationMs ?? 0)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {spotify.isAuthenticated && !spotify.isPremium && (
          <div className="mt-2 rounded-lg bg-amber-900/30 p-2 text-xs">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Spotify Premium required for in-app playback. Tracks will open
                in Spotify app.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartPlaylistView;
