# supabase

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# Spotify Integration with Supabase

This package provides integration with Spotify Web API and Spotify Web Playback SDK for the Play Music application, using Supabase for authentication and database.

## Setup

### 1. Create a Spotify Developer Application

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app details:
   - App name: "Play"
   - App description: "Web-based music player"
   - Website: "https://play-music.app" (or your domain)
   - Redirect URI: "http://localhost:3000/auth/callback" for local development
5. Accept the terms and create the app
6. Note down the Client ID and Client Secret
7. In the app settings:
   - Add additional Redirect URIs for your production domain
   - Add your production domain to the allowlist

### 2. Configure Supabase Authentication

1. Go to your Supabase project dashboard
2. Navigate to Authentication → Providers
3. Enable and configure Spotify:
   - Enable Spotify
   - Enter the Client ID and Client Secret from your Spotify Developer App
   - Set the Redirect URL to match your application's callback URL
   - Set scopes to: `user-read-email user-read-private streaming user-library-read user-library-modify user-read-playback-state user-modify-playback-state`

### 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Paste the contents of `schema.sql` and run it
5. This will create the tables and security policies needed for the application

### 4. Configure Environment Variables

Add the following environment variables to your .env file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your-spotify-client-id
```

### 5. Import and Use the Package

```typescript
// Supabase Client
import { supabase } from "supabase";

// Spotify API
import * as spotifyApi from "supabase/spotify";

// Spotify Web Playback SDK
import { SpotifyWebPlayback } from "supabase/spotify-player";
```

## Usage

### Authentication

Use the Supabase client to authenticate with Spotify:

```typescript
// Login with Spotify
const login = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: {
      scopes:
        "user-read-email user-read-private streaming user-library-read user-library-modify user-read-playback-state user-modify-playback-state",
    },
  });

  if (error) {
    console.error("Error signing in with Spotify:", error);
    return;
  }

  // User logged in successfully
  console.log("User signed in:", data);
};

// Logout
const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    return;
  }

  // User logged out successfully
};
```

### Spotify Web API

Use the Spotify API client to interact with the Spotify Web API:

```typescript
// Search for tracks
const searchTracks = async (query: string) => {
  try {
    const results = await spotifyApi.search(query, "track");
    console.log("Search results:", results);
  } catch (error) {
    console.error("Error searching tracks:", error);
  }
};

// Play a track
const playTrack = async (uri: string) => {
  try {
    await spotifyApi.startPlayback(deviceId, null, [uri]);
  } catch (error) {
    console.error("Error playing track:", error);
  }
};
```

### Spotify Web Playback SDK

Use the Web Playback SDK for playback in the browser:

```typescript
// Initialize the player
const initPlayer = async () => {
  const getOAuthToken = (cb: (token: string) => void) => {
    // Get the token from Supabase session
    const session = supabase.auth.session();
    cb(session?.provider_token || "");
  };

  const player = new SpotifyWebPlayback(getOAuthToken, "Play Web Player");

  player.onReady((deviceId) => {
    console.log("Player ready with device ID:", deviceId);
    // Save the device ID for later use
  });

  player.onPlayerStateChanged((state) => {
    if (state) {
      console.log("Currently playing:", state.track_window.current_track.name);
      console.log("Playback state:", state.paused ? "Paused" : "Playing");
    }
  });

  const success = await player.initialize();

  if (success) {
    console.log("Spotify Web Playback SDK initialized successfully");
  } else {
    console.error("Failed to initialize Spotify Web Playback SDK");
  }
};
```

## React Context

For React applications, use the provided SpotifyContext to access Spotify functionality throughout your app:

```tsx
import { SpotifyProvider, useSpotify } from "../../context/SpotifyContext";

// Wrap your application with the provider
const App = () => {
  return (
    <SpotifyProvider>
      <YourApp />
    </SpotifyProvider>
  );
};

// Use the hook in your components
const Player = () => {
  const spotify = useSpotify();

  return (
    <div>
      {spotify.isAuthenticated ? (
        <div>
          <button onClick={() => spotify.togglePlay()}>
            {spotify.playbackState?.paused ? "Play" : "Pause"}
          </button>
          <button onClick={() => spotify.nextTrack()}>Next</button>
          <button onClick={() => spotify.previousTrack()}>Previous</button>
        </div>
      ) : (
        <button onClick={spotify.login}>Connect with Spotify</button>
      )}
    </div>
  );
};
```
