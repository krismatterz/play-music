"use client";

import React from "react";
import { PlayerProvider } from "../context/PlayerContext";
import { SpotifyProvider } from "../context/SpotifyContext";

export default function PlayerProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SpotifyProvider>
      <PlayerProvider>{children}</PlayerProvider>
    </SpotifyProvider>
  );
}
