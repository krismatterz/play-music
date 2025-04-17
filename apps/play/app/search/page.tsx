"use client";

import React, { useEffect } from "react";
import { useSearchModal } from "../../hooks/useSearchModal";
import SmartPlaylistView from "../../components/player/SmartPlaylistView";

export default function SearchPage() {
  const { openSearch } = useSearchModal();

  // Automatically open search modal when visiting this page
  useEffect(() => {
    // Small delay to ensure the UI is ready
    const timer = setTimeout(() => {
      openSearch();
    }, 100);

    return () => clearTimeout(timer);
  }, [openSearch]);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Search</h1>

      <div className="mb-6">
        <button
          onClick={openSearch}
          className="flex items-center rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
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
          Search for artists, songs, or playlists (⌘K)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Recommended for you</h2>
          <SmartPlaylistView />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Recent searches</h2>
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-neutral-400">
              Your search history will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
