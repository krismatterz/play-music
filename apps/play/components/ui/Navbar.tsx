"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconPlayerPlay } from "@tabler/icons-react";

const ARTIST_DASHBOARD_URL =
  process.env.NODE_ENV === "production"
    ? "https://artist.play-music.app/dashboard"
    : "http://localhost:3001/dashboard";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-6 left-1/2 z-50 w-[95vw] max-w-5xl -translate-x-1/2 rounded-2xl border border-white/20 bg-black/30 shadow-2xl backdrop-blur-2xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <IconPlayerPlay size={28} className="text-amber-700" />
          <span className="text-xl font-bold text-white">Play</span>
        </motion.div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full border border-black bg-[#F8F3F2] px-4 py-2 text-sm font-semibold text-black shadow-sm transition-all hover:border-[#F8F3F2] hover:bg-black hover:text-[#F8F3F2]"
          >
            <Link
              href={ARTIST_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Artist Dashboard
            </Link>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-gradient-to-r from-amber-700 to-amber-400 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:from-amber-800 hover:to-amber-500 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none"
          >
            <Link href="/player">Play Music</Link>
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
