import { useState, useEffect } from "react";

// Simple translation dictionary
const translations = {
  dashboard: "Dashboard",
  quotes: "Quotes",
  clients: "Clients",
  settings: "Settings",
  logout: "Log Out",
};

export function useLanguage() {
  // In a real app, you'd have language switching logic here
  const t = translations;

  return { t };
}
