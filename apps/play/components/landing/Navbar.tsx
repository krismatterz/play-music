"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { IconPlayerPlay } from "@tabler/icons-react";
import React from "react";
import Image from "next/image";

const ARTIST_DASHBOARD_URL =
  process.env.NODE_ENV === "production"
    ? "https://artist.play-music.app/dashboard"
    : "http://localhost:3001/dashboard";

const Navbar: React.FC = () => {
  const notesRef = useRef<(SVGSVGElement | null)[]>([]);
  const playMusicBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Initially hide notes
    notesRef.current.forEach((note) => {
      if (note) {
        gsap.set(note, { opacity: 0, y: 20, x: 0 });
      }
    });

    if (!playMusicBtnRef.current) return;

    const handleEnter = () => {
      notesRef.current.forEach((note, i) => {
        if (note) {
          gsap.to(note, {
            opacity: 1,
            y: -24,
            x: i * 22 - 22, // spread left to right
            duration: 0.5,
            delay: i * 0.08,
            ease: "power2.out",
          });
        }
      });
    };
    const handleLeave = () => {
      notesRef.current.forEach((note, i) => {
        if (note) {
          gsap.to(note, {
            opacity: 0,
            y: 20,
            x: 0,
            duration: 0.4,
            delay: (2 - i) * 0.05,
            ease: "power2.in",
          });
        }
      });
    };
    const btn = playMusicBtnRef.current;
    btn.addEventListener("mouseenter", handleEnter);
    btn.addEventListener("mouseleave", handleLeave);
    return () => {
      btn.removeEventListener("mouseenter", handleEnter);
      btn.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 z-50 w-[95vw] max-w-5xl -translate-x-1/2 rounded-2xl border border-white/20 bg-black/30 shadow-2xl backdrop-blur-2xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <IconPlayerPlay size={28} className="text-amber-700" />
          <span className="text-xl font-bold text-white">Play</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-full border border-black bg-[#F8F3F2] px-4 py-2 text-sm font-semibold text-black shadow-sm transition-all hover:border-[#F8F3F2] hover:bg-black hover:text-[#F8F3F2]">
            <Link
              href={ARTIST_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Artist Dashboard
            </Link>
          </button>
          <div className="relative flex items-center">
            {/* Animated music notes for Play Music button */}
            <div className="pointer-events-none absolute -top-7 left-1/2 flex -translate-x-1/2 gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  ref={(el: HTMLSpanElement | null) => {
                    notesRef.current[i] = el as unknown as SVGSVGElement;
                  }}
                  style={{ display: "inline-block", width: 18, height: 18 }}
                >
                  <Image
                    src="/musical-note.svg"
                    alt="Music Note"
                    width={18}
                    height={18}
                    style={{
                      filter:
                        "invert(1) brightness(2) drop-shadow(0 1px 2px #0002)",
                    }}
                  />
                </span>
              ))}
            </div>
            <button
              ref={playMusicBtnRef}
              className="rounded-full bg-gradient-to-r from-amber-700 to-amber-400 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:from-amber-800 hover:to-amber-500 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none"
            >
              <Link href="/player">Play Music</Link>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
