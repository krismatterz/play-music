import React from "react";

interface MusicLayoutProps {
  children: React.ReactNode;
}

const MusicLayout: React.FC<MusicLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      </div>
    </div>
  );
};

export default MusicLayout;
