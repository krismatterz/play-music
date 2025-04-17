"use client";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode, SyntheticEvent } from "react";
import { useSpotify } from "../hooks/useSpotify"; // Assuming SpotifyContext is in the same dir

// --- Types --- //

// Define a more specific type for Spotify track artists if possible
interface SpotifyArtist {
  name: string;
  // Add other artist properties if available/needed
}

// Define a more specific type for Spotify playback state if possible
// Mirroring the structure used in the useEffect hook
interface SpotifyPlaybackState {
  track_window?: {
    current_track?: {
      id: string;
      uri: string;
      name: string;
      artists: SpotifyArtist[];
      album: {
        name: string;
        images: { url: string }[];
      };
      duration_ms: number;
      explicit: boolean;
    };
  };
  duration?: number; // duration in ms
  position?: number; // position in ms
  paused?: boolean;
}

// Basic track structure used by the UI
// Renamed to avoid conflict with internal track types
export interface DisplayableTrack {
  id: string; // Spotify ID or local track ID
  uri?: string; // Spotify URI
  url?: string; // Local MP3 URL
  title: string;
  artist: string;
  album?: string;
  cover: string;
  durationMs?: number; // Duration in milliseconds (preferred for consistency)
  explicit?: boolean;
}

type PlaybackSource = "spotify" | "local" | null;

interface PlayerContextType {
  playbackSource: PlaybackSource;
  currentTrack: DisplayableTrack | null;
  isPlaying: boolean;
  currentTime: number; // Current playback time in seconds
  duration: number; // Total duration in seconds
  volume: number; // Volume 0-100

  // Actions
  play: (
    trackInfo:
      | { source: "spotify"; uri: string }
      | { source: "local"; track: DisplayableTrack },
  ) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>; // Renamed togglePlayPause for clarity
  seek: (timeSeconds: number) => Promise<void>;
  setVolume: (volumePercent: number) => Promise<void>;
  // Add next/previous if needed later
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// --- Provider Implementation --- //

export function PlayerProvider({ children }: { children: ReactNode }) {
  const spotify = useSpotify();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Core Playback State
  const [playbackSource, setPlaybackSource] = useState<PlaybackSource>(null);
  const [currentTrack, setCurrentTrack] = useState<DisplayableTrack | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Store time in seconds
  const [duration, setDuration] = useState(0); // Store duration in seconds
  const [volume, setVolume] = useState(50); // Volume 0-100

  // State synchronization from Spotify SDK
  useEffect(() => {
    // Use the more specific type assertion
    const state = spotify.playbackState as SpotifyPlaybackState | null;
    if (playbackSource !== "spotify" || !state) return;

    const spotifyTrack = state.track_window?.current_track;

    if (spotifyTrack && spotifyTrack.id !== currentTrack?.id) {
      setCurrentTrack({
        id: spotifyTrack.id,
        uri: spotifyTrack.uri,
        title: spotifyTrack.name,
        // Explicitly type 'a' here
        artist: spotifyTrack.artists
          .map((a: SpotifyArtist) => a.name)
          .join(", "),
        album: spotifyTrack.album.name,
        cover: spotifyTrack.album.images[0]?.url ?? "/placeholder-cover.png",
        durationMs: spotifyTrack.duration_ms,
        explicit: spotifyTrack.explicit,
      });
    }

    // Use optional chaining and nullish coalescing for safety
    setDuration((state.duration ?? 0) / 1000);
    setCurrentTime((state.position ?? 0) / 1000);
    setIsPlaying(!(state.paused ?? true));
  }, [spotify.playbackState, playbackSource, currentTrack?.id]);

  // -- Playback Actions -- //

  const play = useCallback(
    async (
      trackInfo:
        | { source: "spotify"; uri: string }
        | { source: "local"; track: DisplayableTrack },
    ) => {
      // Stop existing playback before starting new
      if (playbackSource === "local" && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // Consider pausing Spotify if it was playing?
      // await spotify.pause(); // Maybe too aggressive?

      setPlaybackSource(trackInfo.source);
      setIsPlaying(true); // Assume playback starts immediately
      setCurrentTime(0); // Reset time
      setDuration(0); // Reset duration until loaded

      if (trackInfo.source === "spotify") {
        if (!spotify.isPlayerReady) {
          console.error("Spotify player not ready");
          setIsPlaying(false);
          return;
        }
        try {
          // Set track details immediately for UI responsiveness
          // We will get more accurate details from playbackState later
          // This requires fetching track details if not already available
          // For simplicity, let's assume for now the caller provides enough
          // or we rely on the useEffect above to populate details.
          console.log("Playing Spotify URI:", trackInfo.uri);
          await spotify.play(trackInfo.uri);
          // State updates (track, time, duration, isPlaying) will come via useEffect hook
        } catch (error) {
          console.error("Spotify play error:", error);
          setIsPlaying(false);
          setPlaybackSource(null);
        }
      } else {
        // Local playback
        if (!audioRef.current) return;
        setCurrentTrack(trackInfo.track); // Set track details
        audioRef.current.src = trackInfo.track.url ?? "";
        audioRef.current.volume = volume / 100; // Set initial volume
        try {
          await audioRef.current.play();
          // isPlaying state will be confirmed by 'onPlay' handler
        } catch (error) {
          console.error("Local play error:", error);
          setIsPlaying(false);
          setPlaybackSource(null);
        }
      }
    },
    [spotify, playbackSource, volume], // Added volume dependency
  );

  const pause = useCallback(async () => {
    if (playbackSource === "spotify") {
      await spotify.pause(); // SDK should trigger state update
    } else if (playbackSource === "local" && audioRef.current) {
      audioRef.current.pause(); // onPause handler will set isPlaying
    }
  }, [playbackSource, spotify]);

  const resume = useCallback(async () => {
    if (playbackSource === "spotify") {
      await spotify.resume(); // SDK should trigger state update
    } else if (playbackSource === "local" && audioRef.current) {
      try {
        await audioRef.current.play(); // onPlay handler will set isPlaying
      } catch (error) {
        console.error("Local resume error:", error);
        setIsPlaying(false); // Ensure state is correct on error
      }
    }
  }, [playbackSource, spotify]);

  const seek = useCallback(
    async (timeSeconds: number) => {
      if (playbackSource === "spotify") {
        await spotify.seek(timeSeconds * 1000); // SDK expects ms
      } else if (playbackSource === "local" && audioRef.current) {
        audioRef.current.currentTime = timeSeconds;
        setCurrentTime(timeSeconds); // Update state immediately
      }
    },
    [playbackSource, spotify],
  );

  const handleSetVolume = useCallback(
    // Renamed to avoid conflict with state setter
    async (volumePercent: number) => {
      const newVolume = Math.max(0, Math.min(100, volumePercent));
      setVolume(newVolume);
      if (playbackSource === "spotify") {
        await spotify.setVolume(newVolume / 100); // SDK expects 0-1
      } else if (playbackSource === "local" && audioRef.current) {
        audioRef.current.volume = newVolume / 100;
      }
    },
    [playbackSource, spotify],
  );

  // -- Audio Element Event Handlers -- //

  const handleAudioPlay = useCallback(() => {
    if (playbackSource === "local") {
      setIsPlaying(true);
    }
  }, [playbackSource]);

  const handleAudioPause = useCallback(() => {
    // Only set isPlaying false if source is still 'local'
    // Prevents race conditions if source changes quickly
    if (playbackSource === "local") {
      setIsPlaying(false);
    }
  }, [playbackSource]);

  const handleAudioEnded = useCallback(() => {
    if (playbackSource === "local") {
      setIsPlaying(false);
      setCurrentTime(0);
      // Maybe play next track here?
    }
  }, [playbackSource]);

  const handleAudioTimeUpdate = useCallback(() => {
    if (playbackSource === "local" && audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [playbackSource]);

  const handleAudioLoadedMetadata = useCallback(() => {
    if (playbackSource === "local" && audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, [playbackSource]);

  // Correct type for onError: ReactEventHandler<HTMLAudioElement>
  const handleAudioError = useCallback(
    (e: SyntheticEvent<HTMLAudioElement, Event>) => {
      if (playbackSource === "local") {
        console.error("Local Audio Error Target:", e.target);
        setIsPlaying(false);
        setPlaybackSource(null);
        setCurrentTrack(null);
      }
    },
    [playbackSource],
  );

  // --- Context Value --- //

  const contextValue: PlayerContextType = {
    playbackSource,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    resume,
    seek,
    setVolume: handleSetVolume, // Provide the handler function
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
      {/* Hidden Audio Element for Local Playback */}
      <audio
        ref={audioRef}
        onPlay={handleAudioPlay}
        onPause={handleAudioPause}
        onEnded={handleAudioEnded}
        onTimeUpdate={handleAudioTimeUpdate}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onError={handleAudioError}
        // preload="metadata" // Might help load duration faster
      />
    </PlayerContext.Provider>
  );
}

// --- Hook --- //

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
