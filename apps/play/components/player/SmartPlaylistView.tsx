"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ExplicitBadge from "../ui/ExplicitBadge";
import { useSpotify } from "../../hooks/useSpotify";
import { formatDuration } from "../../utils/formatDuration";

// Fallback playlist for when Spotify is not connected
const fallbackPlaylist = [
  {
    title: "Invencible",
    artist: "Eladio Carrión",
    cover: "/landing/Eladio_DON_KBRN_Cover.png",
    duration: "1:30",
    isPlaying: true,
    explicit: true,
  },
  {
    title: "Weightless",
    artist: "Martin Garrix",
    cover: "/landing/Martin_Garrix_Weightless_Cover.png",
    duration: "3:43",
  },
  {
    title: "Thana",
    artist: "Tayna",
    cover: "/landing/Tayna_Thana_Cover.png",
    duration: "3:25",
  },
  {
    title: "frente al mar",
    artist: "Béele",
    cover: "/landing/Bélee_frente_al_mar_Cover.png",
    duration: "2:45",
  },
  {
    title: "PERFuMITO NUEVO",
    artist: "Bad Bunny",
    cover: "/landing/Bad_Bunny_DTMF_Cover.png",
    duration: "3:21",
    explicit: true,
  },
  {
    title: "Work",
    artist: "Anyma",
    cover: "/landing/Anyma_Work_Cover.png",
    duration: "2:54",
    explicit: true,
  },
];

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

// Type for Spotify track
interface SpotifyTrack {
  uri: string;
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: {
    name: string;
  }[];
}

// Interface for our track display format
interface DisplayTrack {
  uri: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  isPlaying: boolean;
  explicit: boolean;
}

// Type for the API response
interface SavedTracksResponse {
  items: Array<{
    track: SpotifyTrack;
  }>;
}

const SmartPlaylistView: React.FC = () => {
  const spotify = useSpotify();
  const [tracks, setTracks] = useState<DisplayTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlayingUri, setCurrentlyPlayingUri] = useState<string | null>(
    null,
  );

  // Fetch tracks from Spotify
  useEffect(() => {
    const fetchTracks = async () => {
      if (!spotify.isAuthenticated || !spotify.isPlayerReady) {
        // Use fallback playlist when not authenticated
        setTracks(
          fallbackPlaylist.map((track) => ({
            ...track,
            uri: "",
            isPlaying: track.isPlaying ?? false,
            explicit: track.explicit ?? false,
          })),
        );
        setLoading(false);
        return;
      }

      try {
        // First try to get the user's saved tracks (liked songs)
        const response = await fetch("/api/spotify/saved-tracks");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = (await response.json()) as SavedTracksResponse;

        if (data.items && data.items.length > 0) {
          // Transform tracks to our display format
          const formattedTracks = data.items
            .slice(0, 6) // Limit to 6 tracks
            .map((item) => ({
              uri: item.track.uri,
              title: item.track.name,
              artist: item.track.artists.map((a) => a.name).join(", "),
              cover:
                item.track.album.images[0]?.url ?? "/placeholder-cover.png",
              duration: formatDuration(item.track.duration_ms),
              isPlaying: false,
              explicit: item.track.explicit,
            }));

          setTracks(formattedTracks);
        } else {
          // Fallback to the static playlist if no tracks found
          setTracks(
            fallbackPlaylist.map((track) => ({
              ...track,
              uri: "",
              isPlaying: track.isPlaying ?? false,
              explicit: track.explicit ?? false,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
        // Use fallback playlist on error
        setTracks(
          fallbackPlaylist.map((track) => ({
            ...track,
            uri: "",
            isPlaying: track.isPlaying ?? false,
            explicit: track.explicit ?? false,
          })),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [spotify.isAuthenticated, spotify.isPlayerReady]);

  // Update currently playing track from Spotify playback state
  useEffect(() => {
    if (spotify.playbackState && spotify.playbackState.track_window) {
      const currentTrack = spotify.playbackState.track_window.current_track;
      setCurrentlyPlayingUri(currentTrack?.uri ?? null);

      // Update isPlaying status for all tracks
      setTracks((prevTracks) =>
        prevTracks.map((track) => ({
          ...track,
          isPlaying:
            track.uri === currentTrack?.uri && !spotify.playbackState?.paused,
        })),
      );
    }
  }, [spotify.playbackState]);

  // Handle track click to play
  const handleTrackClick = async (track: DisplayTrack) => {
    if (!spotify.isAuthenticated) {
      // Prompt to login if not authenticated
      await spotify.login();
      return;
    }

    if (track.uri) {
      if (spotify.isPremium) {
        // For premium users, play directly in the app
        await spotify.play(track.uri);
      } else {
        // For non-premium users, open in Spotify app
        spotify.openSpotifyApp(track.uri);
      }
    }
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
              {spotify.isAuthenticated
                ? "Your Top Tracks"
                : "Recommended Tracks"}
            </span>
          </div>
          {!spotify.isAuthenticated && (
            <button
              onClick={() => spotify.login()}
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
            {tracks.map((track, i) => (
              <div
                key={track.title + i}
                className={`flex cursor-pointer items-center gap-3 p-3 ${track.isPlaying ? "bg-white/5" : "hover:bg-white/5"}`}
                onClick={() => handleTrackClick(track)}
              >
                <div className="flex w-8 items-center justify-center font-mono text-sm text-neutral-400">
                  {track.isPlaying ? (
                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
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
                    className={`flex items-center truncate text-sm font-medium text-white ${track.isPlaying ? "text-green-500" : ""}`}
                  >
                    {track.title}
                    {track.explicit && <ExplicitBadge />}
                  </div>
                  <div className="truncate text-xs text-neutral-400">
                    {track.artist}
                  </div>
                </div>

                <div className="text-xs text-neutral-400">{track.duration}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 p-3 text-center">
          <button
            onClick={() => (spotify.isAuthenticated ? null : spotify.login())}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
          >
            {spotify.isAuthenticated ? "View All" : "Sign in to view more"}
          </button>
        </div>

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
