/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./env.js";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["supabase"], // Ensure Supabase package is transpiled
  experimental: {
    externalDir: true, // Allow importing from outside the app directory
  },
  images: {
    domains: ["play-music.app"],
  },
};

export default config;
