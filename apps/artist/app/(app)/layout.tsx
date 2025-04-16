"use client";

import { Sidebar } from "../../components/Sidebar";
import MusicPlayer from "../../components/MusicPlayer";
import { useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="min-h-[calc(100vh-5rem)]">{children}</div>
        <div className="fixed right-0 bottom-0 left-0 h-20 bg-gradient-to-r from-[#1a1a1a] to-[#252525]">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
