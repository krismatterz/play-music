"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { ModeToggle as ThemeToggle } from "./theme-toggle";
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  User,
  LogOut,
  Music,
} from "lucide-react";
import { BetaBadge } from "./ui/beta-badge";
import { useClerk, useUser } from "@clerk/nextjs";
import { cn } from "../lib/utils";
import {
  ResizablePanelGroup,
  ResizablePanel,
  // ResizableHandle, // Not using a visible handle for now
} from "./ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ScrollArea } from "./ui/scroll-area";

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
    icon: Users,
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
  const { user, isLoaded } = useUser();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    const initialCollapsed = savedState === "true";
    setIsCollapsed(initialCollapsed);
    setIsMounted(true);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prevCollapsed) => {
      const newState = !prevCollapsed;
      localStorage.setItem("sidebarCollapsed", String(newState));
      return newState;
    });
  }, []);

  const displayName = useMemo(() => {
    if (!isLoaded) return "Loading...";
    return (
      user?.firstName ??
      user?.username ??
      user?.primaryEmailAddress?.emailAddress?.split("@")[0] ??
      "Artist"
    );
  }, [
    user?.firstName,
    user?.username,
    user?.primaryEmailAddress?.emailAddress,
    isLoaded,
  ]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await clerkSignOut(() => router.push("/"));
    } catch (error) {
      console.error("Clerk logout failed:", error);
      setIsLoggingOut(false);
    }
  }, [clerkSignOut, router]);

  if (!isMounted) {
    return (
      <div className="sticky top-0 hidden h-screen w-[240px] p-6 md:block"></div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 hidden h-screen p-6 md:block">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full max-w-xs items-stretch rounded-xl border border-neutral-700 bg-black"
        >
          <ResizablePanel
            defaultSize={20}
            collapsedSize={4}
            collapsible={true}
            minSize={15}
            maxSize={25}
            onCollapse={() => {
              if (!isCollapsed) {
                setIsCollapsed(true);
                localStorage.setItem("sidebarCollapsed", "true");
              }
            }}
            onExpand={() => {
              if (isCollapsed) {
                setIsCollapsed(false);
                localStorage.setItem("sidebarCollapsed", "false");
              }
            }}
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

            <div className="mt-auto flex flex-col gap-2 border-t border-neutral-700 p-2">
              <div
                className={cn(
                  isCollapsed
                    ? "flex justify-center"
                    : "flex items-center justify-between px-1",
                )}
              >
                <ThemeToggle showIcons={!isCollapsed} collapsed={isCollapsed} />
              </div>

              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    >
                      <User className="h-5 w-5" />
                      <span className="sr-only">Profile</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="border-neutral-700 bg-black text-white"
                  >
                    {displayName}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  variant="ghost"
                  className="group flex items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
                >
                  <User className="h-5 w-5" />
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {displayName}
                  </span>
                </Button>
              )}

              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white"
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
              ) : (
                <Button
                  variant="ghost"
                  className="group flex items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <LogOut className="h-5 w-5" />
                  )}
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </Button>
              )}

              <div
                className={cn(
                  "flex w-full pt-2",
                  isCollapsed ? "justify-center" : "justify-end",
                )}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                      onClick={handleToggleCollapse}
                      aria-label={
                        isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                      }
                    >
                      <ChevronLeft
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          isCollapsed && "rotate-180",
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side={isCollapsed ? "right" : "top"}
                    className="border-neutral-700 bg-black text-white"
                  >
                    {isCollapsed ? "Expand" : "Collapse"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
}
