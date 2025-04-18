import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: z.string(),
    NEXT_PUBLIC_PLAY_DOMAIN: z.string().default("play-music.app"),
    NEXT_PUBLIC_ARTIST_DOMAIN: z.string().default("artist.play-music.app"),
    NEXT_PUBLIC_PLAY_URL: z.string().default("https://play-music.app"),
    NEXT_PUBLIC_ARTIST_URL: z.string().default("https://artist.play-music.app"),
    NEXT_PUBLIC_PRODUCTION_URL: z.string().default("https://play-music.app"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    NEXT_PUBLIC_PLAY_DOMAIN: process.env.NEXT_PUBLIC_PLAY_DOMAIN,
    NEXT_PUBLIC_ARTIST_DOMAIN: process.env.NEXT_PUBLIC_ARTIST_DOMAIN,
    NEXT_PUBLIC_PLAY_URL: process.env.NEXT_PUBLIC_PLAY_URL,
    NEXT_PUBLIC_ARTIST_URL: process.env.NEXT_PUBLIC_ARTIST_URL,
    NEXT_PUBLIC_PRODUCTION_URL: process.env.NEXT_PUBLIC_PRODUCTION_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
