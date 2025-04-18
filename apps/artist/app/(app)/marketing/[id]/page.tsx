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
    links: [
      {
        platform: "Spotify",
        url: "#",
        logo: "/platforms/Spotify_Primary_Logo_RGB_Green.png",
        actionButton: "/platforms/Pre-save Button.svg",
        isAppleMusic: false,
      },
      {
        platform: "Apple Music",
        url: "#",
        logo: "/platforms/Apple_Music_Icon_RGB_sm_073120.svg",
        actionButton: "/platforms/Apple Music Pre-add Button.svg",
        isAppleMusic: true,
      },
      {
        platform: "Amazon Music",
        url: "#",
        logo: "/platforms/Amazon_Music_Logo_Horizontal_RGB_White+Music_Cyan_MASTER.svg",
        actionButton: "/platforms/Amazon Pre-save Button.svg",
        isAppleMusic: false,
      },
      {
        platform: "Deezer",
        url: "#",
        logo: "/platforms/Deezer_Logo_RVB_White.svg",
        actionButton: "/platforms/Deezer Pre-save Button.svg",
        isAppleMusic: false,
      },
    ],
  },
  "sauce-boyz-3": {
    title: "Sauce Boyz 3",
    artist: "Eladio Carrión",
    cover: "/Eladio_Sauce_Boyz_2_Cover.png",
    releaseDate: "2025-12-01T00:00:00Z",
    links: [
      {
        platform: "Spotify",
        url: "#",
        logo: "/platforms/Spotify_Primary_Logo_RGB_Green.png",
        actionButton: "/platforms/Pre-save Button.svg",
        isAppleMusic: false,
      },
      {
        platform: "Apple Music",
        url: "#",
        logo: "/platforms/Apple_Music_Icon_RGB_sm_073120.svg",
        actionButton: "/platforms/Apple Music Pre-add Button.svg",
        isAppleMusic: true,
      },
    ],
  },
};

export default function LandingPage() {
  const params = useParams();
  const id = params.id as string;
  const landingPage = landingPages[id as keyof typeof landingPages];

  // State for copy button
  const [copied, setCopied] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Handle copying URL
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

  // Page title from Figma
  const pageTitle = "Pre-Add Song";

  return (
    // Figma exact match with responsive container
    <div className="min-h-screen bg-zinc-950">
      {/* Admin bar - restored */}
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
              className={`relative bg-white text-black transition-all duration-300 ${
                copied ? "ring-2 ring-green-400" : ""
              }`}
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

      {/* Page title */}
      <div className="pt-8 pl-8 text-lg font-medium text-white"></div>

      {/* Main content container - responsive with aspect ratio control */}
      <div className="flex items-center justify-center px-4 py-8">
        {/* White card container with responsive width */}
        <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl">
          {/* Main content area */}
          <div className="relative min-h-[900px] w-full">
            {/* Blurred background cover */}
            <div className="absolute inset-0">
              <Image
                src={landingPage.cover}
                alt="Background"
                fill
                className="scale-110 object-cover blur-xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/30 to-black/40"></div>
            </div>

            {/* Content layout - maintains aspect ratio */}
            <div className="relative flex aspect-[1.6/1] w-full flex-col">
              {/* Main album artwork centered but moved up */}
              <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <div className="relative h-[350px] w-[350px] overflow-hidden rounded-lg shadow-xl sm:h-[400px] sm:w-[400px]">
                  <Image
                    src={landingPage.cover}
                    alt={landingPage.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Countdown timer - right side vertical stack, positioned closer to cover */}
              <div className="absolute top-[40%] right-[15%] flex -translate-y-1/2 transform flex-col gap-4">
                {Object.entries(timeLeft).map(([unit, value], index) => (
                  <div
                    key={unit}
                    className="flex h-20 w-20 flex-col items-center justify-center rounded-lg bg-zinc-900/80 shadow-lg"
                  >
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="text-xs text-white/70">
                      {unit === "days"
                        ? "Days"
                        : unit === "hours"
                          ? "Hours"
                          : unit === "minutes"
                            ? "Minutes"
                            : "Seconds"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Title positioning - moved down to avoid clashing with art */}
              <div className="absolute top-[70%] left-1/2 w-full -translate-x-1/2 transform text-center">
                <h1 className="text-3xl font-bold text-white">
                  {landingPage.artist} - {landingPage.title}
                </h1>
              </div>

              {/* Streaming links - positioned at the bottom with improved spacing */}
              <div className="absolute top-144 flex w-full justify-center">
                <div className="grid w-[80%] max-w-xl grid-cols-1 flex-col items-center gap-6">
                  {landingPage.links.map((link) => (
                    <div
                      key={link.platform}
                      className="flex w-full items-center justify-center gap-12"
                    >
                      {/* Platform logo with label */}
                      <div className="flex flex-col items-center">
                        {link.isAppleMusic}
                        <div className="flex items-center justify-center gap-2">
                          <div className="relative h-6 w-28">
                            <Image
                              src={link.logo}
                              alt={link.platform}
                              fill
                              className="object-contain object-center"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action button */}
                      <div className="relative h-[30px] w-[70px]">
                        <Image
                          src={link.actionButton}
                          alt={`${link.platform} action`}
                          fill
                          className="object-contain object-right"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
