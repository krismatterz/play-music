"use client";

import React from "react";
import Image from "next/image";
import ExplicitBadge from "./ExplicitBadge";
import { usePlayer } from "../../context/PlayerContext";

const NowPlaying: React.FC = () => {
  const { currentTrack, isPlaying, togglePlayPause } = usePlayer();

  // Use default track if no track is set in context
  const track = currentTrack ?? {
    title: "Invencible",
    artist: "Eladio Carrión",
    cover: "/landing/Eladio_DON_KBRN_Cover.png",
    duration: "3:24",
    currentTime: "1:30",
    explicit: true,
  };

  return (
    <div className="flex flex-col items-center">
      {/* Album Cover */}
      <div className="relative mb-4 h-64 w-64 overflow-hidden rounded-lg shadow-lg">
        <Image
          src={track.cover}
          alt={`${track.title} cover`}
          fill
          className="object-cover"
        />
      </div>

      {/* Track Info */}
      <div className="mb-4 w-full text-center">
        <div className="mb-1 flex items-center justify-center gap-1 text-lg font-bold">
          {track.title}
          {track.explicit && <ExplicitBadge />}
        </div>
        <div className="text-sm text-neutral-400">{track.artist}</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 w-full space-y-1">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: "45%" }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-neutral-400">
          <span>{track.currentTime ?? "0:00"}</span>
          <span>{track.duration}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex w-full items-center justify-center gap-4">
        {/* Previous */}
        <button className="rounded-full p-2 text-neutral-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.688c0-1.44-1.555-2.342-2.805-1.628L12 11.03v-2.34c0-1.44-1.555-2.343-2.805-1.629l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          className="rounded-full bg-white p-3 text-black"
          onClick={togglePlayPause}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Next */}
        <button className="rounded-full p-2 text-neutral-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z" />
          </svg>
        </button>
      </div>

      {/* Additional Controls */}
      <div className="mt-6 flex w-full justify-between">
        {/* Shuffle */}
        <button className="rounded-full p-2 text-neutral-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </button>

        <button className="rounded-full p-2 text-neutral-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M13.5 4.938a7.5 7.5 0 01-10.498 10.498 7.5 7.5 0 1110.498-10.498zM5.25 12a.75.75 0 100 1.5h13.5a.75.75 0 000-1.5H5.25z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="flex items-center gap-1">
          <button className="rounded-full p-2 text-neutral-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="h-1 w-20 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: "70%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
