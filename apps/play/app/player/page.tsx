"use client";

import PlayerLayout from "./layout";

export default function Player() {
  return (
    <PlayerLayout>
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="text-4xl font-bold">Player</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Track Name</h2>
            <p className="text-sm text-neutral-400">Artist Name</p>
          </div>
        </div>
      </div>
    </PlayerLayout>
  );
}
