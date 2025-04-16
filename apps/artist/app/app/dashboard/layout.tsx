import React from "react";
import Sidebar from "../../components/Sidebar";
import MusicPlayer from "../../components/MusicPlayer";
import type DashboardLayout from "./DashboardLayout";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="w-64 flex-shrink-0" />
        <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      </div>
      <MusicPlayer className="fixed right-0 bottom-0 left-0" />
    </div>
  );
};

export default DashboardLayout;
