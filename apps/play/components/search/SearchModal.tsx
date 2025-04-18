"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSpotify } from "../../hooks/useSpotify";
import { useRouter } from "next/navigation";
import { formatDuration } from "../../utils/formatDuration";

interface SpotifyImage {
  url: string;
}

interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  images: SpotifyImage[];
}

interface SpotifyAlbum {
  id: string;
  name: string;
  uri: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
}

interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  duration_ms: number;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  uri: string;
  images: SpotifyImage[];
}

interface SpotifySearchResponse {
  tracks?: { items: SpotifyTrack[] };
  artists?: { items: SpotifyArtist[] };
  albums?: { items: SpotifyAlbum[] };
  playlists?: { items: SpotifyPlaylist[] };
}

type SearchResult = {
  id: string;
  uri: string;
  name: string;
  type: "track" | "artist" | "album" | "playlist";
  images: string[];
  artists?: string[];
  album?: string;
  duration_ms?: number;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const spotify = useSpotify();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle search query
  useEffect(() => {
    const searchSpotify = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/spotify/search?q=${encodeURIComponent(query)}`,
        );
        const data = (await response.json()) as SpotifySearchResponse;

        const formattedResults: SearchResult[] = [];

        // Add tracks
        if (data.tracks?.items) {
          formattedResults.push(
            ...data.tracks.items.map((track) => ({
              id: track.id,
              uri: track.uri,
              name: track.name,
              type: "track" as const,
              images: track.album.images.map((img) => img.url),
              artists: track.artists.map((artist) => artist.name),
              album: track.album.name,
              duration_ms: track.duration_ms,
            })),
          );
        }

        // Add artists
        if (data.artists?.items) {
          formattedResults.push(
            ...data.artists.items.map((artist) => ({
              id: artist.id,
              uri: artist.uri,
              name: artist.name,
              type: "artist" as const,
              images: artist.images.map((img) => img.url),
            })),
          );
        }

        // Add albums
        if (data.albums?.items) {
          formattedResults.push(
            ...data.albums.items.map((album) => ({
              id: album.id,
              uri: album.uri,
              name: album.name,
              type: "album" as const,
              images: album.images.map((img) => img.url),
              artists: album.artists.map((artist) => artist.name),
            })),
          );
        }

        // Add playlists
        if (data.playlists?.items) {
          formattedResults.push(
            ...data.playlists.items.map((playlist) => ({
              id: playlist.id,
              uri: playlist.uri,
              name: playlist.name,
              type: "playlist" as const,
              images: playlist.images.map((img) => img.url),
            })),
          );
        }

        setResults(formattedResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        void searchSpotify();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      scrollResultIntoView();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      scrollResultIntoView();
    } else if (e.key === "Enter" && results[activeIndex]) {
      handleSelectResult(results[activeIndex]);
    }
  };

  const scrollResultIntoView = () => {
    if (resultsRef.current) {
      const activeElement = resultsRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  };

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    if (!spotify.isAuthenticated) {
      void spotify.login();
      return;
    }

    if (result.type === "track") {
      // Play the track - handle premium vs non-premium
      if (spotify.isPremium) {
        // For premium users, play directly in the app
        void spotify.play(result.uri);
      } else {
        // For non-premium users, open in Spotify app
        void spotify.openSpotifyApp(result.uri);
      }
      onClose();
    } else if (result.type === "artist") {
      // Navigate to artist page or open in Spotify
      if (spotify.isPremium) {
        router.push(`/artist/${result.id}`);
      } else {
        void spotify.openSpotifyApp(result.uri);
      }
      onClose();
    } else if (result.type === "album") {
      // Navigate to album page or open in Spotify
      if (spotify.isPremium) {
        router.push(`/album/${result.id}`);
      } else {
        void spotify.openSpotifyApp(result.uri);
      }
      onClose();
    } else if (result.type === "playlist") {
      // Navigate to playlist page or open in Spotify
      if (spotify.isPremium) {
        router.push(`/playlist/${result.id}`);
      } else {
        void spotify.openSpotifyApp(result.uri);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-32">
      <div className="w-full max-w-2xl rounded-xl bg-neutral-900 shadow-2xl">
        <div className="flex items-center border-b border-white/10 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-3 h-5 w-5 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for songs, artists, albums..."
            className="flex-1 bg-transparent py-2 text-white outline-none"
            autoComplete="off"
          />
          {isLoading && (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-500 border-t-white"></div>
          )}
          <button
            onClick={onClose}
            className="ml-2 rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          ref={resultsRef}
          className="max-h-[70vh] overflow-y-auto p-2"
          onKeyDown={handleKeyDown}
        >
          {results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={`${result.type}-${result.id}`}
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 ${
                  activeIndex === index
                    ? "bg-neutral-800"
                    : "hover:bg-neutral-800"
                }`}
                onClick={() => handleSelectResult(result)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* Thumbnail */}
                <div className="relative h-12 w-12 overflow-hidden rounded-md bg-neutral-800">
                  {result.images && result.images.length > 0 ? (
                    <Image
                      src={result.images[0] || "/placeholder-cover.png"}
                      alt={result.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      {result.type === "track" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-neutral-400"
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
                      ) : result.type === "artist" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-neutral-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-neutral-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 overflow-hidden">
                  <div className="truncate text-white">{result.name}</div>
                  <div className="truncate text-sm text-neutral-400">
                    {result.type === "track" && (
                      <>
                        {result.artists?.join(", ")} • {result.album}
                      </>
                    )}
                    {result.type === "album" && (
                      <>{result.artists?.join(", ")}</>
                    )}
                    {result.type === "artist" && "Artist"}
                    {result.type === "playlist" && "Playlist"}
                  </div>
                </div>

                {/* Type indicator and duration for tracks */}
                <div className="flex items-center text-neutral-500">
                  {result.type === "track" && result.duration_ms && (
                    <span className="mr-3 text-sm">
                      {formatDuration(result.duration_ms)}
                    </span>
                  )}
                  <span className="rounded bg-neutral-800 px-2 py-1 text-xs capitalize">
                    {result.type}
                  </span>
                </div>
              </div>
            ))
          ) : query.trim() ? (
            <div className="p-4 text-center text-neutral-400">
              {isLoading ? "Searching..." : "No results found"}
            </div>
          ) : (
            <div className="p-4 text-center text-neutral-400">
              Search for songs, artists, albums or playlists
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-4 text-center text-xs text-neutral-500">
          <div className="mb-1">
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded border border-neutral-500 text-xs">
              ↑
            </span>
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded border border-neutral-500 text-xs">
              ↓
            </span>
            to navigate
          </div>
          <div>
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded border border-neutral-500 text-xs">
              ↵
            </span>
            to select
            <span className="mx-2 inline-flex h-5 w-5 items-center justify-center rounded border border-neutral-500 text-xs">
              Esc
            </span>
            to close
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
