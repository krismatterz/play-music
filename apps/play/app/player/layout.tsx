"use client";

import React from "react";
import NowPlaying from "../../components/ui/NowPlaying";
import Link from "next/link";
import SearchModal from "../../components/search/SearchModal";
import { useSearchModal } from "../../hooks/useSearchModal";

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSearchOpen, openSearch, closeSearch } = useSearchModal();

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left sidebar for navigation */}
      <div className="w-64 flex-shrink-0 border-r border-white/10 p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Play</h1>
        </div>

        <nav className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-neutral-400 uppercase">
              Menu
            </h2>
            <div className="space-y-1">
              <Link
                href="/player"
                className="block rounded bg-white/10 px-3 py-2 font-medium text-white"
              >
                Player
              </Link>
              <Link
                href="/search"
                className="flex w-full items-center justify-between rounded px-3 py-2 font-medium text-white hover:bg-white/10"
              >
                <span>Search</span>
                <kbd className="hidden rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-xs text-neutral-400 sm:inline-block">
                  ⌘K
                </kbd>
              </Link>
              <Link
                href="/library"
                className="block rounded px-3 py-2 font-medium text-white hover:bg-white/10"
              >
                Your Library
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-neutral-400 uppercase">
              Playlists
            </h2>
            <div className="space-y-1">
              <a
                href="#"
                className="block rounded px-3 py-2 font-medium text-white hover:bg-white/10"
              >
                Your Top 2023
              </a>
              <a
                href="#"
                className="block rounded px-3 py-2 font-medium text-white hover:bg-white/10"
              >
                Summer Hits
              </a>
              <a
                href="#"
                className="block rounded px-3 py-2 font-medium text-white hover:bg-white/10"
              >
                Workout Mix
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* Now playing panel on the right */}
      <div className="w-80 flex-shrink-0 border-l border-white/10 p-4">
        <div className="h-full">
          <h2 className="mb-4 text-lg font-bold">Now Playing</h2>
          <div>
            <NowPlaying />
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </div>
  );
}
