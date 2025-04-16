import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
