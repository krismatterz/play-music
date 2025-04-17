"use client";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useMemo,
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

// --- Context Types (Split) --- //

interface PlayerStateType {
  playbackSource: PlaybackSource;
  currentTrack: DisplayableTrack | null;
  isPlaying: boolean;
  duration: number; // Total duration in seconds
  volume: number; // Volume 0-100
}

interface PlayerActionsType {
  play: (
    trackInfo:
      | { source: "spotify"; uri: string }
      | { source: "local"; track: DisplayableTrack },
  ) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (timeSeconds: number) => Promise<void>;
  setVolume: (volumePercent: number) => Promise<void>;
}

interface PlayerProgressType {
  currentTime: number; // Current playback time in seconds
}

// --- Context Definitions (Split) --- //

const PlayerStateContext = createContext<PlayerStateType | undefined>(
  undefined,
);
const PlayerActionsContext = createContext<PlayerActionsType | undefined>(
  undefined,
);
const PlayerProgressContext = createContext<PlayerProgressType | undefined>(
  undefined,
);

// --- Provider Implementation --- //

export function PlayerProvider({ children }: { children: ReactNode }) {
  const spotify = useSpotify();
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- State Definitions --- //
  // State for PlayerStateContext
  const [playbackSource, setPlaybackSource] = useState<PlaybackSource>(null);
  const [currentTrack, setCurrentTrack] = useState<DisplayableTrack | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // Store duration in seconds
  const [volume, setVolume] = useState(50); // Volume 0-100

  // State for PlayerProgressContext
  const [currentTime, setCurrentTime] = useState(0); // Store time in seconds

  // State synchronization from Spotify SDK
  useEffect(() => {
    const state = spotify.playbackState as SpotifyPlaybackState | null;
    if (playbackSource !== "spotify" || !state) return;

    const spotifyTrack = state.track_window?.current_track;

    if (spotifyTrack && spotifyTrack.id !== currentTrack?.id) {
      setCurrentTrack({
        id: spotifyTrack.id,
        uri: spotifyTrack.uri,
        title: spotifyTrack.name,
        artist: spotifyTrack.artists.map((a) => a.name).join(", "),
        album: spotifyTrack.album.name,
        cover: spotifyTrack.album.images[0]?.url ?? "/placeholder-cover.png",
        durationMs: spotifyTrack.duration_ms,
        explicit: spotifyTrack.explicit,
      });
      // Reset time/duration when track changes
      setCurrentTime(0);
      setDuration((spotifyTrack.duration_ms ?? 0) / 1000);
    } else if (spotifyTrack) {
      // Update duration/position only if the track is the same
      setDuration((state.duration ?? 0) / 1000);
      setCurrentTime((state.position ?? 0) / 1000);
    }

    setIsPlaying(!(state.paused ?? true));

    // Note: Volume sync from Spotify might be needed if controlled externally
  }, [spotify.playbackState, playbackSource, currentTrack?.id]); // currentTrack?.id dependency is correct here

  // -- Playback Actions (for PlayerActionsContext) -- //

  const play = useCallback(
    async (
      trackInfo:
        | { source: "spotify"; uri: string }
        | { source: "local"; track: DisplayableTrack },
    ) => {
      // Stop existing local playback
      if (playbackSource === "local" && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset position
      }
      // Consider pausing Spotify if it was playing? (Might be too disruptive)
      // if (playbackSource === 'spotify') { await spotify.pause(); }

      // Reset core state before starting
      setPlaybackSource(trackInfo.source);
      setCurrentTime(0);
      setDuration(0); // Duration will be updated by useEffect or loadedMetadata
      setIsPlaying(true); // Assume playback starts

      if (trackInfo.source === "spotify") {
        setCurrentTrack(null); // Clear local track info, rely on useEffect sync
        if (!spotify.isPlayerReady) {
          console.error("Spotify player not ready");
          setIsPlaying(false);
          setPlaybackSource(null); // Revert source if fails
          return;
        }
        try {
          console.log("Playing Spotify URI:", trackInfo.uri);
          await spotify.play(trackInfo.uri);
          // State updates (track, time, duration, isPlaying) handled by useEffect hook
        } catch (error) {
          console.error("Spotify play error:", error);
          setIsPlaying(false);
          setPlaybackSource(null); // Revert source on error
        }
      } else {
        // Local playback
        if (!audioRef.current) return;
        setCurrentTrack(trackInfo.track); // Set local track details
        setDuration((trackInfo.track.durationMs ?? 0) / 1000); // Set duration if available
        audioRef.current.src = trackInfo.track.url ?? "";
        audioRef.current.volume = volume / 100; // Set initial volume
        try {
          await audioRef.current.play();
          // isPlaying state confirmed by 'onPlay' handler
        } catch (error) {
          console.error("Local play error:", error);
          setIsPlaying(false);
          setPlaybackSource(null); // Revert source on error
        }
      }
    },
    [spotify, playbackSource, volume], // Include all state dependencies
  );

  const pause = useCallback(async () => {
    if (playbackSource === "spotify") {
      await spotify.pause(); // SDK triggers state update via useEffect
    } else if (playbackSource === "local" && audioRef.current) {
      audioRef.current.pause(); // onPause handler updates isPlaying
    }
  }, [playbackSource, spotify]);

  const resume = useCallback(async () => {
    if (playbackSource === "spotify") {
      await spotify.resume(); // SDK triggers state update via useEffect
    } else if (playbackSource === "local" && audioRef.current) {
      try {
        await audioRef.current.play(); // onPlay handler updates isPlaying
      } catch (error) {
        console.error("Local resume error:", error);
        setIsPlaying(false); // Correct state on error
      }
    }
  }, [playbackSource, spotify]);

  const seek = useCallback(
    async (timeSeconds: number) => {
      const clampedTime = Math.max(0, timeSeconds); // Ensure time is not negative
      if (playbackSource === "spotify") {
        // Optimistically update UI, Spotify state sync corrects it
        setCurrentTime(clampedTime);
        await spotify.seek(clampedTime * 1000); // SDK expects ms
      } else if (playbackSource === "local" && audioRef.current) {
        // Ensure seek is within bounds for local files
        const safeTime = Math.min(clampedTime, duration);
        audioRef.current.currentTime = safeTime;
        setCurrentTime(safeTime); // Update state immediately
      }
    },
    [playbackSource, spotify, duration], // Added duration dependency
  );

  const handleSetVolume = useCallback(
    async (volumePercent: number) => {
      const newVolume = Math.max(0, Math.min(100, volumePercent));
      setVolume(newVolume); // Update state immediately
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
    if (playbackSource === "local") {
      setIsPlaying(false);
    }
  }, [playbackSource]);

  const handleTimeUpdate = useCallback(
    (event: SyntheticEvent<HTMLAudioElement>) => {
      if (playbackSource === "local") {
        // Update progress context state
        setCurrentTime(event.currentTarget.currentTime);
      }
    },
    [playbackSource],
  );

  const handleLoadedMetadata = useCallback(
    (event: SyntheticEvent<HTMLAudioElement>) => {
      if (playbackSource === "local") {
        // Update state context state
        setDuration(event.currentTarget.duration);
      }
    },
    [playbackSource],
  );

  const handleAudioEnded = useCallback(() => {
    if (playbackSource === "local") {
      setIsPlaying(false);
      setCurrentTime(0); // Reset time
      // Add logic for playing next track here if needed
      console.log("Local track ended");
    }
    // Note: Spotify SDK handles track ending via state updates
  }, [playbackSource]);

  // --- Context Values (Memoized) --- //

  const stateValue = useMemo(
    () => ({
      playbackSource,
      currentTrack,
      isPlaying,
      duration,
      volume,
    }),
    [playbackSource, currentTrack, isPlaying, duration, volume],
  );

  const actionsValue = useMemo(
    () => ({
      play,
      pause,
      resume,
      seek,
      setVolume: handleSetVolume, // Use the handler name
    }),
    [play, pause, resume, seek, handleSetVolume], // Use stable function references
  );

  const progressValue = useMemo(
    () => ({
      currentTime,
    }),
    [currentTime],
  );

  // --- Render Provider Tree --- //

  return (
    <PlayerStateContext.Provider value={stateValue}>
      <PlayerActionsContext.Provider value={actionsValue}>
        <PlayerProgressContext.Provider value={progressValue}>
          {children}
          {/* Hidden Audio Element for local playback */}
          <audio
            ref={audioRef}
            onPlay={handleAudioPlay}
            onPause={handleAudioPause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleAudioEnded}
            // Consider adding onError handler
          />
        </PlayerProgressContext.Provider>
      </PlayerActionsContext.Provider>
    </PlayerStateContext.Provider>
  );
}

// --- Custom Hooks (Split) --- //

export function usePlayerState() {
  const context = useContext(PlayerStateContext);
  if (context === undefined) {
    throw new Error("usePlayerState must be used within a PlayerProvider");
  }
  return context;
}

export function usePlayerActions() {
  const context = useContext(PlayerActionsContext);
  if (context === undefined) {
    throw new Error("usePlayerActions must be used within a PlayerProvider");
  }
  return context;
}

export function usePlayerProgress() {
  const context = useContext(PlayerProgressContext);
  if (context === undefined) {
    throw new Error("usePlayerProgress must be used within a PlayerProvider");
  }
  return context;
}
