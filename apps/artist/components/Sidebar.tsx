"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  LogOut,
  Music,
  Images,
} from "lucide-react";
import { BetaBadge } from "./ui/beta-badge";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import { cn } from "../lib/utils";
import { ResizablePanelGroup, ResizablePanel } from "./ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

// Helper function to get initial state safely on client
const getInitialCollapsedState = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("sidebarCollapsed") === "true";
  }
  return false; // Default server/initial state
};

// Navigation items are static and memoized outside component
interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Music",
    href: "/music",
    icon: Music,
  },
  {
    title: "Marketing",
    href: "/marketing",
    icon: Images,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut: clerkSignOut } = useClerk();
  const { isLoaded } = useUser();

  // Initialize state directly if possible on client
  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsedState());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // useEffect to confirm client-side state AFTER mount - Runs only once
  useEffect(() => {
    // Read state again after mount to be sure
    const savedState = localStorage.getItem("sidebarCollapsed") === "true";
    // Only update if the initial guess was wrong
    if (savedState !== isCollapsed) {
      setIsCollapsed(savedState);
    }
  }, [isCollapsed]);

  // Handler to toggle collapse state and save to localStorage
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prevCollapsed) => {
      const newState = !prevCollapsed;
      localStorage.setItem("sidebarCollapsed", String(newState));
      return newState;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await clerkSignOut(() => router.push("/sign-in"));
    } catch (error) {
      console.error("Clerk logout failed:", error);
      setIsLoggingOut(false);
    }
  }, [clerkSignOut, router]);

  // Render the FULL Resizable Sidebar directly
  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 hidden h-screen p-6 md:block">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full max-w-xs items-stretch rounded-xl border border-neutral-700 bg-black"
        >
          <ResizablePanel
            defaultSize={isCollapsed ? 4 : 20}
            collapsedSize={4}
            collapsible={true}
            minSize={15}
            maxSize={25}
            className={cn(
              "flex flex-col !overflow-visible transition-all duration-300 ease-in-out",
              isCollapsed ? "min-w-[68px] items-center" : "min-w-[200px]",
            )}
          >
            <div
              className={cn(
                "flex h-[60px] items-center border-b border-neutral-700",
                isCollapsed ? "justify-center" : "justify-between px-4",
              )}
            >
              {isCollapsed ? (
                <BetaBadge />
              ) : (
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="font-semibold whitespace-nowrap text-white">
                    Play-Music
                  </span>
                  <BetaBadge />
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 py-4">
              <nav
                className={cn(
                  "grid gap-1 px-2",
                  isCollapsed ? "justify-center" : "",
                )}
              >
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return isCollapsed ? (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                            isActive
                              ? "bg-amber-500 text-black hover:bg-amber-600"
                              : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
                          )}
                          aria-label={item.title}
                        >
                          <Icon className="h-5 w-5" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="border-neutral-700 bg-black text-white"
                      >
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-amber-500 text-black hover:bg-amber-600"
                          : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Simplified Footer */}
            <div className="mt-auto flex flex-col border-t border-neutral-700 p-2">
              {isLoaded ? (
                <div
                  className={cn(
                    "flex w-full",
                    // When collapsed: stack vertically centered with gap
                    // When expanded: UserButton/Collapse on top row, Logout below
                    isCollapsed
                      ? "flex-col items-center gap-2"
                      : "flex-col gap-2",
                  )}
                >
                  {isCollapsed ? (
                    // --- Collapsed State (Reordered with gap, standardized sizes) ---
                    <>
                      {/* Expand Button (Top) */}
                      <div className="flex w-full justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                              onClick={handleToggleCollapse}
                              aria-label="Expand sidebar"
                            >
                              <ChevronLeft className="h-4 w-4 rotate-180 transition-transform duration-300" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="border-neutral-700 bg-black text-white"
                          >
                            Expand
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      {/* User Button (Middle) */}
                      <div className="flex w-full justify-center">
                        <UserButton />
                      </div>
                      {/* Logout Button (Bottom) - Standardized size */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            // Standardized size to h-8 w-8
                            className="h-8 w-8 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            aria-label="Logout"
                          >
                            {isLoggingOut ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              <LogOut className="h-5 w-5" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="border-neutral-700 bg-black text-white"
                        >
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </TooltipContent>
                      </Tooltip>
                    </>
                  ) : (
                    // --- Expanded State (Reordered Vertically) ---
                    <>
                      {/* Collapse Button (Styled like nav item) */}
                      <Button
                        variant="ghost"
                        // Mimic nav item styling
                        className="group flex w-full items-center justify-start gap-2 rounded-md px-2 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
                        onClick={handleToggleCollapse}
                        aria-label="Collapse sidebar"
                      >
                        {/* Use ChevronLeft, consistent rotation */}
                        <ChevronLeft className="h-5 w-5 transition-transform duration-300" />
                        <span>Collapse</span>
                      </Button>

                      {/* User Button (Centered) - Removed py-2 */}
                      <div className="flex w-full justify-center">
                        <UserButton />
                      </div>

                      {/* Logout Button (Styled like nav item) */}
                      <Button
                        variant="ghost"
                        // Mimic nav item styling
                        className="group flex w-full items-center justify-start gap-2 rounded-md px-2 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <LogOut className="h-5 w-5" />
                        )}
                        <span>
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </span>
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                // Simplified Skeleton State
                <div
                  className={cn(
                    "flex flex-col gap-2",
                    isCollapsed ? "items-center" : "items-start",
                  )}
                >
                  <Skeleton className="h-8 w-8 rounded-full" />{" "}
                  {/* UserButton Placeholder */}
                  <Skeleton
                    className={cn(
                      "rounded-lg",
                      isCollapsed ? "h-9 w-9" : "h-9 w-[80px]",
                    )}
                  />{" "}
                  {/* Logout Placeholder */}
                </div>
              )}

              {/* Collapse/Expand Button logic is now handled within the isLoaded conditional */}
              {/* {isLoaded && isCollapsed && ( ... )} */}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
}
