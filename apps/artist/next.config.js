/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./env.js";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@play/ui"], // Ensure shared UI package is transpiled
  images: {
    domains: ["artist.play-music.app", "play-music.app"],
  },
};

export default config;
