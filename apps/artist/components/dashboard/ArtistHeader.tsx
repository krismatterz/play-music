"use client";

import React from "react";
import Image from "next/image";
import { artistData } from "./mockData";

const ArtistHeader: React.FC = () => {
  return (
    <div className="mb-8 flex items-center gap-6 rounded-xl bg-gradient-to-b from-neutral-800/50 to-transparent p-6">
      <Image
        src={artistData.profilePic} // Ensure this path is correct or use a state variable
        alt={`${artistData.name} profile`}
        width={128}
        height={128}
        className="h-32 w-32 rounded-full object-cover shadow-lg"
        // Add onError handler for placeholder if image fails
        onError={(e) => {
          e.currentTarget.src = "/placeholder-artist.png"; // Path to a generic placeholder
        }}
      />
      <div className="min-w-0">
        <h1 className="truncate text-4xl font-bold text-white">
          {artistData.name}
        </h1>
        <p className="mt-2 truncate text-lg text-neutral-300">
          {artistData.monthlyListeners} Monthly Listeners
        </p>
      </div>
    </div>
  );
};

export default ArtistHeader;
