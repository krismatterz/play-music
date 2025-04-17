import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowRight, IconPlayerPlay } from "@tabler/icons-react";

// App preview component with parallax effect
const AppPreview: React.FC = () => {
  const previewRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

const Hero: React.FC = () => {
  return (
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
  );
};

export default Hero;
