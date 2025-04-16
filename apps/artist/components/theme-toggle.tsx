"use client";

import { useState } from "react";
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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // In a real app, you'd implement actual theme switching here
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9 rounded-md", collapsed ? "justify-center" : "")}
      onClick={toggleTheme}
    >
      {showIcons &&
        (theme === "light" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        ))}
    </Button>
  );
}
