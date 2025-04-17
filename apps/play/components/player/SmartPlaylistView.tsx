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

const SmartPlaylistPreview: React.FC = () => {
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
            isPlaying: track.isPlaying || false,
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
              isPlaying: track.isPlaying || false,
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
    if (!spotify.isAuthenticated || !spotify.isPlayerReady) {
      // Prompt to login if not authenticated
      await spotify.login();
      return;
    }

    if (track.uri) {
      await spotify.play(track.uri);
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-gradient-to-b from-amber-900 to-black p-[2.5px] shadow-2xl">
      <div className="h-full w-full rounded-[0.75rem] bg-black/70 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-black/10 px-2 py-1">
            {/* Smart AI Icon */}
            <Image
              src="/landing/Sparkle_AI.svg"
              alt="AI Sparkle"
              width={20}
              height={20}
              className="inline-block"
            />
            <span className="text-sm font-medium text-white">
              {spotify.isAuthenticated ? "Your Library" : "dJai Suggestion"}
            </span>
          </div>
          {spotify.isAuthenticated ? null : (
            <button
              onClick={() => spotify.login()}
              className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-500"
            >
              Connect Spotify
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          </div>
        ) : (
          tracks.map((track, i) => (
            <div
              key={track.title + i}
              className={`flex cursor-pointer items-center gap-3 py-3 ${i < tracks.length - 1 ? "border-b border-white/5" : ""} ${track.isPlaying ? "mb-2 rounded-lg bg-white/5 p-2" : ""}`}
              onClick={() => handleTrackClick(track)}
            >
              <Image
                src={track.cover}
                alt={track.title + " cover"}
                width={track.isPlaying ? 48 : 40}
                height={track.isPlaying ? 48 : 40}
                className={`rounded ${track.isPlaying ? "h-12 w-12" : "h-10 w-10"}`}
              />
              <div>
                <div
                  className={`flex items-center text-sm font-medium text-white ${track.isPlaying ? "" : "text-xs"}`}
                >
                  {track.title}
                  {track.explicit && <ExplicitBadge />}
                </div>
                <div className="text-xs text-neutral-400">{track.artist}</div>
              </div>
              <div className="ml-auto text-xs text-neutral-400">
                {track.duration}
              </div>
            </div>
          ))
        )}
        {/* AI Feature */}
        <div className="mt-4 rounded-lg bg-gradient-to-r from-amber-800/40 to-black/5 p-3">
          <div className="mb-1 bg-gradient-to-r from-purple-600 via-amber-600 via-15% to-amber-300 bg-clip-text text-xs font-bold text-transparent">
            AI Feature
          </div>
          <div className="text-sm text-white">
            {spotify.isAuthenticated
              ? "Personalized recommendations based on your library"
              : "New songs that you might like"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPlaylistPreview;
