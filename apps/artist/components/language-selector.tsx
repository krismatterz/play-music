"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface LanguageSelectorProps {
  collapsed?: boolean;
  align?: "start" | "center" | "end";
}

export function LanguageSelector({
  collapsed = false,
  align = "center",
}: LanguageSelectorProps) {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
    // In a real app, you'd implement actual language switching here
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9 rounded-md", collapsed && "justify-center")}
      onClick={toggleLanguage}
    >
      <Globe className="h-4 w-4" />
    </Button>
  );
}
