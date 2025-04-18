"use client";

import Image from "next/image";
import { Button } from "../../../components/ui/button";
import {
  BarChart2,
  Upload,
  ChevronDown,
  Eye,
  Clock,
  Music,
  Disc,
  Users,
  Share2,
} from "lucide-react";
import { topTracks, type Track } from "../../../components/dashboard/mockData"; // Import mock data

export default function MusicPage() {
  // Removed the hardcoded sample data, now using imported topTracks

  // Background style inspired by ArtistDashboard
  const backgroundStyle = {
    backgroundImage: `radial-gradient(ellipse at top, hsl(220 10% 15%) 0%, hsl(220 10% 5%) 70%)`,
  };

  // Helper function to format plays (e.g., "1.2M" -> "1,200,000")
  // This is a simplified example, real-world formatting might be more complex
  const formatPlays = (plays: string): number => {
    const value = parseFloat(plays);
    if (plays.toLowerCase().includes("m")) {
      return value * 1_000_000;
    }
    if (plays.toLowerCase().includes("k")) {
      return value * 1_000;
    }
    return value;
  };

  // Calculate total plays (example)
  const totalPlays = topTracks.reduce(
    (sum, track) => sum + formatPlays(track.plays),
    0,
  );

  // Platform logos mapping
  const platformLogos = {
    Spotify: "/platforms/Spotify_Primary_Logo_RGB_Green.png",
    "Apple Music": "/platforms/Apple_Music_Icon_RGB_sm_073120.svg",
    Deezer: "/platforms/Deezer_Logo_RVB_White.svg",
  };

  // Mock platform data (replace with actual data source later)
  const platformData = [
    { name: "Spotify", percentage: 65 },
    { name: "Apple Music", percentage: 23 },
    { name: "Deezer", percentage: 12 },
  ];

  return (
    <div className="min-h-screen text-white" style={backgroundStyle}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">My Music</h1>
          <div className="flex gap-3">
            <Button
              variant="default"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-800 to-amber-600"
            >
              <Upload size={16} />
              <span>Upload Music</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-white/20 bg-white/10 text-amber-500 hover:bg-white/20 hover:text-amber-400"
            >
              <BarChart2 size={16} />
              <span>Detailed Reports</span>
            </Button>
          </div>
        </div>

        {/* Overall Stats Section - Updated Total Plays */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-black/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Total Plays</h3>
              <Music className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-3xl font-bold">{totalPlays.toLocaleString()}</p>
            <div className="mt-2 flex items-center text-xs text-green-500">
              <span className="mr-1">↑ 12%</span>
              <span className="text-white/60">from last month</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">New Listeners</h3>
              <Users className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-3xl font-bold">3,500,000</p>
            <div className="mt-2 flex items-center text-xs text-green-500">
              <span className="mr-1">↑ 18%</span>
              <span className="text-white/60">from last month</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Avg. Stream Time</h3>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-3xl font-bold">2:45</p>
            <div className="mt-2 flex items-center text-xs text-red-500">
              <span className="mr-1">↓ 1%</span>
              <span className="text-white/60">from last month</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Social Shares</h3>
              <Share2 className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-3xl font-bold">183,000</p>
            <div className="mt-2 flex items-center text-xs text-green-500">
              <span className="mr-1">↑ 2%</span>
              <span className="text-white/60">from last month</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Top performing tracks - Updated to use imported data */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-white/10 bg-black/40 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Top Tracks</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-black hover:bg-white/70"
                >
                  <ChevronDown size={16} className="mr-1" /> Filter
                </Button>
              </div>

              <div className="space-y-2">
                {topTracks.map((track: Track, index) => (
                  <div
                    key={`${track.title}-${index}`}
                    className={`flex items-center rounded-lg p-3 hover:bg-white/10 ${
                      index === 0
                        ? "border-l-2 border-amber-500 bg-white/10"
                        : ""
                    }`}
                  >
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded bg-black/30">
                      <span className="font-bold text-amber-500">
                        {index + 1}
                      </span>
                    </div>
                    <div className="relative mr-3 h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={track.cover}
                        alt={track.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                          e.currentTarget.style.backgroundColor = "#333";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{track.title}</p>
                      <p className="text-xs text-white/60">
                        {track.plays} plays
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-white/60">
                      <Clock size={16} />
                      <span className="min-w-[40px] text-right">
                        {track.duration}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-full border-amber-500 bg-amber-800 px-3 text-xs text-black hover:bg-white/70"
                      >
                        <Eye size={14} className="mr-1" /> Analytics
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column analytics - Updated Platform Logos */}
          <div className="space-y-6">
            <div className="rounded-lg border border-white/10 bg-black/40 p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Platform Distribution
              </h2>
              <div className="space-y-3">
                {platformData.map((platform) => (
                  <div key={platform.name} className="flex items-center gap-3">
                    <div className="relative h-6 w-6 flex-shrink-0">
                      <Image
                        src={
                          platformLogos[
                            platform.name as keyof typeof platformLogos
                          ]
                        }
                        alt={`${platform.name} logo`}
                        fill
                        sizes="24px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{platform.name}</p>
                      <div className="relative h-2 w-full rounded-full bg-white/20">
                        <div
                          className="absolute h-full rounded-full bg-amber-500" // Using amber color for bar
                          style={{ width: `${platform.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm font-bold">{platform.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/40 p-6">
              <h2 className="mb-4 text-xl font-semibold">Audience</h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm text-white/70">Age Groups</p>
                    <p className="text-xs text-white/50">% of listeners</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="h-6 rounded-l-full bg-amber-700"
                      style={{ width: "15%" }}
                    ></div>
                    <div
                      className="h-6 bg-amber-600"
                      style={{ width: "35%" }}
                    ></div>
                    <div
                      className="h-6 bg-amber-500"
                      style={{ width: "28%" }}
                    ></div>
                    <div
                      className="h-6 bg-amber-400"
                      style={{ width: "15%" }}
                    ></div>
                    <div
                      className="h-6 rounded-r-full bg-amber-300"
                      style={{ width: "7%" }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-white/60">
                    <span>18-24</span>
                    <span>25-34</span>
                    <span>35-44</span>
                    <span>45+</span>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm text-white/70">Gender</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-1 items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-purple-500"></div>
                      <p className="text-sm">Male</p>
                      <p className="ml-auto text-sm font-bold">62%</p>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-pink-500"></div>
                      <p className="text-sm">Female</p>
                      <p className="ml-auto text-sm font-bold">38%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity (unchanged for now) */}
        <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-black/30 p-3">
              <div className="h-8 w-8 rounded-full bg-green-500/20 p-1.5">
                <Music className="h-full w-full text-green-500" />
              </div>
              <div>
                <p className="font-medium">New listeners milestone reached</p>
                <p className="text-sm text-white/60">
                  Your track &quot;DON KBRN&quot; reached 1,000 unique listeners
                </p>
              </div>
              <p className="ml-auto text-xs text-white/40">2 days ago</p>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-black/30 p-3">
              <div className="h-8 w-8 rounded-full bg-amber-500/20 p-1.5">
                <Share2 className="h-full w-full text-amber-500" />
              </div>
              <div>
                <p className="font-medium">Your music was shared</p>
                <p className="text-sm text-white/60">
                  Someone shared &quot;Sauce Boyz 3&quot; on Instagram
                </p>
              </div>
              <p className="ml-auto text-xs text-white/40">3 days ago</p>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-black/30 p-3">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 p-1.5">
                <Disc className="h-full w-full text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Added to playlist</p>
                <p className="text-sm text-white/60">
                  &quot;Mi Error&quot; was added to 5 new playlists this week
                </p>
              </div>
              <p className="ml-auto text-xs text-white/40">5 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
