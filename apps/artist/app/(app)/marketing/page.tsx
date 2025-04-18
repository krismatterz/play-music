"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { PlusCircle, BarChart, Clock, Pencil, Eye } from "lucide-react";

export default function MarketingPage() {
  // Background style inspired by ArtistDashboard
  const backgroundStyle = {
    backgroundImage: `radial-gradient(ellipse at top, hsl(220 10% 15%) 0%, hsl(220 10% 5%) 70%)`,
  };

  return (
    <div className="min-h-screen text-white" style={backgroundStyle}>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Promote Your Music</h1>
          <div className="flex gap-3">
            <Button
              asChild
              variant="ghost"
              className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-800 to-amber-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:text-black focus:outline-none"
              tabIndex={0}
            >
              <Link href="/music" tabIndex={-1}>
                <BarChart
                  size={16}
                  className="text-white transition-colors group-hover:text-white/70"
                />
                <span className="transition-colors group-hover:text-white/70">
                  View Analytics
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Example landing pages section */}
        <div className="mt-8 mb-12">
          <h2 className="mb-6 text-2xl font-semibold">Your Landing Pages</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Landing page card 1 - Live */}
            <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40 shadow-lg transition-all hover:border-amber-500/30 hover:shadow-amber-900/20">
              <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-amber-900/40 to-black">
                <Image
                  src="/Eladio - DON KBRN.png"
                  alt="Eladio Carrion - DON KBRN"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/marketing/eladio-don-kbrn">
                      <Eye className="mr-2 h-4 w-4" /> View Page
                    </Link>
                  </Button>
                </div>
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-lg font-bold">DON KBRN</p>
                  <p className="text-sm text-white/70">Eladio Carrión</p>
                </div>
                <div className="absolute top-2 right-2 rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                  Live
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-amber-500" />
                    <span className="text-xs">Launches in 2 days</span>
                  </div>
                  <p className="text-xs text-white/60">247 clicks</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {["Spotify", "Apple", "Deezer"].map((platform) => (
                    <div
                      key={platform}
                      className="rounded-full bg-white/10 px-2 py-1 text-xs"
                    >
                      {platform}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Landing page card 2 - Draft */}
            <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40 shadow-lg transition-all hover:border-amber-500/30 hover:shadow-amber-900/20">
              <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-blue-900/40 to-black">
                <Image
                  src="/Eladio_Sauce_Boyz_2_Cover.png"
                  alt="Sauce Boyz 3"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                    e.currentTarget.style.backgroundColor = "#333";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/Eladio_Sauce_Boyz_2_Cover.png">
                      <Pencil className="mr-2 h-4 w-4" /> Edit Page
                    </Link>
                  </Button>
                </div>
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-lg font-bold">Sauce Boyz 3</p>
                  <p className="text-sm text-white/70">Eladio Carrión</p>
                </div>
                <div className="absolute top-2 right-2 rounded-full bg-amber-500 px-2 py-1 text-xs font-semibold text-black">
                  Draft
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-amber-500" />
                    <span className="text-xs">Not scheduled</span>
                  </div>
                  <p className="text-xs text-white/60">--</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {["Spotify", "Apple"].map((platform) => (
                    <div
                      key={platform}
                      className="rounded-full bg-white/10 px-2 py-1 text-xs"
                    >
                      {platform}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Create new landing page card */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-black/20 p-8 text-center transition-all hover:border-amber-500/50 hover:bg-black/30">
              <Button
                variant="outline"
                size="lg"
                className="group relative mb-4 h-16 w-16 rounded-full border-white/20 bg-gradient-to-br from-purple-900 to-amber-600"
                asChild
              >
                <Link href="/marketing/create">
                  <span className="">
                    <PlusCircle className="h-10 w-10 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </span>
                </Link>
              </Button>
              <h3 className="mb-1 text-xl font-semibold">
                Create Landing Page
              </h3>
              <p className="text-sm text-white/60">
                For upcoming releases or existing songs
              </p>
            </div>
          </div>
        </div>

        {/* Landing page preview section */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            Landing Page Preview
          </h2>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-amber-950/20 to-black/80 p-6 shadow-xl">
            <div className="flex flex-col items-center md:flex-row md:items-start md:gap-8">
              {/* Album art */}
              <div className="relative mb-6 h-64 w-64 flex-shrink-0 overflow-hidden rounded-lg shadow-2xl md:mb-0">
                <Image
                  src="/Eladio - DON KBRN.png"
                  alt="Eladio Carrion - DON KBRN"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info and links */}
              <div className="flex-grow text-center md:text-left">
                <h2 className="mb-1 text-3xl font-bold">DON KBRN</h2>
                <h3 className="mb-6 text-xl text-white/80">Eladio Carrión</h3>

                {/* Countdown timer */}
                <div className="mb-8 flex justify-center gap-4 md:justify-start">
                  <div className="flex flex-col items-center rounded-lg bg-black/40 p-3 shadow-lg">
                    <span className="text-2xl font-bold">2</span>
                    <span className="text-xs text-white/70">Days</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-black/40 p-3 shadow-lg">
                    <span className="text-2xl font-bold">23</span>
                    <span className="text-xs text-white/70">Hours</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-black/40 p-3 shadow-lg">
                    <span className="text-2xl font-bold">57</span>
                    <span className="text-xs text-white/70">Minutes</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-black/40 p-3 shadow-lg">
                    <span className="text-2xl font-bold">56</span>
                    <span className="text-xs text-white/70">Seconds</span>
                  </div>
                </div>

                {/* Streaming links */}
                <div className="space-y-3">
                  <Button className="w-full justify-between bg-[#1DB954] text-white hover:bg-[#1DB954]/90">
                    <span className="flex items-center">
                      <span className="mr-2 h-5 w-5 rounded-full bg-white/20"></span>
                      Spotify
                    </span>
                    <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
                      Pre-save
                    </span>
                  </Button>

                  <Button className="w-full justify-between bg-[#FA243C] text-white hover:bg-[#FA243C]/90">
                    <span className="flex items-center">
                      <span className="mr-2 h-5 w-5 rounded-full bg-white/20"></span>
                      Apple Music
                    </span>
                    <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
                      Pre-add
                    </span>
                  </Button>

                  <Button className="w-full justify-between bg-[#00A8E1] text-white hover:bg-[#00A8E1]/90">
                    <span className="flex items-center">
                      <span className="mr-2 h-5 w-5 rounded-full bg-white/20"></span>
                      Amazon Music
                    </span>
                    <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
                      Pre-save
                    </span>
                  </Button>

                  <Button className="w-full justify-between bg-[#00C7F2] text-white hover:bg-[#00C7F2]/90">
                    <span className="flex items-center">
                      <span className="mr-2 h-5 w-5 rounded-full bg-white/20"></span>
                      Deezer
                    </span>
                    <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
                      Pre-save
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
