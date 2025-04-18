"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";
import SmartPlaylistPreview from "./SmartPlaylistPreview";

// Hero background component with animated elements
export const HeroBackground: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);

  const [circles, setCircles] = React.useState<
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

  React.useEffect(() => {
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
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-950 to-black"></div>
      {/* Animated circles */}
      <div className="absolute inset-0 opacity-30">
        {mounted && circles.length
          ? circles.map((style, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-amber-700/20 to-amber-300/20 blur-3xl"
                style={style}
              />
            ))
          : null}
      </div>
      {/* Sound wave effect */}
      <div className="absolute right-0 bottom-0 left-0 h-32 opacity-20">
        {mounted &&
          Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="sound-wave absolute bottom-0 bg-amber-700"
              style={{
                left: `${i * 2.5}%`,
                height: `${Math.sin(i * 0.2) * 50 + 50}px`,
                width: "8px",
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
      </div>
      <style jsx global>{`
        .sound-wave {
          width: 8px;
          border-radius: 4px;
          animation: soundWave 1.5s infinite;
        }
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

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen pt-60 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2 lg:pl-36"
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
            <SmartPlaylistPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
