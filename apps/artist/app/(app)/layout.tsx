"use client";

import { Sidebar } from "../../components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="min-h-[calc(100vh-5rem)]">{children}</div>
      </main>
    </div>
  );
}
