"use client";

import React from "react";
import NowPlaying from "../../components/ui/NowPlaying";
import Link from "next/link";

export default function SongLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              <a
                href="#"
                className="block rounded px-3 py-2 font-medium text-white hover:bg-white/10"
              >
                Home
              </a>
              <Link
                href="/player"
                className="block rounded px-3 py-2 font-medium text-white hover:bg-white/10"
              >
                Player
              </Link>
              <a
                href="#"
                className="block rounded px-3 py-2 font-medium text-white hover:bg-white/10"
              >
                Search
              </a>
              <a
                href="#"
                className="block rounded px-3 py-2 font-medium text-white hover:bg-white/10"
              >
                Your Library
              </a>
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
                Liked Songs
              </a>
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
    </div>
  );
}
