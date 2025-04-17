"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode, SyntheticEvent } from "react";
import {
  supabase,
  signInWithSpotify,
  signOut,
} from "../../../packages/supabase";
import { SpotifyWebPlayback } from "../../../packages/supabase/spotify-player";
import * as spotifyApi from "../../../packages/supabase/spotify";

// Define types (reverting state to unknown)
interface SpotifyContextType {
  isAuthenticated: boolean;
  isPlayerReady: boolean;
  isPremium: boolean;
  deviceId: string | null;
  currentTrack: unknown | null;
  playbackState: unknown | null;
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
  openSpotifyApp: (uri?: string) => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export { SpotifyContext };

export function SpotifyProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<SpotifyWebPlayback | null>(null);
  const [currentTrack, setCurrentTrack] = useState<unknown | null>(null);
  const [playbackState, setPlaybackState] = useState<unknown | null>(null);

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

    void checkAuth();

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

  // Check if user has premium subscription
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!isAuthenticated || !accessToken) return;

      try {
        // Get current user profile
        const userProfile = await spotifyApi.getCurrentUserProfile();

        if (userProfile && userProfile.product === "premium") {
          setIsPremium(true);
        } else {
          setIsPremium(false);
          console.log("Spotify Web Playback SDK requires a Premium account");
        }
      } catch (error) {
        console.error("Failed to check premium status:", error);
        setIsPremium(false);
      }
    };

    void checkPremiumStatus();
  }, [isAuthenticated, accessToken]);

  // Initialize Spotify player when authenticated AND user has premium
  useEffect(() => {
    if (
      !isAuthenticated ||
      !accessToken ||
      !isPremium ||
      typeof window === "undefined"
    ) {
      return;
    }

    const initializePlayer = async () => {
      try {
        const getOAuthToken = (cb: (token: string) => void) => {
          if (accessToken) {
            cb(accessToken);
          } else {
            console.error(
              "Attempted to get OAuth token, but accessToken is null",
            );
          }
        };

        const webPlayback = new SpotifyWebPlayback(
          getOAuthToken,
          "Play Music App",
        );

        webPlayback.onReady((newDeviceId) => {
          console.log("Spotify Player Ready with Device ID:", newDeviceId);
          setDeviceId(newDeviceId);
          setIsPlayerReady(true);
        });

        webPlayback.onPlayerStateChanged((state) => {
          console.log("Spotify Player State Changed:", state);
          setPlaybackState(state);
        });

        webPlayback.onTrackChanged((track) => {
          console.log("Spotify Track Changed:", track);
          setCurrentTrack(track);
        });

        webPlayback.onError((error) => {
          console.error("Spotify player error:", error);
        });

        const success = await webPlayback.initialize();
        console.log("Spotify Player Initialization Success:", success);

        if (success) {
          setPlayer(webPlayback);
        } else {
          setIsPlayerReady(false);
        }
      } catch (error) {
        console.error("Failed to initialize Spotify player:", error);
        setIsPlayerReady(false);
      }
    };

    void initializePlayer();

    return () => {
      if (player) {
        console.log("Disconnecting Spotify player");
        player.disconnect();
        setPlayer(null);
        setIsPlayerReady(false);
        setDeviceId(null);
        setPlaybackState(null);
        setCurrentTrack(null);
      }
    };
  }, [isAuthenticated, accessToken, isPremium]);

  // Login with Spotify
  const login = useCallback(async () => {
    const { error } = await signInWithSpotify();
    if (error) console.error("Spotify Login Error:", error);
  }, []);

  // Logout
  const logoutUser = useCallback(async () => {
    const { error } = await signOut();
    if (error) console.error("Sign Out Error:", error);
    setIsAuthenticated(false);
    setAccessToken(null);
    setIsPremium(false);
    setIsPlayerReady(false);
    setDeviceId(null);
    setPlaybackState(null);
    setCurrentTrack(null);
  }, []);

  // Function to open the Spotify app (alternative for non-premium users)
  const openSpotifyApp = useCallback((uri?: string) => {
    if (!uri) {
      console.warn("No URI provided to openSpotifyApp");
      window.open("spotify:", "_blank");
      return;
    }
    if (
      uri.startsWith("spotify:track:") ||
      uri.startsWith("spotify:album:") ||
      uri.startsWith("spotify:artist:") ||
      uri.startsWith("spotify:playlist:")
    ) {
      window.open(uri, "_blank");
    } else {
      console.warn("Attempted to open invalid Spotify URI:", uri);
      window.open("https://open.spotify.com", "_blank");
    }
  }, []);

  // Play function with fallback for non-premium users
  const play = useCallback(
    async (uri?: string, positionMs?: number) => {
      if (!deviceId) {
        console.error("Cannot play: No active Spotify device ID");
        return;
      }
      try {
        // Pass uri directly as string | undefined
        // The API function likely expects a context_uri or nothing (for resume)
        // Playing specific track URIs might need a different approach (e.g., using 'uris' body param)
        await spotifyApi.startPlayback(deviceId, uri, undefined, positionMs);
      } catch (error) {
        console.error("Failed to play track/context:", error);
      }
    },
    [deviceId],
  );

  // Pause
  const pause = useCallback(async () => {
    if (!deviceId) return;
    try {
      await spotifyApi.pausePlayback(deviceId);
    } catch (error) {
      console.error("Failed to pause playback:", error);
    }
  }, [deviceId]);

  // Resume
  const resume = useCallback(async () => {
    if (!deviceId) return;
    try {
      // Pass undefined for context_uri to resume
      await spotifyApi.startPlayback(deviceId, undefined, undefined, undefined);
    } catch (error) {
      console.error("Failed to resume playback:", error);
    }
  }, [deviceId]);

  // Toggle play/pause
  const togglePlay = useCallback(async () => {
    const state = playbackState as { paused?: boolean } | null;
    if (!state) return;
    if (state.paused) {
      await resume();
    } else {
      await pause();
    }
  }, [playbackState, resume, pause]);

  // Next track
  const nextTrack = useCallback(async () => {
    if (!deviceId) return;
    try {
      await spotifyApi.skipToNext(deviceId);
    } catch (error) {
      console.error("Failed to skip to next track:", error);
    }
  }, [deviceId]);

  // Previous track
  const previousTrack = useCallback(async () => {
    if (!deviceId) return;
    try {
      await spotifyApi.skipToPrevious(deviceId);
    } catch (error) {
      console.error("Failed to skip to previous track:", error);
    }
  }, [deviceId]);

  // Seek
  const seek = useCallback(
    async (positionMs: number) => {
      if (!deviceId) return;
      try {
        await spotifyApi.seekToPosition(positionMs, deviceId);
      } catch (error) {
        console.error("Failed to seek:", error);
      }
    },
    [deviceId],
  );

  // Set volume
  const setVolume = useCallback(
    async (volumePercent: number) => {
      if (!deviceId) return;
      const clampedVolume = Math.max(
        0,
        Math.min(100, Math.round(volumePercent)),
      );
      try {
        console.warn(
          "'setPlaybackVolume' functionality not implemented in spotifyApi module.",
        );
      } catch (error) {
        console.error("Failed to set volume:", error);
      }
    },
    [deviceId],
  );

  // Context value
  const value: SpotifyContextType = {
    isAuthenticated,
    isPlayerReady,
    isPremium,
    deviceId,
    currentTrack,
    playbackState,
    login,
    logout: logoutUser,
    play,
    pause,
    resume,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    player,
    openSpotifyApp,
  };

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
}
