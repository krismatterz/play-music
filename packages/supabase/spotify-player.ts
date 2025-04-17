// Define types for Spotify Web Playback SDK
interface SpotifyPlayer {
  _options: {
    getOAuthToken: (cb: (token: string) => void) => void;
    name: string;
    id: string;
  };
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (...args: any[]) => void) => boolean;
  removeListener: (
    event: string,
    callback?: (...args: any[]) => void,
  ) => boolean;
  getCurrentState: () => Promise<Spotify.PlaybackState | null>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

// Spotify Web Playback SDK states and errors
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: any) => SpotifyPlayer;
    };
  }
}

namespace Spotify {
  export interface PlaybackState {
    context: {
      uri: string;
      metadata: Record<string, unknown>;
    };
    disallows: {
      pausing: boolean;
      peeking_next: boolean;
      peeking_prev: boolean;
      resuming: boolean;
      seeking: boolean;
      skipping_next: boolean;
      skipping_prev: boolean;
    };
    duration: number;
    paused: boolean;
    position: number;
    repeat_mode: number;
    shuffle: boolean;
    track_window: {
      current_track: WebPlaybackTrack;
      previous_tracks: WebPlaybackTrack[];
      next_tracks: WebPlaybackTrack[];
    };
  }

  export interface WebPlaybackTrack {
    uri: string;
    id: string;
    type: string;
    media_type: string;
    name: string;
    is_playable: boolean;
    album: {
      uri: string;
      name: string;
      images: { url: string }[];
    };
    artists: {
      uri: string;
      name: string;
    }[];
  }
}

// Utility function to load the Spotify Web Playback SDK script
export function loadSpotifyScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("spotify-player")) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = "spotify-player";
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    script.onload = () => resolve();
    script.onerror = (error) =>
      reject(
        new Error(`Spotify Web Playback SDK script failed to load: ${error}`),
      );

    document.body.appendChild(script);
  });
}

// Class to manage the Spotify Web Playback SDK player
export class SpotifyWebPlayback {
  private player: SpotifyPlayer | null = null;
  private deviceId: string | null = null;
  private isReady = false;
  private getOAuthToken: (cb: (token: string) => void) => void;
  private volume = 0.5;
  private playerName: string;

  // Event callbacks
  private onReadyCallback: ((deviceId: string) => void) | null = null;
  private onNotReadyCallback: (() => void) | null = null;
  private onPlayerStateChangedCallback:
    | ((state: Spotify.PlaybackState | null) => void)
    | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;
  private onTrackChangedCallback:
    | ((track: Spotify.WebPlaybackTrack) => void)
    | null = null;

  constructor(
    getOAuthToken: (cb: (token: string) => void) => void,
    playerName = "Play Web Player",
  ) {
    this.getOAuthToken = getOAuthToken;
    this.playerName = playerName;
  }

  // Initialize the player
  async initialize(): Promise<boolean> {
    try {
      await loadSpotifyScript();

      return new Promise((resolve) => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          this.player = new window.Spotify.Player({
            name: this.playerName,
            getOAuthToken: this.getOAuthToken,
            volume: this.volume,
          });

          // Error handling
          this.player.addListener("initialization_error", ({ message }) => {
            console.error("Initialization error:", message);
            if (this.onErrorCallback)
              this.onErrorCallback(
                new Error(`Initialization error: ${message}`),
              );
          });

          this.player.addListener("authentication_error", ({ message }) => {
            console.error("Authentication error:", message);
            if (this.onErrorCallback)
              this.onErrorCallback(
                new Error(`Authentication error: ${message}`),
              );
          });

          this.player.addListener("account_error", ({ message }) => {
            console.error("Account error:", message);
            if (this.onErrorCallback)
              this.onErrorCallback(new Error(`Account error: ${message}`));
          });

          this.player.addListener("playback_error", ({ message }) => {
            console.error("Playback error:", message);
            if (this.onErrorCallback)
              this.onErrorCallback(new Error(`Playback error: ${message}`));
          });

          // Playback status updates
          this.player.addListener("player_state_changed", (state) => {
            if (this.onPlayerStateChangedCallback)
              this.onPlayerStateChangedCallback(state);

            if (state && this.onTrackChangedCallback) {
              this.onTrackChangedCallback(state.track_window.current_track);
            }
          });

          // Ready
          this.player.addListener("ready", ({ device_id }) => {
            this.deviceId = device_id;
            this.isReady = true;
            console.log(
              "Spotify Web Playback SDK ready with Device ID:",
              device_id,
            );
            if (this.onReadyCallback) this.onReadyCallback(device_id);
          });

          // Not ready
          this.player.addListener("not_ready", ({ device_id }) => {
            this.deviceId = device_id;
            this.isReady = false;
            console.log("Device has gone offline:", device_id);
            if (this.onNotReadyCallback) this.onNotReadyCallback();
          });

          // Connect to the player
          this.player.connect().then((success) => {
            if (success) {
              console.log("Spotify Web Playback SDK successfully connected!");
            }
            resolve(success);
          });
        };
      });
    } catch (error) {
      console.error("Failed to initialize Spotify Web Playback SDK:", error);
      if (this.onErrorCallback)
        this.onErrorCallback(
          error instanceof Error ? error : new Error(String(error)),
        );
      return false;
    }
  }

  // Disconnect the player
  disconnect(): void {
    if (this.player) {
      this.player.disconnect();
      this.player = null;
      this.deviceId = null;
      this.isReady = false;
    }
  }

  // Get current playback state
  async getState(): Promise<Spotify.PlaybackState | null> {
    if (!this.player) return null;
    return await this.player.getCurrentState();
  }

  // Set event listeners
  onReady(callback: (deviceId: string) => void): void {
    this.onReadyCallback = callback;
    if (this.isReady && this.deviceId && callback) {
      callback(this.deviceId);
    }
  }

  onNotReady(callback: () => void): void {
    this.onNotReadyCallback = callback;
  }

  onPlayerStateChanged(
    callback: (state: Spotify.PlaybackState | null) => void,
  ): void {
    this.onPlayerStateChangedCallback = callback;
  }

  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  onTrackChanged(callback: (track: Spotify.WebPlaybackTrack) => void): void {
    this.onTrackChangedCallback = callback;
  }

  // Playback controls
  async play(spotifyUri?: string, positionMs?: number): Promise<void> {
    if (!this.player || !this.deviceId) return;

    try {
      const token = await new Promise<string>((resolve) =>
        this.getOAuthToken(resolve),
      );

      const body: any = {};
      if (spotifyUri) {
        if (spotifyUri.includes("track")) {
          body.uris = [spotifyUri];
        } else {
          body.context_uri = spotifyUri;
        }
      }

      if (positionMs !== undefined) {
        body.position_ms = positionMs;
      }

      const url = `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`;
      await fetch(url, {
        method: "PUT",
        body: Object.keys(body).length ? JSON.stringify(body) : undefined,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error starting playback:", error);
      if (this.onErrorCallback)
        this.onErrorCallback(
          error instanceof Error ? error : new Error(String(error)),
        );
    }
  }

  async pause(): Promise<void> {
    if (!this.player) return;
    try {
      await this.player.pause();
    } catch (error) {
      console.error("Error pausing playback:", error);
      if (this.onErrorCallback)
        this.onErrorCallback(
          error instanceof Error ? error : new Error(String(error)),
        );
    }
  }

  async resume(): Promise<void> {
    if (!this.player) return;
    try {
      await this.player.resume();
    } catch (error) {
      console.error("Error resuming playback:", error);
      if (this.onErrorCallback)
        this.onErrorCallback(
          error instanceof Error ? error : new Error(String(error)),
        );
    }
  }

  async togglePlay(): Promise<void> {
    if (!this.player) return;
    try {
      await this.player.togglePlay();
    } catch (error) {
      console.error("Error toggling playback:", error);
      if (this.onErrorCallback)
        this.onErrorCallback(
          error instanceof Error ? error : new Error(String(error)),
        );
    }
  }

  async nextTrack(): Promise<void> {
    if (!this.player) return;
    try {
      await this.player.nextTrack();
    } catch (error) {
      console.error("Error skipping to next track:", error);
      if (this.onErrorCallback)
        this.onErrorCallback(
          error instanceof Error ? error : new Error(String(error)),
        );
    }
  }

  async previousTrack(): Promise<void> {
    if (!this.player) return;
    try {
      await this.player.previousTrack();
    } catch (error) {
      console.error("Error skipping to previous track:", error);
      if (this.onErrorCallback)
        this.onErrorCallback(
          error instanceof Error ? error : new Error(String(error)),
        );
    }
  }

  async seek(positionMs: number): Promise<void> {
    if (!this.player) return;
    try {
      await this.player.seek(positionMs);
    } catch (error) {
      console.error("Error seeking playback position:", error);
      if (this.onErrorCallback)
        this.onErrorCallback(
          error instanceof Error ? error : new Error(String(error)),
        );
    }
  }

  async setVolume(volumePercent: number): Promise<void> {
    if (!this.player) return;
    try {
      const volume = Math.min(1, Math.max(0, volumePercent / 100));
      this.volume = volume;
      await this.player.setVolume(volume);
    } catch (error) {
      console.error("Error setting volume:", error);
      if (this.onErrorCallback)
        this.onErrorCallback(
          error instanceof Error ? error : new Error(String(error)),
        );
    }
  }

  async getVolume(): Promise<number> {
    if (!this.player) return this.volume;
    try {
      return await this.player.getVolume();
    } catch (error) {
      console.error("Error getting volume:", error);
      if (this.onErrorCallback)
        this.onErrorCallback(
          error instanceof Error ? error : new Error(String(error)),
        );
      return this.volume;
    }
  }

  // Get device information
  getDeviceId(): string | null {
    return this.deviceId;
  }

  isPlayerReady(): boolean {
    return this.isReady;
  }
}
