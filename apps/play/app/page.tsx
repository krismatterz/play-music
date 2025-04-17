"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconBrandSpotify,
  IconBrandApple,
  IconMusic,
  IconPlayerPlay,
  IconMicrophone,
  IconDeviceAirpods,
  IconChartBar,
  IconBrain,
  IconArrowRight,
} from "@tabler/icons-react";
import Navbar from "../components/landing/Navbar";
import Image from "next/image";

// Hero background component with animated elements
const HeroBackground: React.FC = () => {
  // Store the random positions and sizes for circles in state so they are only generated on the client
  const [circles, setCircles] = useState<
    {
      left: string;
      top: string;
      width: string;
      height: string;
      animationDuration: string;
      animationDelay: string;
      animationTimingFunction: string;
      animationIterationCount: string;
      animationDirection: string;
      animationName: string;
    }[]
  >([]);

  useEffect(() => {
    // Only runs on client
    const generated = Array.from({ length: 12 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 400 + 100}px`,
      height: `${Math.random() * 400 + 100}px`,
      animationDuration: `${Math.random() * 10 + 10}s`,
      animationDelay: `${Math.random() * 5}s`,
      animationTimingFunction: "ease-in-out",
      animationIterationCount: "infinite",
      animationDirection: "alternate",
      animationName: i % 2 === 0 ? "float1" : "float2",
    }));
    setCircles(generated);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-950 to-black"></div>

      {/* Animated circles */}
      <div className="absolute inset-0 opacity-30">
        {circles.length
          ? circles.map((style, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-amber-700/20 to-amber-300/20 blur-3xl"
                style={style}
              />
            ))
          : Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-amber-700/20 to-amber-300/20 blur-3xl"
                style={{
                  left: "50%",
                  top: "50%",
                  width: "200px",
                  height: "200px",
                }}
              />
            ))}
      </div>

      {/* Sound wave effect */}
      <div className="absolute right-0 bottom-0 left-0 h-32 opacity-20">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 bg-amber-700"
            style={{
              left: `${i * 2.5}%`,
              height: `${Math.sin(i * 0.2) * 50 + 50}px`,
              width: "8px",
              borderRadius: "4px",
              animationName: "soundWave",
              animationDuration: "1.5s",
              animationIterationCount: "infinite",
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes float1 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(50px, 50px) scale(1.2);
          }
        }
        @keyframes float2 {
          0% {
            transform: translate(0, 0) scale(1.2);
          }
          100% {
            transform: translate(-50px, -50px) scale(1);
          }
        }
        @keyframes soundWave {
          0%,
          100% {
            height: 20px;
          }
          50% {
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
};

// Feature card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="flex flex-col items-start rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg"
    >
      <div className="mb-4 rounded-lg bg-gradient-to-br from-amber-700 to-amber-300 p-3">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-sm text-neutral-300">{description}</p>
    </motion.div>
  );
};

// App preview component with parallax effect
const AppPreview: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;

      const { left, top, width, height } =
        previewRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      previewRef.current.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    };

    const handleMouseLeave = () => {
      if (!previewRef.current) return;
      previewRef.current.style.transform =
        "perspective(1000px) rotateY(0deg) rotateX(0deg)";
      previewRef.current.style.transition = "transform 0.5s ease";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={previewRef}
      className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl transition-transform duration-300 ease-out"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* App interface mockup */}
      <div className="bg-gradient-to-b from-amber-950 to-black p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconPlayerPlay size={18} className="text-amber-700" />
            <span className="text-sm font-medium text-white">Play</span>
          </div>
          <div className="h-6 w-24 rounded-full bg-white/10"></div>
        </div>

        {/* Currently playing */}
        <div className="mb-4 rounded-lg bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded bg-gradient-to-br from-amber-600 to-amber-300"></div>
            <div>
              <div className="text-sm font-medium text-white">
                Currently Playing
              </div>
              <div className="text-xs text-neutral-400">Eladio Carrión</div>
            </div>
          </div>
        </div>

        {/* Playlist rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-white/5 py-3"
          >
            <div className="h-10 w-10 rounded bg-white/10"></div>
            <div>
              <div className="text-xs text-white">Track Name {i + 1}</div>
              <div className="text-xs text-neutral-400">Artist</div>
            </div>
            <div className="ml-auto text-xs text-neutral-400">3:2{i}</div>
          </div>
        ))}

        {/* AI suggestion */}
        <div className="mt-4 rounded-lg bg-gradient-to-r from-amber-900/30 to-amber-300/30 p-3">
          <div className="mb-1 bg-gradient-to-r from-purple-600 via-amber-600 via-15% to-amber-300 bg-clip-text text-xs font-bold text-transparent">
            AI SUGGESTION
          </div>
          <div className="text-sm text-white">
            Based on your listening, try this playlist
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="relative text-white">
        <HeroBackground />

        {/* Hero Section */}
        <section className="min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="lg:w-1/2"
              >
                <div className="mb-4 font-medium text-amber-600">
                  INTRODUCING PLAY
                </div>
                <h1 className="mb-6 text-5xl leading-tight font-bold md:text-6xl">
                  The Next Generation
                  <span className="bg-gradient-to-r from-amber-600 to-amber-300 bg-clip-text text-transparent">
                    {" "}
                    Music Experience
                  </span>
                </h1>

                <p className="mb-8 max-w-lg text-xl text-neutral-300">
                  Discover, enjoy, and interact with music in a new way.
                  <br />
                  Play Dance, Latin, Amapiano & Rap music.
                  <br />
                  <br />
                  Feeling in the mood for something specific?
                </p>

                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-700 to-amber-400 px-6 py-3 font-medium text-white transition-all hover:shadow-lg"
                  >
                    <Link href="/player" className="flex items-center gap-2">
                      Play Music <IconArrowRight size={18} />
                    </Link>
                  </motion.button>

                  {/* Not active: Demo button */}
                  {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
                  >
                    Watch Demo
                  </motion.button> */}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex justify-center lg:w-1/2"
              >
                <AppPreview />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Platform Integration Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Seamless Integration</h2>
              <p className="mx-auto max-w-lg text-neutral-300">
                Import your existing libraries and playlists from all major
                streaming platforms
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-16 w-16 items-center justify-center">
                  <Image
                    src="/platforms/Spotify_Primary_Logo_RGB_Green.png"
                    alt="Spotify"
                    width={48}
                    height={48}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-16 w-16 items-center justify-center">
                  <Image
                    src="/platforms/Apple_Music_Icon_RGB_sm_073120.svg"
                    alt="Apple Music"
                    width={48}
                    height={48}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-24 w-24 items-center justify-center">
                  <Image
                    src="/platforms/Deezer_Logo_RVB_White.svg"
                    alt="Deezer"
                    width={92}
                    height={92}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-24 w-24 items-center justify-center">
                  <Image
                    src="/platforms/Amazon_Music_Logo_Horizontal_RGB_White+Music_Cyan_MASTER.svg"
                    alt="Amazon Music"
                    width={92}
                    height={92}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Why Choose Play</h2>
              <p className="mx-auto max-w-lg text-neutral-300">
                Redefining how you discover, enjoy, and interact with music
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<IconBrain size={24} className="text-white" />}
                title="AI-Powered Discovery"
                description="Our advanced AI analyzes your listening habits to recommend music you'll love."
              />

              <FeatureCard
                icon={<IconDeviceAirpods size={24} className="text-white" />}
                title="Studio Quality Audio"
                description="Experience your music in lossless, high-definition audio quality."
              />

              <FeatureCard
                icon={<IconMicrophone size={24} className="text-white" />}
                title="Artist Spotlights"
                description="Connect directly with your favorite artists through exclusive content."
              />

              <FeatureCard
                icon={<IconChartBar size={24} className="text-white" />}
                title="Advanced Analytics"
                description="Gain insights into your listening patterns and musical preferences."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-gradient-to-r from-amber-900/30 to-amber-300/30 p-12 backdrop-blur-lg">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <div>
                  <h2 className="mb-4 text-3xl font-bold">
                    Ready to transform your music experience?
                  </h2>
                  <p className="max-w-lg text-neutral-300">
                    Join thousands of music lovers already enjoying the next
                    generation platform.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-gradient-to-r from-amber-500 to-amber-300 px-8 py-4 text-lg font-medium text-white transition-all hover:shadow-lg"
                >
                  Get Started Free
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <IconPlayerPlay size={24} className="text-amber-500" />
                <span className="text-xl font-bold text-white">play</span>
              </div>
              <p className="text-sm text-white">
                The next generation music platform with AI-powered discovery and
                HD audio.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-bold text-white">Platform</h3>
              <ul className="space-y-2 text-white">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-bold text-white">Company</h3>
              <ul className="space-y-2 text-white">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-bold text-white">Legal</h3>
              <ul className="space-y-2 text-white">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
            <div className="text-sm text-white">
              {new Date().getFullYear()} &copy; Play-Music. All rights reserved.
            </div>

            <div className="mt-4 flex gap-4 md:mt-0">
              <Link
                href="https://github.com/krismatterz"
                className="text-white transition-colors hover:text-white"
              >
                GitHub
              </Link>
              <Link
                href="https://x.com/krismatterz"
                className="text-white transition-colors hover:text-white"
              >
                X/Twitter
              </Link>
              <Link
                href="https://www.instagram.com/krismatterz"
                className="text-white transition-colors hover:text-white"
              >
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
