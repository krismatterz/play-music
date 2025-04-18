"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ExplicitBadge from "./ExplicitBadge";

interface PlaylistItemProps {
  track: {
    title: string;
    artist: string;
    album: string;
    cover: string;
    duration: string;
    explicit?: boolean;
  };
  index: number;
  isPlaying: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  songId: string;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  track,
  index,
  isPlaying,
  onClick,
  onDoubleClick,
  songId,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }

    // If we have a songId, we can navigate to the song page with Ctrl/Cmd + click
    if (songId && (e.ctrlKey || e.metaKey)) {
      e.stopPropagation();
      router.push(`/song/${songId}`);
    }
  };

  const handleViewSong = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (songId) {
      router.push(`/song/${songId}`);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 py-3 ${isPlaying ? "mb-2 rounded-lg bg-white/5 p-2" : ""}`}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "Space") {
          onClick();
        }
      }}
    >
      <Image
        src={track.cover}
        alt={track.title}
        width={isPlaying ? 48 : 40}
        height={isPlaying ? 48 : 40}
        className={`rounded ${isPlaying ? "h-12 w-12" : "h-10 w-10"}`}
      />
      <div>
        <div
          className={`${isPlaying ? "" : "text-xs"} flex items-center text-sm font-medium text-white`}
        >
          {track.title}
          {track.explicit && <ExplicitBadge />}
        </div>
        <div className="text-xs text-neutral-400">{track.artist}</div>
      </div>
      <div className="ml-auto text-xs text-neutral-400">{track.duration}</div>
      {songId && (
        <button
          onClick={handleViewSong}
          className="text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path
              fillRule="evenodd"
              d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PlaylistItem;
