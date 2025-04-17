import React from "react";
import Image from "next/image";

const playlist = [
  {
    title: "Invencible",
    artist: "Eladio Carrión",
    cover: "/landing/Eladio_DON_KBRN_Cover.png",
    duration: "1:30",
    isPlaying: true,
  },
  {
    title: "Weightless",
    artist: "Martin Garrix",
    cover: "/landing/Martin_Garrix_Weightless_Cover.png",
    duration: "3:43",
  },
  {
    title: "Thana",
    artist: "Tayna",
    cover: "/landing/Tayna_Thana_Cover.png",
    duration: "3:25",
  },
  {
    title: "frente al mar",
    artist: "Béele",
    cover: "/landing/Bélee_frente_al_mar_Cover.png",
    duration: "2:45",
  },
  {
    title: "Me porto Bonito",
    artist: "Bad Bunny",
    cover: "/landing/Bad_Bunny_Me_porto_Bonito_Cover.png",
    duration: "3:25",
  },
  {
    title: "No me porto bonito",
    artist: "Bad Bunny",
    cover: "/landing/Bad_Bunny_No_me_porto_bonito_Cover.png",
    duration: "2:45",
  },
];

const SmartPlaylistPreview: React.FC = () => {
  return (
    <div className="w-full max-w-md rounded-xl border border-black/20 bg-gradient-to-b from-amber-800 to-black p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-gradient-to-br from-amber-600 to-amber-300" />
          <span className="text-sm font-medium text-white">Smart Playlist</span>
        </div>
        <div className="h-6 w-24 rounded-full bg-white/10"></div>
      </div>
      {playlist.map((track, i) => (
        <div
          key={track.title}
          className={`flex items-center gap-3 py-3 ${i < playlist.length - 1 ? "border-b border-white/5" : ""} ${track.isPlaying ? "mb-2 rounded-lg bg-white/5 p-2" : ""}`}
        >
          <Image
            src={track.cover}
            alt={track.title + " cover"}
            width={track.isPlaying ? 48 : 40}
            height={track.isPlaying ? 48 : 40}
            className={`rounded ${track.isPlaying ? "h-12 w-12" : "h-10 w-10"}`}
          />
          <div>
            <div
              className={`text-sm font-medium text-white ${track.isPlaying ? "" : "text-xs"}`}
            >
              {track.title}
            </div>
            <div className="text-xs text-neutral-400">{track.artist}</div>
          </div>
          <div className="ml-auto text-xs text-neutral-400">
            {track.duration}
          </div>
        </div>
      ))}
      {/* AI suggestion */}
      <div className="mt-4 rounded-lg bg-gradient-to-r from-amber-900/30 to-amber-300/30 p-3">
        <div className="mb-1 bg-gradient-to-r from-purple-600 via-amber-600 via-15% to-amber-300 bg-clip-text text-xs font-bold text-transparent">
          AI SUGGESTION
        </div>
        <div className="text-sm text-white">
          Based on your listening, try this playlist
        </div>
      </div>
    </div>
  );
};

export default SmartPlaylistPreview;
