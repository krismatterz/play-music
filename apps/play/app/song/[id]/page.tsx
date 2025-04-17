"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { usePlayer } from "../../../context/PlayerContext";
import ExplicitBadge from "../../../components/ui/ExplicitBadge";

// Mock data for the songs
const songs = [
  {
    id: "0",
    title: "Invencible",
    artist: "Eladio Carrión",
    album: "DON KBRN",
    cover: "/landing/Eladio_DON_KBRN_Cover.png",
    duration: "3:24",
    explicit: true,
    releaseYear: 2023,
    genres: ["Reggaeton", "Latin Trap"],
    lyrics:
      "Yeah\nYo me siento invencible cada ve' que abro mis fuckin' dos ojo'\nNunca me gustó el deporte en equipo, puedo solo\nTengo frío en mi alma, junio en Palermo Soho\nCreo mucho en el karma y que con calma llega solo\nEsto fue cero suerte, trabajé y se me dio\nNo me digan \"rey del trap\", solo existe un rey, es Dios\nAprendí que no todo el dinero es bueno\nY 'toy haciendo lo mejor que puedo con el don que me regaló\nUn día hablé con Él, yo ni lo busqué, Él me llamó\nMe dijo: \"Tú ere' el más duro, eso te lo aseguro yo\"\nY desde ese día yo no he vuelto a coger lucha\nAunque a vece' no responde, sé que siempre me escucha\nDice: \"Eladio, no, tú no te deje'\nTú ere' un guerrero, no hay quien te aconseje\nY se pasa por cosa', pero mírate ahora\nTú aguanta' lo que sea, no te la puse difícil, yo te puse a ti más fuerte\", yeah\n\nY ya me siento como Hércule'\nRecuerdo cuando yo le dije a papi: \"Lo logré\"\nTodo esto yo lo fríamente calculé\nPero sobre todo, tuve fe",
  },
  {
    id: "1",
    title: "Weightless",
    artist: "Martin Garrix",
    album: "Weightless - Single",
    cover: "/landing/Martin_Garrix_Weightless_Cover.png",
    duration: "3:43",
    releaseYear: 2022,
    genres: ["EDM", "Dance"],
    lyrics:
      "Feeling weightless...\nAs we're falling through the sky...\nNothing holding us down...",
  },
  {
    id: "2",
    title: "Thana",
    artist: "Tayna",
    album: "Thana - Single",
    cover: "/landing/Tayna_Thana_Cover.png",
    duration: "3:25",
    releaseYear: 2023,
    genres: ["Pop", "R&B"],
    lyrics:
      "When the lights go down...\nI'll be there waiting...\nJust call my name...",
  },
  {
    id: "3",
    title: "frente al mar",
    artist: "Béele",
    album: "frente al mar - EP",
    cover: "/landing/Bélee_frente_al_mar_Cover.png",
    duration: "2:45",
    releaseYear: 2022,
    genres: ["Latin Pop", "Reggaeton"],
    lyrics:
      "Frente al mar...\nMirando las olas llegar...\nPienso en ti una vez más...",
  },
  {
    id: "4",
    title: "PERFuMITO NUEVO",
    artist: "Bad Bunny",
    album: "DONDE TM FANTASMA",
    cover: "/landing/Bad_Bunny_DTMF_Cover.png",
    duration: "3:21",
    explicit: true,
    releaseYear: 2023,
    genres: ["Latin Trap", "Reggaeton"],
    lyrics:
      "Nuevo perfume, nueva actitud...\nYa no pienso más en tu ingratitud...\nAhora soy yo quien vive su juventud...",
  },
  {
    id: "5",
    title: "Work",
    artist: "Anyma",
    album: "Work - Single",
    cover: "/landing/Anyma_Work_Cover.png",
    duration: "2:54",
    explicit: true,
    releaseYear: 2022,
    genres: ["Electronic", "House"],
    lyrics:
      "Work, work, work...\nPut in the hours...\nNever stop until we reach the top...",
  },
];

export default function SongPage() {
  const params = useParams();
  const router = useRouter();
  const { setCurrentTrack, setIsPlaying } = usePlayer();
  const [song, setSong] = useState<(typeof songs)[0] | null>(null);

  useEffect(() => {
    const songId = params.id as string;
    const foundSong = songs.find((s) => s.id === songId);

    if (foundSong) {
      setSong(foundSong);
      document.title = `${foundSong.title} • ${foundSong.artist} | Play`;
    } else {
      router.push("/player");
    }
  }, [params.id, router]);

  if (!song) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const playSong = () => {
    setCurrentTrack({
      title: song.title,
      artist: song.artist,
      cover: song.cover,
      duration: song.duration,
      explicit: song.explicit,
      album: song.album,
    });
    setIsPlaying(true);
  };

  return (
    <div className="h-full w-full overflow-auto">
      {/* Hero Section with Blur Effect */}
      <div
        className="relative h-96 w-full bg-gradient-to-b from-amber-900/80 to-black"
        style={{
          backgroundImage: `url(${song.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>

        <div className="absolute inset-0 flex items-center p-8">
          <div className="flex items-start gap-8">
            <div className="relative h-64 w-64 flex-shrink-0 overflow-hidden rounded-lg shadow-2xl">
              <Image
                src={song.cover}
                alt={`${song.title} cover`}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-end">
              <div className="text-sm font-semibold text-white/80 uppercase">
                Song
              </div>
              <h1 className="mt-2 mb-2 flex items-center text-6xl font-bold text-white">
                {song.title}
                {song.explicit && (
                  <span className="ml-2">
                    <ExplicitBadge />
                  </span>
                )}
              </h1>
              <div className="mb-6 text-xl text-white/80">
                {song.artist} • {song.album} • {song.releaseYear}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={playSong}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-black"
                >
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
                      d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Song Details */}
      <div className="p-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold">About</h2>
            <div className="space-y-2 text-white/80">
              <p>
                <span className="font-semibold">Artist:</span> {song.artist}
              </p>
              <p>
                <span className="font-semibold">Album:</span> {song.album}
              </p>
              <p>
                <span className="font-semibold">Release Year:</span>{" "}
                {song.releaseYear}
              </p>
              <p>
                <span className="font-semibold">Duration:</span> {song.duration}
              </p>
              <p>
                <span className="font-semibold">Genres:</span>{" "}
                {song.genres.join(", ")}
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">Lyrics</h2>
            <div className="whitespace-pre-line text-white/80">
              {song.lyrics}
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold">More from {song.artist}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {songs
              .filter((s) => s.artist === song.artist && s.id !== song.id)
              .map((relatedSong) => (
                <div
                  key={relatedSong.id}
                  className="group cursor-pointer rounded-md bg-white/5 p-4 transition-all hover:bg-white/10"
                  onClick={() => router.push(`/song/${relatedSong.id}`)}
                >
                  <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md shadow-md">
                    <Image
                      src={relatedSong.cover}
                      alt={relatedSong.title}
                      fill
                      className="object-cover transition-all group-hover:scale-105"
                    />
                    <div className="absolute right-2 bottom-2 flex h-10 w-10 translate-y-4 items-center justify-center rounded-full bg-green-500 opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 text-black"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {relatedSong.title}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {relatedSong.album}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
