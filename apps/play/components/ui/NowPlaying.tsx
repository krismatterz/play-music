"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ExplicitBadge from "./ExplicitBadge";
import { usePlayer } from "../../context/PlayerContext";
import { useSpotify } from "../../context/SpotifyContext";

const NowPlaying: React.FC = () => {
  const { currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const spotify = useSpotify();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState("0:00");

  // Use default track if no track is set in context
  const track = currentTrack ?? {
    title: "Invencible",
    artist: "Eladio Carrión",
    cover: "/landing/Eladio_DON_KBRN_Cover.png",
    duration: "3:24",
    currentTime: "1:30",
    explicit: true,
  };

  // Update progress bar based on playback state
  useEffect(() => {
    if (!spotify.playbackState) return;

    const updateProgress = () => {
      if (!spotify.playbackState) return;

      // Use type assertion to specify we know the structure
      const durationMs = spotify.playbackState?.duration as number | undefined;
      const positionMs = spotify.playbackState?.position as number | undefined;

      if (durationMs && positionMs) {
        setProgress((positionMs / durationMs) * 100);

        // Format current time
        const minutes = Math.floor(positionMs / 60000);
        const seconds = Math.floor((positionMs % 60000) / 1000);
        setCurrentTime(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }
    };

    // Update immediately
    updateProgress();

    // Update every second if playing
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(updateProgress, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [spotify.playbackState, isPlaying]);

  // Initial volume
  useEffect(() => {
    const getInitialVolume = async () => {
      if (spotify.isPlayerReady && spotify.player) {
        const playerVolume = await spotify.player.getVolume();
        if (playerVolume !== undefined) {
          setVolume(Math.round(playerVolume * 100));
        }
      }
    };

    void getInitialVolume();
  }, [spotify.isPlayerReady, spotify.player]);

  // Handle volume change
  const handleVolumeChange = async (newVolume: number) => {
    setVolume(newVolume);
    await spotify.setVolume(newVolume);
  };

  // Handle play/pause
  const handlePlayPause = async () => {
    togglePlayPause();
    if (isPlaying) {
      await spotify.pause();
    } else {
      await spotify.resume();
    }
  };

  // Handle next/previous track
  const handleNextTrack = async () => {
    await spotify.nextTrack();
  };

  const handlePreviousTrack = async () => {
    await spotify.previousTrack();
  };

  // Handle seek
  const handleSeek = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotify.playbackState) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const seekPositionPercent = offsetX / width;

    // Use type assertion to specify we know the structure
    const durationMs = spotify.playbackState?.duration as number;
    const seekPositionMs = Math.floor(durationMs * seekPositionPercent);

    await spotify.seek(seekPositionMs);
  };

  // Login with Spotify if not authenticated
  const handleLogin = async () => {
    if (!spotify.isAuthenticated) {
      await spotify.login();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!spotify.isAuthenticated ? (
        <button
          onClick={handleLogin}
          className="mb-4 rounded-full bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
        >
          Connect with Spotify
        </button>
      ) : null}

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
        <div
          className="h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/20"
          onClick={spotify.isPlayerReady ? handleSeek : undefined}
        >
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-neutral-400">
          <span>{currentTime}</span>
          <span>{track.duration}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex w-full items-center justify-center gap-x-6 px-6">
        {/* Like Song */}
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
        {/* Previous */}
        <button
          className="rounded-full p-2 text-neutral-400 hover:text-white"
          onClick={spotify.isPlayerReady ? handlePreviousTrack : undefined}
          disabled={!spotify.isPlayerReady}
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
          className="rounded-full bg-white p-3 text-black"
          onClick={spotify.isPlayerReady ? handlePlayPause : togglePlayPause}
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
          className="rounded-full p-2 text-neutral-400 hover:text-white"
          onClick={spotify.isPlayerReady ? handleNextTrack : undefined}
          disabled={!spotify.isPlayerReady}
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
        {/* More Options (Three Dots) */}
        <button className="rounded-full p-2 text-neutral-400 hover:text-white">
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

      {/* Additional Controls */}
      <div className="mt-6 mb-4 flex w-full flex-row items-center justify-center gap-10">
        {/* Add to Playlist */}
        <button className="rounded-full p-2 text-neutral-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Volume */}
        <div className="flex items-center gap-1">
          {/* Volume Bar */}
          <div
            className="h-1 w-20 cursor-pointer overflow-hidden rounded-full bg-white/20"
            onClick={(e) => {
              const volumeBar = e.currentTarget;
              const rect = volumeBar.getBoundingClientRect();
              const offsetX = e.clientX - rect.left;
              const width = rect.width;
              const newVolume = Math.round((offsetX / width) * 100);
              void handleVolumeChange(newVolume);
            }}
          >
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${volume}%` }}
            ></div>
          </div>
        </div>

        {/* Shuffle */}
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
      </div>
    </div>
  );
};

export default NowPlaying;
