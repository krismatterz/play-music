"use client";

import React from "react";
import Image from "next/image";
import { albums } from "./mockData";

const Albums: React.FC = () => {
  return (
    <div className="rounded-xl bg-black/30 p-4 backdrop-blur-sm">
      <h2 className="mb-4 text-xl font-semibold text-white">Discography</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {albums.map((album) => (
          <div key={album.title} className="group cursor-pointer">
            <Image
              src={album.cover} // Ensure path is correct
              alt={`${album.title} cover`}
              width={200} // Adjusted size for better grid display
              height={200}
              className="mb-2 aspect-square w-full rounded object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-album-cover.png"; // Generic placeholder
              }}
            />
            <p className="truncate text-sm font-medium text-white group-hover:text-amber-400">
              {album.title}
            </p>
            <p className="text-xs text-neutral-400">{album.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Albums;
