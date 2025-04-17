import React from "react";
import Image from "next/image";
import ExplicitBadge from "./ExplicitBadge";

interface PlaylistItemProps {
  track: {
    title: string;
    artist: string;
    album?: string;
    cover: string;
    duration: string;
    explicit?: boolean;
  };
  isPlaying?: boolean;
  onClick?: () => void;
  index: number;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  track,
  isPlaying = false,
  onClick,
  index,
}) => {
  return (
    <div
      className={`group flex items-center gap-4 rounded-md px-4 py-2 hover:bg-white/5 ${isPlaying ? "bg-white/10" : ""}`}
      onClick={onClick}
    >
      <div className="w-6 text-center text-sm text-neutral-400 group-hover:hidden">
        {index}
      </div>
      <div className="hidden text-white group-hover:block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          {isPlaying ? (
            <path
              fillRule="evenodd"
              d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
              clipRule="evenodd"
            />
          ) : (
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clipRule="evenodd"
            />
          )}
        </svg>
      </div>
      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
        <Image
          src={track.cover}
          alt={track.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 truncate">
          <span
            className={`font-medium ${isPlaying ? "text-green-500" : "text-white"}`}
          >
            {track.title}
          </span>
          {track.explicit && <ExplicitBadge />}
        </div>
        <div className="truncate text-sm text-neutral-400">{track.artist}</div>
      </div>
      {track.album && (
        <div className="hidden flex-1 truncate text-sm text-neutral-400 md:block">
          {track.album}
        </div>
      )}
      <div className="text-sm text-neutral-400">{track.duration}</div>
    </div>
  );
};

export default PlaylistItem;
