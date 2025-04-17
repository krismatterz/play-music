"use client";

import React, { useEffect, useState } from "react";
import { useSpotify } from "../../hooks/useSpotify";
import Image from "next/image";
import Link from "next/link";
import { formatDuration } from "../../utils/formatDuration";

// Types
interface PlaylistItem {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
}

export default function LibraryPage() {
  const spotify = useSpotify();
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaylists() {
      if (!spotify.isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/spotify/playlists");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.items) {
          setPlaylists(data.items);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlaylists();
  }, [spotify.isAuthenticated]);

  const handleConnectClick = () => {
    spotify.login();
  };

  if (!spotify.isAuthenticated && !isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Connect Your Spotify</h1>
          <p className="text-gray-400">
            Sign in with your Spotify account to see your playlists, liked
            songs, and more.
          </p>
        </div>
        <button
          onClick={handleConnectClick}
          className="flex items-center gap-2 rounded-full bg-green-500 px-8 py-3 font-semibold text-black transition hover:bg-green-400"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.02 14.15c-.18.29-.6.39-.92.24-2.53-1.54-5.72-1.9-9.47-1.04-.33.08-.66-.16-.74-.48-.08-.32.16-.66.48-.74 4.1-.95 7.64-.53 10.4 1.19.33.18.43.6.25.92zm1.07-2.38c-.23.37-.72.48-1.08.25-2.89-1.78-7.31-2.29-10.74-.84-.36.12-.76-.07-.88-.43-.12-.36.07-.76.43-.88 3.9-1.19 8.75-.61 12.02 1.5.36.23.47.72.25 1.08zm.1-2.45c-.33.5-1.04.65-1.54.31-3.32-2.03-8.36-2.23-12.28-.83-.52.16-1.06-.13-1.22-.64-.16-.52.13-1.06.64-1.22 4.48-1.36 10.13-1.1 13.89 1.26.49.3.65 1.02.31 1.54z" />
          </svg>
          Connect with Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-8 text-3xl font-bold">Your Library</h1>

      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Playlists</h2>
              <Link
                href="/search"
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
              >
                Find more music
              </Link>
            </div>

            {playlists.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-md bg-zinc-800/40 p-3 transition-all duration-200 hover:bg-zinc-800/80"
                    onClick={() =>
                      spotify.isAuthenticated &&
                      window.location.assign(`/playlist/${playlist.id}`)
                    }
                  >
                    <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md bg-zinc-800/80 shadow-lg">
                      {playlist.images && playlist.images[0] ? (
                        <Image
                          src={
                            playlist.images[0].url ||
                            "/placeholder-playlist.jpg"
                          }
                          alt={playlist.name}
                          fill
                          className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-zinc-800">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-zinc-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 truncate font-semibold">
                        {playlist.name}
                      </h3>
                      <p className="line-clamp-2 text-sm text-zinc-400">
                        {playlist.description ||
                          `By ${playlist.owner?.display_name || "You"}`}
                      </p>
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                      {playlist.tracks?.total || 0} tracks
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-zinc-800/40 p-8 text-center">
                <p className="mb-4 text-zinc-400">
                  You don't have any playlists yet.
                </p>
                <Link
                  href="/search"
                  className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create a playlist
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
