"use client";

import Image from "next/image";
import PlaylistItem from "../../components/ui/PlaylistItem";
import { useState, useEffect } from "react";
import { usePlayer } from "../../context/PlayerContext";

// Mock data for the playlist
const playlist = [
  {
    id: "0",
    title: "Invencible",
    artist: "Eladio Carrión",
    album: "DON KBRN",
    cover: "/landing/Eladio_DON_KBRN_Cover.png",
    duration: "3:24",
    explicit: true,
  },
  {
    id: "1",
    title: "Weightless",
    artist: "Martin Garrix",
    album: "Weightless - Single",
    cover: "/landing/Martin_Garrix_Weightless_Cover.png",
    duration: "3:43",
  },
  {
    id: "2",
    title: "Thana",
    artist: "Tayna",
    album: "Thana - Single",
    cover: "/landing/Tayna_Thana_Cover.png",
    duration: "3:25",
  },
  {
    id: "3",
    title: "frente al mar",
    artist: "Béele",
    album: "frente al mar - EP",
    cover: "/landing/Bélee_frente_al_mar_Cover.png",
    duration: "2:45",
  },
  {
    id: "4",
    title: "PERFuMITO NUEVO",
    artist: "Bad Bunny",
    album: "DONDE TM FANTASMA",
    cover: "/landing/Bad_Bunny_DTMF_Cover.png",
    duration: "3:21",
    explicit: true,
  },
  {
    id: "5",
    title: "Work",
    artist: "Anyma",
    album: "Work - Single",
    cover: "/landing/Anyma_Work_Cover.png",
    duration: "2:54",
    explicit: true,
  },
];

export default function Player() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { setCurrentTrack } = usePlayer();

  // Make sure currentTrack is always defined
  const currentTrack = playlist[currentTrackIndex] ?? playlist[0];

  // Set the current track in context when it changes
  useEffect(() => {
    if (currentTrack) {
      setCurrentTrack({
        title: currentTrack.title,
        artist: currentTrack.artist,
        cover: currentTrack.cover,
        duration: currentTrack.duration,
        explicit: currentTrack.explicit,
        album: currentTrack.album,
      });
    }
  }, [currentTrack, setCurrentTrack]);

  const handleTrackClick = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Update document title with current track
  useEffect(() => {
    document.title = `${currentTrack?.title} • ${currentTrack?.artist} | Play`;
  }, [currentTrack]);

  return (
    <div className="h-full w-full overflow-auto pb-8">
      {/* Header */}
      <div className="relative h-80 w-full bg-gradient-to-b from-amber-900 to-black">
        <div className="absolute inset-0 flex items-end p-8">
          <div className="flex items-end gap-6">
            <div className="relative h-48 w-48 overflow-hidden rounded-lg shadow-2xl">
              <Image
                src={currentTrack?.cover ?? ""}
                alt={currentTrack?.title ?? ""}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-white/80 uppercase">
                Playlist
              </div>
              <h1 className="mt-1 mb-2 text-6xl font-bold text-white">
                Your Daily Mix
              </h1>
              <div className="flex items-center gap-1 text-white/80">
                <span>AI-generated for you • {playlist.length} songs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Content */}
      <div className="bg-gradient-to-b from-black/60 to-black p-8">
        {/* Controls */}
        <div className="mb-8 flex items-center gap-6">
          <button
            className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-black"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8"
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
                className="h-8 w-8"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <button className="rounded-full p-2 text-2xl text-white/60 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </button>

          <button className="rounded-full p-2 text-2xl text-white/60 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Table Header */}
        <div className="mb-4 grid grid-cols-[auto_1fr_1fr_auto] gap-4 border-b border-white/10 px-4 pb-2 text-sm font-medium text-neutral-400">
          <div className="w-6 text-center">#</div>
          <div>Title</div>
          <div className="hidden md:block">Album</div>
          <div>Duration</div>
        </div>

        {/* Playlist Items */}
        <div className="space-y-1">
          {playlist.map((track, index) => (
            <PlaylistItem
              key={`${track.title}-${index}`}
              track={track}
              index={index + 1}
              isPlaying={index === currentTrackIndex && isPlaying}
              onClick={() => handleTrackClick(index)}
              songId={track.id}
            />
          ))}
        </div>

        {/* AI Recommendation Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Recommended for you
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Recommendation cards would go here */}
            <div className="group cursor-pointer rounded-md bg-white/5 p-4 transition-all hover:bg-white/10">
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md shadow-md">
                <Image
                  src="/landing/Martin_Garrix_Weightless_Cover.png"
                  alt="Recommended playlist"
                  fill
                  className="object-cover transition-all group-hover:scale-105"
                />
                <div className="absolute right-2 bottom-2 flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-green-500 opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6 text-black"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-white">Electronic Vibes</h3>
              <p className="text-sm text-neutral-400">
                Curated collection of electronic music
              </p>
            </div>

            <div className="group cursor-pointer rounded-md bg-white/5 p-4 transition-all hover:bg-white/10">
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md shadow-md">
                <Image
                  src="/landing/Bad_Bunny_DTMF_Cover.png"
                  alt="Recommended playlist"
                  fill
                  className="object-cover transition-all group-hover:scale-105"
                />
                <div className="absolute right-2 bottom-2 flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-green-500 opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6 text-black"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-white">Urbano Latino</h3>
              <p className="text-sm text-neutral-400">
                The best reggaeton and latin urban music
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
