"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import ExplicitBadge from "./ExplicitBadge";
import {
  usePlayerState,
  usePlayerActions,
  usePlayerProgress,
} from "../../context/PlayerContext";
import { formatDuration } from "../../utils/formatDuration";

// Default track to show when nothing is playing
const defaultTrack = {
  id: "default",
  title: "No music playing",
  artist: "-",
  cover: "/placeholder-cover.png", // Replace with a generic placeholder
  durationMs: 0,
  explicit: false,
};

const NowPlaying: React.FC = () => {
  // Consume split contexts
  const {
    currentTrack: contextTrack,
    isPlaying,
    duration,
    volume,
  } = usePlayerState();
  const { pause, resume, seek, setVolume } = usePlayerActions();
  const { currentTime } = usePlayerProgress();

  // Use context track or default placeholder
  const track = contextTrack ?? defaultTrack;

  // Format time display (Memoize to avoid recalculating on every render)
  const formattedCurrentTime = useMemo(
    () => formatDuration(currentTime * 1000), // Already multiplied by 1000 if durationMs is used
    [currentTime],
  );
  const formattedDuration = useMemo(() => {
    // Prioritize duration from state if available (more accurate for Spotify)
    const durationSeconds =
      duration > 0 ? duration : (track.durationMs ?? 0) / 1000;
    return formatDuration(durationSeconds * 1000);
  }, [track.durationMs, duration]);

  // Calculate progress percentage
  const progressPercent = useMemo(() => {
    const totalDurationSeconds =
      duration > 0 ? duration : (track.durationMs ?? 0) / 1000;
    return totalDurationSeconds > 0
      ? (currentTime / totalDurationSeconds) * 100
      : 0;
  }, [currentTime, duration, track.durationMs]);

  // --- Event Handlers --- //

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pause();
    } else {
      if (contextTrack) {
        await resume();
      }
    }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = Math.round((offsetX / width) * 100);
    void setVolume(newVolume);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only allow seeking if duration is known
    const totalDurationSeconds =
      duration > 0 ? duration : (track.durationMs ?? 0) / 1000;
    if (totalDurationSeconds <= 0) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const seekPositionPercent = offsetX / width;
    const seekPositionSeconds = totalDurationSeconds * seekPositionPercent;

    void seek(seekPositionSeconds);
  };

  // TODO: Implement next/previous handlers using context functions when added
  const handleNextTrack = async () => {
    console.log("Next track clicked - Not implemented in context yet");
  };

  const handlePreviousTrack = async () => {
    console.log("Previous track clicked - Not implemented in context yet");
  };

  // Check if playback controls should be disabled
  const controlsDisabled = !contextTrack;

  return (
    <div className="flex h-full flex-col items-center p-4">
      {/* Album Cover */}
      <div className="relative mb-4 aspect-square w-full max-w-xs overflow-hidden rounded-lg shadow-lg">
        <Image
          src={track.cover}
          alt={`${track.title} cover`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Track Info */}
      <div className="mb-4 w-full text-center">
        <div className="mb-1 flex items-center justify-center gap-1 truncate text-lg font-bold text-white">
          {track.title}
          {track.explicit && <ExplicitBadge />}
        </div>
        <div className="truncate text-sm text-neutral-400">{track.artist}</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 w-full max-w-md space-y-1">
        <div
          className={`h-1 w-full overflow-hidden rounded-full bg-white/20 ${controlsDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          onClick={!controlsDisabled ? handleSeek : undefined}
        >
          <div
            className="h-full rounded-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-neutral-400">
          <span>{formattedCurrentTime}</span>
          <span>{formattedDuration}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex w-full max-w-md items-center justify-center gap-x-6 px-6">
        {/* TODO: Implement Like Song */}
        <button
          className={`rounded-full p-2 text-neutral-400 ${controlsDisabled ? "opacity-50" : "hover:text-white"}`}
          disabled={controlsDisabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </button>
        {/* Previous */}
        <button
          className={`rounded-full p-2 text-neutral-400 ${controlsDisabled ? "cursor-not-allowed opacity-50" : "hover:text-white"}`}
          onClick={handlePreviousTrack}
          disabled={controlsDisabled}
        >
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
          className={`rounded-full bg-white p-3 text-black ${controlsDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={handlePlayPause}
          disabled={controlsDisabled}
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
        <button
          className={`rounded-full p-2 text-neutral-400 ${controlsDisabled ? "cursor-not-allowed opacity-50" : "hover:text-white"}`}
          onClick={handleNextTrack}
          disabled={controlsDisabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z" />
          </svg>
        </button>
        {/* TODO: Implement More Options */}
        <button
          className={`rounded-full p-2 text-neutral-400 ${controlsDisabled ? "opacity-50" : "hover:text-white"}`}
          disabled={controlsDisabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <circle cx="5" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="19" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Volume Control */}
      <div className="mt-6 mb-4 flex w-full max-w-xs items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5 text-neutral-400"
        >
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905h1.932l4.5 4.5c.944.945 2.561.276 2.561-1.06V4.06zM17.25 12a.75.75 0 01-.75.75h-3a.75.75 0 010-1.5h3a.75.75 0 01.75.75z" />
        </svg>
        <div
          className={`h-1 w-20 overflow-hidden rounded-full bg-white/20 ${controlsDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          onClick={!controlsDisabled ? handleVolumeClick : undefined}
        >
          <div
            className="h-full rounded-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${volume}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
