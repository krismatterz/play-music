"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useState, useEffect } from "react";

// Mock database of landing pages
const landingPages = {
  "eladio-don-kbrn": {
    title: "DON KBRN",
    artist: "Eladio Carrión",
    cover: "/Eladio - DON KBRN.png",
    releaseDate: "2025-04-19T00:00:00Z",
    backgroundColor: "from-amber-900 to-black",
    links: [
      { platform: "Spotify", url: "#", color: "#1DB954", action: "Pre-save" },
      {
        platform: "Apple Music",
        url: "#",
        color: "#FA243C",
        action: "Pre-add",
      },
      {
        platform: "Amazon Music",
        url: "#",
        color: "#00A8E1",
        action: "Pre-save",
      },
      { platform: "Deezer", url: "#", color: "#00C7F2", action: "Pre-save" },
    ],
  },
  "sauce-boyz-3": {
    title: "Sauce Boyz 3",
    artist: "Eladio Carrión",
    cover: "/SauceBoyz3.png",
    releaseDate: "2025-12-01T00:00:00Z",
    backgroundColor: "from-blue-900 to-black",
    links: [
      { platform: "Spotify", url: "#", color: "#1DB954", action: "Pre-save" },
      {
        platform: "Apple Music",
        url: "#",
        color: "#FA243C",
        action: "Pre-add",
      },
    ],
  },
};

export default function LandingPage() {
  const params = useParams();
  const id = params.id as string;
  const landingPage = landingPages[id as keyof typeof landingPages];

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Moved copied state and handler to top level
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      "https://open.spotify.com/album/77WXheyyYBkqqz6Q19l37a",
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  useEffect(() => {
    if (!landingPage) return;

    const calculateTimeLeft = () => {
      const difference =
        new Date(landingPage.releaseDate).getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [landingPage]);

  if (!landingPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Landing page not found</h1>
          <Button asChild>
            <Link href="/marketing">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go back to Marketing
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen flex-col bg-gradient-to-b ${landingPage.backgroundColor} text-white`}
    >
      {/* Admin bar - only visible when accessed within the app */}
      <div className="bg-black/80 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/marketing">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`relative bg-white text-black transition-all duration-300 ${copied ? "ring-2 ring-green-400" : ""}`}
              type="button"
              onClick={handleCopy}
              style={{ minWidth: 110 }}
            >
              <span className="flex items-center">
                <Share2
                  className={`mr-2 h-4 w-4 text-black transition-transform duration-200 ${copied ? "scale-125 text-green-600" : ""}`}
                />
                {copied ? (
                  <span className="text-green-600 transition-opacity duration-200">
                    Copied!
                  </span>
                ) : (
                  "Copy URL"
                )}
              </span>
            </Button>
            {/* TODO: Add edit landing page button */}
            <Button
              size="sm"
              disabled
              className="cursor-not-allowed opacity-50"
            >
              Edit Landing Page
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col items-center md:flex-row md:items-start md:gap-8">
            {/* Album art */}
            <div className="relative mb-8 h-64 w-64 flex-shrink-0 overflow-hidden rounded-lg shadow-2xl md:mb-0 md:h-80 md:w-80">
              <Image
                src={landingPage.cover}
                alt={`${landingPage.title} - ${landingPage.artist}`}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                  e.currentTarget.style.backgroundColor = "#333";
                }}
              />
            </div>

            {/* Info and links */}
            <div className="flex-grow text-center md:text-left">
              <h2 className="mb-1 text-3xl font-bold">{landingPage.title}</h2>
              <h3 className="mb-8 text-xl text-white/80">
                {landingPage.artist}
              </h3>

              {/* Countdown timer */}
              <div className="mb-8 flex justify-center gap-4 md:justify-start">
                <div className="flex flex-col items-center rounded-lg bg-black/40 p-3 shadow-lg">
                  <span className="text-2xl font-bold">{timeLeft.days}</span>
                  <span className="text-xs text-white/70">Days</span>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-black/40 p-3 shadow-lg">
                  <span className="text-2xl font-bold">{timeLeft.hours}</span>
                  <span className="text-xs text-white/70">Hours</span>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-black/40 p-3 shadow-lg">
                  <span className="text-2xl font-bold">{timeLeft.minutes}</span>
                  <span className="text-xs text-white/70">Minutes</span>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-black/40 p-3 shadow-lg">
                  <span className="text-2xl font-bold">{timeLeft.seconds}</span>
                  <span className="text-xs text-white/70">Seconds</span>
                </div>
              </div>

              {/* Streaming links */}
              <div className="space-y-3">
                {landingPage.links.map((link) => (
                  <Button
                    key={link.platform}
                    className={`w-full justify-between bg-[${link.color}] text-white hover:bg-[${link.color}]/90`}
                    style={{ backgroundColor: link.color }}
                  >
                    <span className="flex items-center">
                      <span className="mr-2 h-5 w-5 rounded-full bg-white/20"></span>
                      {link.platform}
                    </span>
                    <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
                      {link.action}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
