"use client";

import React from "react";
import { PlayerProvider } from "../context/PlayerContext";

export default function PlayerProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlayerProvider>{children}</PlayerProvider>;
}
