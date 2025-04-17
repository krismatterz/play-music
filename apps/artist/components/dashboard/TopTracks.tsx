"use client";

import React from "react";
import Image from "next/image";
import { topTracks } from "./mockData";
import ExplicitBadge from "../ui/ExplicitBadge";

const TopTracks: React.FC = () => {
  return (
    <div className="rounded-xl bg-black/30 p-4 backdrop-blur-sm">
      <h2 className="mb-4 text-xl font-semibold text-white">Popular Tracks</h2>
      {topTracks.map((track, index) => (
        <div
          key={track.title}
          className={`flex items-center gap-3 py-3 ${index < topTracks.length - 1 ? "border-b border-white/10" : ""}`}
        >
          <span className="w-5 text-center text-sm text-neutral-400">
            {index + 1}
          </span>
          <Image
            src={track.cover} // Ensure this path is correct
            alt={`${track.title} cover`}
            width={40}
            height={40}
            className="h-10 w-10 rounded"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-album-cover.png"; // Generic placeholder
            }}
          />
          <div className="flex-grow">
            <div className="flex items-center text-sm font-medium text-white">
              {track.title}
              {track.explicit && <ExplicitBadge />}
            </div>
          </div>
          <div className="hidden text-sm text-neutral-400 sm:block">
            {track.plays} plays
          </div>
          <div className="ml-auto text-sm text-neutral-400">
            {track.duration}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopTracks;
