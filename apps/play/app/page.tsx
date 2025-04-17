"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconPlayerPlay,
  IconMicrophone,
  IconDeviceAirpods,
  IconChartBar,
  IconBrain,
} from "@tabler/icons-react";
import Navbar from "../components/landing/Navbar";
import Image from "next/image";
import Hero from "../components/landing/Hero";
import { HeroBackground } from "../components/landing/Hero";
import FeatureCard from "../components/landing/FeatureCard";
import { useRouter } from "next/navigation";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="relative text-white">
        <HeroBackground />

        {/* Hero Section */}
        <Hero />

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
