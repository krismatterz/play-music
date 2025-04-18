import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string): string {
  return getAppUrl(path);
}

export function getMarketingUrl(path = ""): string {
  const isDevelopment = process.env.NODE_ENV === "development";
  const baseUrl = isDevelopment
    ? "http://localhost:3000"
    : "https://play-music.app";

  // Marketing site should not have trailing paths in production
  if (!isDevelopment) {
    return baseUrl;
  }

  // In development, allow paths
  return path ? `${baseUrl}${path}` : baseUrl;
}

export function getAppUrl(path = ""): string {
  const isDevelopment = process.env.NODE_ENV === "development";
  const baseUrl = isDevelopment
    ? "http://localhost:3001"
    : "https://artist.play-music.app";

  // App should always include the path, but ensure it starts with a slash
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${formattedPath}`;
}
