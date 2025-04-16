import React from "react";
import Sidebar from "components/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar className="hidden w-64 flex-shrink-0 md:flex" />
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-gray-800 bg-black p-4 md:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Artist Dashboard</h1>
            <button className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
