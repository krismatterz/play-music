"use client";

import { useState, useCallback, useMemo } from "react";
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

// Navigation items are static and memoized outside component
interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems = [
  {
    title: "navigation.dashboard",
    href: "/dashboard",
    icon: LayoutDashboard as React.ComponentType<{ className?: string }>,
  },
  {
    title: "navigation.music",
    href: "/music",
    icon: Music as React.ComponentType<{ className?: string }>,
  },
  {
    title: "navigation.marketing",
    href: "/marketing",
    icon: Users as React.ComponentType<{ className?: string }>,
  },
  {
    title: "navigation.settings",
    href: "/settings",
    icon: Settings as React.ComponentType<{ className?: string }>,
  },
];

type NavItem = (typeof sidebarItems)[number];
type NavKey = NavItem["title"];

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

  // Initialize state with the value from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => getInitialCollapsed());

  // Memoize handlers and values to prevent unnecessary re-renders
  const handleCollapse = useCallback((value: boolean) => {
    setIsCollapsed(value);
    localStorage.setItem("sidebarCollapsed", String(value));
  }, []);

  // Navigation buttons to be shown
  // This function returns the display text for each navigation item.
  const getNavText = (key: NavKey) => {
    switch (key) {
      case "navigation.dashboard":
        return "Dashboard";
      case "navigation.music":
        return "Music";
      case "navigation.marketing":
        return "Marketing";
      case "navigation.settings":
        return "Settings";
      default:
        return key;
    }
  };

  const displayName = useMemo(() => {
    if (loading) return ""; // Return empty string while loading
    return user?.displayName ?? user?.email?.split("@")[0] ?? "";
  }, [user?.displayName, user?.email, loading]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [signOut, router]);

  // Render the sidebar with static initial state
  return (
    <div className="sticky top-0 hidden h-screen p-6 md:block">
      <div
        className={`sidebar artist-bg supports-[backdrop-filter]:bg-background/60 relative h-full rounded-xl border shadow-lg backdrop-blur transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[70px]" : "w-[240px]"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Collapse toggle button */}
          <Button
            variant="ghost"
            size="icon"
            className="bg-background absolute top-12 -right-3 h-6 w-6 rounded-full border shadow-sm"
            onClick={() => handleCollapse(!isCollapsed)}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={isCollapsed ? "collapsed" : "expanded"}
                initial={{ rotate: isCollapsed ? 0 : 180 }}
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="flex items-center justify-center"
              >
                <ChevronLeft className="h-3 w-3" />
              </motion.div>
            </AnimatePresence>
          </Button>

          {/* Logo section */}
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
                    initial={false}
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

          {/* Navigation items section */}
          <div className="flex-1 space-y-1 p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={`hover:bg-accent relative h-9 overflow-hidden rounded-md px-0 ${
                    isCollapsed ? "w-9" : "w-full"
                  } ${isActive ? "bg-primary hover:bg-primary text-primary-foreground" : ""}`}
                  asChild
                >
                  <Link href={item.href}>
                    <div className="flex h-full w-full items-center">
                      <div className="flex h-full w-9 shrink-0 items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.div
                            className="ml-[9px] flex-1 overflow-hidden text-left"
                            initial={false}
                            animate={{ width: "auto", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-sm whitespace-nowrap">
                              {getNavText(item.title)}
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

          {/* Bottom utilities section */}
          <div className="mt-auto border-t">
            <div className="flex flex-col gap-1 p-4">
              {/* Theme selectors */}
              <div
                className={`flex gap-1 ${
                  isCollapsed ? "flex-col" : "items-center justify-between"
                }`}
              >
                <ThemeToggle showIcons collapsed={isCollapsed} align="start" />
              </div>

              {/* User profile section */}
              <div className="flex flex-col gap-1 border-t pt-2">
                <Button
                  variant="ghost"
                  className={`hover:bg-accent relative h-9 overflow-hidden rounded-md px-0 ${
                    isCollapsed ? "w-9" : "w-full"
                  }`}
                >
                  <div className="flex h-full w-full items-center">
                    <motion.div
                      layout
                      transition={{ duration: 0.3 }}
                      className="flex h-full w-9 shrink-0 items-center justify-center"
                    >
                      <User className="h-5 w-5" />
                    </motion.div>
                    <AnimatePresence initial={false} mode="wait">
                      {!isCollapsed && displayName && (
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
                  className={`hover:bg-accent relative h-9 overflow-hidden rounded-md px-0 ${
                    isCollapsed ? "w-9" : "w-full"
                  }`}
                  onClick={handleLogout}
                >
                  <div className="flex h-full w-full items-center">
                    <div className="flex h-full w-9 shrink-0 items-center justify-center">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.div
                          className="ml-[9px] flex-1 overflow-hidden text-left"
                          initial={false}
                          animate={{ width: "auto", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-sm whitespace-nowrap">
                            Logout
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
      </div>
    </div>
  );
}
