"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "../../../packages/supabase";
import { SpotifyWebPlayback } from "../../../packages/supabase/spotify-player";
import * as spotifyApi from "../../../packages/supabase/spotify";
import { usePlayer } from "./PlayerContext";

// Define types
type SpotifyContextType = {
  isAuthenticated: boolean;
  isPlayerReady: boolean;
  deviceId: string | null;
  currentTrack: any | null;
  playbackState: any | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  play: (uri?: string, positionMs?: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolume: (volumePercent: number) => Promise<void>;
  player?: SpotifyWebPlayback | null;
};

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export function SpotifyProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<SpotifyWebPlayback | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [playbackState, setPlaybackState] = useState<any | null>(null);

  const { setCurrentTrack: setPlayerContextTrack, setIsPlaying } = usePlayer();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session?.provider_token) {
        setIsAuthenticated(true);
        setAccessToken(session.provider_token);
      } else {
        setIsAuthenticated(false);
        setAccessToken(null);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.provider_token) {
          setIsAuthenticated(true);
          setAccessToken(session.provider_token);
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setAccessToken(null);

          // Disconnect player on sign out
          if (player) {
            player.disconnect();
            setPlayer(null);
          }
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [player]);

  // Initialize Spotify player when authenticated
  useEffect(() => {
    if (!isAuthenticated || !accessToken || typeof window === "undefined") {
      return;
    }

    const initializePlayer = async () => {
      try {
        const getOAuthToken = (cb: (token: string) => void) => {
          cb(accessToken);
        };

        const webPlayback = new SpotifyWebPlayback(
          getOAuthToken,
          "Play Music App",
        );

        webPlayback.onReady((deviceId) => {
          setDeviceId(deviceId);
          setIsPlayerReady(true);
        });

        webPlayback.onPlayerStateChanged((state) => {
          setPlaybackState(state);

          if (state) {
            setIsPlaying(!state.paused);
          } else {
            setIsPlaying(false);
          }
        });

        webPlayback.onTrackChanged((track) => {
          setCurrentTrack(track);

          // Update PlayerContext
          setPlayerContextTrack({
            title: track.name,
            artist: track.artists.map((a: any) => a.name).join(", "),
            album: track.album.name,
            cover: track.album.images[0]?.url ?? "",
            duration: formatDuration(track.duration ?? 0),
            explicit: false,
          });
        });

        webPlayback.onError((error) => {
          console.error("Spotify player error:", error);
        });

        const success = await webPlayback.initialize();

        if (success) {
          setPlayer(webPlayback);
        }
      } catch (error) {
        console.error("Failed to initialize Spotify player:", error);
      }
    };

    initializePlayer();

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [isAuthenticated, accessToken, setIsPlaying, setPlayerContextTrack]);

  // Helper function to format duration
  const formatDuration = (durationMs: number): string => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  // Login with Spotify
  const login = useCallback(async () => {
    try {
      await spotifyApi.signInWithSpotify();
    } catch (error) {
      console.error("Error signing in with Spotify:", error);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      if (player) {
        player.disconnect();
        setPlayer(null);
      }

      await spotifyApi.signOut();
      setIsAuthenticated(false);
      setAccessToken(null);
      setIsPlayerReady(false);
      setDeviceId(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [player]);

  // Play
  const play = useCallback(
    async (uri?: string, positionMs?: number) => {
      try {
        if (player && isPlayerReady) {
          await player.play(uri, positionMs);
        }
      } catch (error) {
        console.error("Error playing track:", error);
      }
    },
    [player, isPlayerReady],
  );

  // Pause
  const pause = useCallback(async () => {
    try {
      if (player) {
        await player.pause();
      }
    } catch (error) {
      console.error("Error pausing playback:", error);
    }
  }, [player]);

  // Resume
  const resume = useCallback(async () => {
    try {
      if (player) {
        await player.resume();
      }
    } catch (error) {
      console.error("Error resuming playback:", error);
    }
  }, [player]);

  // Toggle play/pause
  const togglePlay = useCallback(async () => {
    try {
      if (player) {
        await player.togglePlay();
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  }, [player]);

  // Next track
  const nextTrack = useCallback(async () => {
    try {
      if (player) {
        await player.nextTrack();
      }
    } catch (error) {
      console.error("Error skipping to next track:", error);
    }
  }, [player]);

  // Previous track
  const previousTrack = useCallback(async () => {
    try {
      if (player) {
        await player.previousTrack();
      }
    } catch (error) {
      console.error("Error skipping to previous track:", error);
    }
  }, [player]);

  // Seek
  const seek = useCallback(
    async (positionMs: number) => {
      try {
        if (player) {
          await player.seek(positionMs);
        }
      } catch (error) {
        console.error("Error seeking playback position:", error);
      }
    },
    [player],
  );

  // Set volume
  const setVolume = useCallback(
    async (volumePercent: number) => {
      try {
        if (player) {
          await player.setVolume(volumePercent);
        }
      } catch (error) {
        console.error("Error setting volume:", error);
      }
    },
    [player],
  );

  return (
    <SpotifyContext.Provider
      value={{
        isAuthenticated,
        isPlayerReady,
        deviceId,
        currentTrack,
        playbackState,
        login,
        logout,
        play,
        pause,
        resume,
        togglePlay,
        nextTrack,
        previousTrack,
        seek,
        setVolume,
        player,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
}
