"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

interface ThemeToggleProps {
  showIcons?: boolean;
  collapsed?: boolean;
  align?: "start" | "center" | "end";
}

export function ModeToggle({
  showIcons = true,
  collapsed = false,
  align = "center",
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9 rounded-md", collapsed ? "justify-center" : "")}
      onClick={toggleTheme}
    >
      {showIcons &&
        (theme === "dark" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        ))}
    </Button>
  );
}
