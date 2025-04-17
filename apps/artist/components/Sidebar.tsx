"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { ModeToggle as ThemeToggle } from "./theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
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
import { useAuth } from "../lib/hooks/useAuth";
import { cn } from "../lib/utils";

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
    icon: LayoutDashboard as React.ComponentType<{ className?: string }>,
  },
  {
    title: "Music",
    href: "/music",
    icon: Music as React.ComponentType<{ className?: string }>,
  },
  {
    title: "Marketing",
    href: "/marketing",
    icon: Users as React.ComponentType<{ className?: string }>,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings as React.ComponentType<{ className?: string }>,
  },
];

// Get initial collapsed state from localStorage during module initialization
const getInitialCollapsed = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  }
  return false;
};

// Initial rotation for the chevron based on collapsed state
const getInitialRotation = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true" ? 180 : 0;
  }
  return 0;
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false); // Default to false initially
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Add mounted state

  // Read from localStorage only after mounting
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    setIsCollapsed(savedState === "true");
    setIsMounted(true);
  }, []);

  const handleCollapse = useCallback((value: boolean) => {
    setIsCollapsed(value);
    localStorage.setItem("sidebarCollapsed", String(value));
  }, []);

  const displayName = useMemo(() => {
    if (loading) return "Loading...";
    return user?.displayName ?? user?.email?.split("@")[0] ?? "User";
  }, [user?.displayName, user?.email, loading]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  }, [signOut, router]);

  // Dynamic width based on isCollapsed state, but only apply after mount
  const sidebarWidth = isMounted
    ? isCollapsed
      ? "w-[70px]"
      : "w-[240px]"
    : "w-[240px]"; // Default width before mount

  return (
    <div className="sticky top-0 hidden h-screen p-6 md:block">
      <div
        className={`sidebar artist-bg supports-[backdrop-filter]:bg-background/60 relative h-full rounded-xl border shadow-lg backdrop-blur transition-all duration-300 ease-in-out ${
          sidebarWidth
        }`}
      >
        {/* Render children only after mount to avoid hydration issues with dynamic content */}
        {isMounted && (
          <div className="flex h-full flex-col">
            {/* Collapse toggle button - render structure but animate icon based on isCollapsed */}
            <Button
              variant="ghost"
              size="icon"
              className="bg-background absolute top-12 -right-3 h-6 w-6 rounded-full border shadow-sm"
              onClick={() => handleCollapse(!isCollapsed)}
            >
              <motion.div
                key={isCollapsed ? "collapsed" : "expanded"}
                initial={false} // Animate only based on current state
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="flex items-center justify-center"
              >
                <ChevronLeft className="h-3 w-3" />
              </motion.div>
            </Button>

            {/* Logo section - conditionally render content */}
            <div className="p-4">
              <div
                className={`flex h-5 items-center ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      className="flex items-center overflow-hidden"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-primary font-semibold whitespace-nowrap">
                        Play-Music
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  layout
                  transition={{ duration: 0.3 }}
                  className={isCollapsed ? "" : "ml-2"}
                >
                  <BetaBadge />
                </motion.div>
              </div>
            </div>

            {/* Navigation items section - Remove items-center and adjust padding */}
            <div
              className={cn(
                "flex flex-1 flex-col space-y-1 p-4", // Keep p-4 for both states, remove conditional padding/items-center
                // isCollapsed ? "items-center px-2 py-4" : "p-4", // Old style
              )}
            >
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    // Ensure button takes full width in both states for consistent layout start
                    // Apply w-full regardless of collapsed state, padding handled internally
                    // Remove justify-start from Button, handle alignment in inner div
                    className={cn(
                      "hover:bg-accent relative h-9 w-full overflow-hidden rounded-md px-0", // REMOVED justify-start
                      isActive
                        ? "bg-primary hover:bg-primary text-primary-foreground"
                        : "",
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      {/* Apply conditional justify-center here */}
                      <div
                        className={cn(
                          "flex h-full w-full items-center",
                          isCollapsed ? "justify-center" : "",
                        )}
                      >
                        {/* Icon container stays fixed width */}
                        <div className="flex h-full w-9 shrink-0 items-center justify-center">
                          <Icon className="h-5 w-5" />
                        </div>
                        <AnimatePresence initial={false}>
                          {!isCollapsed && (
                            <motion.div
                              className="ml-[9px] flex-1 overflow-hidden text-left"
                              initial={{ width: 0, opacity: 0 }}
                              animate={{ width: "auto", opacity: 1 }}
                              exit={{ width: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="text-sm whitespace-nowrap">
                                {item.title}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Link>
                  </Button>
                );
              })}
            </div>

            {/* Bottom utilities section - Remove items-center and adjust padding */}
            <div className="mt-auto border-t">
              <div
                className={cn(
                  "flex w-full flex-col gap-1 p-4", // Keep p-4 for both states, remove conditional padding/items-center
                  // isCollapsed ? "items-center px-2 py-4" : "p-4", // Old style
                )}
              >
                {/* Theme selectors - Ensure consistent alignment */}
                <div
                  className={cn(
                    "w-full",
                    // isCollapsed ? "flex justify-center" : "items-center justify-between", // Old style
                    "flex", // Use flex for layout
                    isCollapsed
                      ? "justify-center"
                      : "items-center justify-between", // Center only icon when collapsed
                  )}
                >
                  <ThemeToggle showIcons collapsed={isCollapsed} />
                </div>

                {/* User profile section - Remove items-center from parent */}
                <div
                  className={cn(
                    "flex w-full flex-col gap-1 border-t pt-2",
                    // isCollapsed ? "items-center" : "", // Old style - removed items-center
                  )}
                >
                  <Button
                    variant="ghost"
                    // Ensure button takes full width in both states
                    // Remove justify-start from Button, handle alignment in inner div
                    className={cn(
                      "hover:bg-accent relative h-9 w-full overflow-hidden rounded-md px-0", // REMOVED justify-start
                    )}
                  >
                    {/* Apply conditional justify-center here */}
                    <div
                      className={cn(
                        "flex h-full w-full items-center",
                        isCollapsed ? "justify-center" : "",
                      )}
                    >
                      {/* Icon container stays fixed width */}
                      <motion.div
                        layout
                        transition={{ duration: 0.3 }}
                        className="flex h-full w-9 shrink-0 items-center justify-center"
                      >
                        <User className="h-5 w-5" />
                      </motion.div>
                      <AnimatePresence initial={false} mode="wait">
                        {!isCollapsed && (
                          <motion.div
                            key="username"
                            className="ml-[9px] flex-1 overflow-hidden text-left"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <motion.span
                              layout
                              className="block text-sm whitespace-nowrap"
                            >
                              {displayName}
                            </motion.span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={isLoggingOut}
                    // Ensure button takes full width in both states
                    // Remove justify-start from Button, handle alignment in inner div
                    className={cn(
                      "hover:bg-accent relative h-9 w-full overflow-hidden rounded-md px-0", // REMOVED justify-start
                      isLoggingOut ? "cursor-not-allowed opacity-50" : "",
                    )}
                    onClick={handleLogout}
                  >
                    {/* Apply conditional justify-center here */}
                    <div
                      className={cn(
                        "flex h-full w-full items-center",
                        isCollapsed ? "justify-center" : "",
                      )}
                    >
                      {/* Icon container stays fixed width */}
                      <motion.div
                        layout
                        transition={{ duration: 0.3 }}
                        className="flex h-full w-9 shrink-0 items-center justify-center"
                      >
                        {isLoggingOut ? (
                          <span className="h-4 w-4 animate-spin">⏳</span>
                        ) : (
                          <LogOut className="h-5 w-5" />
                        )}
                      </motion.div>
                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.div
                            className="ml-[9px] flex-1 overflow-hidden text-left"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-sm whitespace-nowrap">
                              {isLoggingOut ? "Logging out..." : "Logout"}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
