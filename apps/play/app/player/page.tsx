"use client";

import Image from "next/image";
import PlaylistItem from "../../components/ui/PlaylistItem";
import { useState, useEffect } from "react";
import { usePlayerState, usePlayerActions } from "../../context/PlayerContext";
import type { DisplayableTrack } from "../../context/PlayerContext";
import { formatDuration } from "../../utils/formatDuration";

// Mock data for the playlist (Add url for local playback)
const playlist: DisplayableTrack[] = [
  {
    id: "local-0",
    title: "Invencible",
    artist: "Eladio Carrión",
    album: "DON KBRN",
    cover: "/landing/Eladio_DON_KBRN_Cover.png",
    durationMs: 204000, // Example duration in ms (3:24)
    url: "/music/Eladio Carrión - Invencible.mp3",
    explicit: true,
  },
  {
    id: "local-1",
    title: "Weightless",
    artist: "Martin Garrix",
    album: "Weightless - Single",
    cover: "/landing/Martin_Garrix_Weightless_Cover.png",
    durationMs: 223000, // 3:43
    url: "/music/Martin Garrix & Arjit Singh - Weightless.mp3",
  },
  {
    id: "local-2",
    title: "Thana",
    artist: "Tayna",
    album: "Thana - Single",
    cover: "/landing/Tayna_Thana_Cover.png",
    durationMs: 205000, // 3:25
    url: "/music/Tayna - Thana.mp3",
  },
  {
    id: "local-3",
    title: "frente al mar",
    artist: "Béele",
    album: "frente al mar - EP",
    cover: "/landing/Bélee_frente_al_mar_Cover.png",
    durationMs: 165000, // 2:45
    url: "/music/Beéle - frente al mar.mp3",
  },
  {
    id: "local-4",
    title: "PERFuMITO NUEVO",
    artist: "Bad Bunny",
    album: "DONDE TM FANTASMA",
    cover: "/landing/Bad_Bunny_DTMF_Cover.png",
    durationMs: 201000, // 3:21
    url: "/music/BAD BUNNY ft. RaiNao - PERFuMITO NUEVO.mp3",
    explicit: true,
  },
  {
    id: "local-5",
    title: "Work",
    artist: "Anyma",
    album: "Work - Single",
    cover: "/landing/Anyma_Work_Cover.png",
    durationMs: 174000, // 2:54
    url: "/music/Anyma - Work (feat. Yeat).mp3",
    explicit: true,
  },
];

export default function Player() {
  // Get player state and actions from context using new hooks
  const { currentTrack: contextCurrentTrack, isPlaying } = usePlayerState();
  const { play, pause, resume } = usePlayerActions();

  // Add background style inspired by ArtistDashboard
  const backgroundStyle = {
    backgroundImage: `radial-gradient(ellipse at top, hsl(220 10% 15%) 0%, hsl(220 10% 5%) 70%)`,
  };

  // Local state to track which *list item* was selected, not the *playing* track
  // Defaults to showing the first track's details if nothing is playing yet
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const displayTrack =
    contextCurrentTrack ?? playlist[selectedTrackIndex] ?? playlist[0];

  const handleTrackClick = (index: number) => {
    const trackToPlay = playlist[index];
    if (trackToPlay?.url) {
      setSelectedTrackIndex(index); // Update which track details are shown initially
      // Call the context play function for local playback
      play({ source: "local", track: trackToPlay }).catch(console.error);
    } else {
      console.warn("Clicked track is missing URL:", trackToPlay);
    }
  };

  // Use context actions for the main play/pause button
  const handleTogglePlayPause = () => {
    if (isPlaying) {
      pause().catch(console.error);
    } else {
      // Only resume if there's a track loaded in context
      if (contextCurrentTrack) {
        resume().catch(console.error);
      } else {
        // If nothing is loaded, play the first track from the list
        handleTrackClick(0);
      }
    }
  };

  // Update document title with current track from context or displayTrack
  useEffect(() => {
    document.title = `${displayTrack?.title ?? "Player"} • ${displayTrack?.artist ?? "Play"} | Play`;
  }, [displayTrack]);

  return (
    <div className="h-full w-full overflow-auto pb-8" style={backgroundStyle}>
      {/* Header uses displayTrack for initial view before context loads */}
      <div className="relative h-80 w-full bg-gradient-to-b from-amber-900/40 to-black/60">
        <div className="absolute inset-0 flex items-end p-8">
          <div className="flex items-end gap-6">
            <div className="relative h-48 w-48 overflow-hidden rounded-lg shadow-2xl">
              <Image
                src={displayTrack?.cover ?? "/placeholder-cover.png"} // Use placeholder
                alt={displayTrack?.title ?? "Playlist cover"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-white/80 uppercase">
                Playlist
              </div>
              <h1 className="mt-1 mb-2 text-6xl font-bold text-white">
                Today&apos;s Top Songs
              </h1>
              <div className="flex items-center gap-1 text-white/80">
                <span>by dJai • {playlist.length} songs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Content */}
      <div className="bg-gradient-to-b from-black/40 to-transparent p-8">
        {/* Controls use context state/actions */}
        <div className="mb-8 flex items-center gap-6">
          <button
            className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black transition-colors hover:bg-amber-400 disabled:opacity-50"
            onClick={handleTogglePlayPause}
            disabled={!contextCurrentTrack && playlist.length === 0}
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
          {/* Like/Download buttons (currently non-functional) */}
          <button className="rounded-full p-2 text-2xl text-white/60 hover:text-white">
            {/* ... Like icon ... */}
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
            {/* ... Download icon ... */}
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

        {/* Playlist Items - use context isPlaying and currentTrack.id */}
        <div className="space-y-1">
          {playlist.map((track, index) => (
            <PlaylistItem
              key={track.id}
              track={{
                title: track.title,
                artist: track.artist,
                album: track.album,
                cover: track.cover,
                duration: formatDuration(track.durationMs ?? 0),
                explicit: track.explicit,
              }}
              index={index + 1}
              isPlaying={contextCurrentTrack?.id === track.id && isPlaying}
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
            {/* Recommendation cards */}
            <div className="group cursor-pointer rounded-lg border border-white/10 bg-black/40 p-4 transition-all hover:border-amber-500/30 hover:shadow-amber-900/20">
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md shadow-md">
                <Image
                  src="/landing/Martin_Garrix_Weightless_Cover.png"
                  alt="Recommended playlist"
                  fill
                  className="object-cover transition-all group-hover:scale-105"
                />
                <div className="absolute right-2 bottom-2 flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-amber-500 opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
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
              <h3 className="font-bold text-white transition-colors group-hover:text-amber-500">
                Electronic Vibes
              </h3>
              <p className="text-sm text-neutral-400">
                Curated collection of electronic music
              </p>
            </div>

            <div className="group cursor-pointer rounded-lg border border-white/10 bg-black/40 p-4 transition-all hover:border-amber-500/30 hover:shadow-amber-900/20">
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md shadow-md">
                <Image
                  src="/landing/Bad_Bunny_DTMF_Cover.png"
                  alt="Recommended playlist"
                  fill
                  className="object-cover transition-all group-hover:scale-105"
                />
                <div className="absolute right-2 bottom-2 flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-amber-500 opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
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
              <h3 className="font-bold text-white transition-colors group-hover:text-amber-500">
                Urbano Latino
              </h3>
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
