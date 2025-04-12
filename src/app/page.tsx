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

// Hero background component with animated elements
const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-violet-950 to-black"></div>
      
      {/* Animated circles */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-emerald-500/20 to-violet-500/20 blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 400 + 100}px`,
              height: `${Math.random() * 400 + 100}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
              animationName: i % 2 === 0 ? 'float1' : 'float2',
            }}
          />
        ))}
      </div>
      
      {/* Sound wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 bg-emerald-400"
            style={{
              left: `${i * 2.5}%`,
              height: `${Math.sin(i * 0.2) * 50 + 50}px`,
              width: '8px',
              borderRadius: '4px',
              animationName: 'soundWave',
              animationDuration: '1.5s',
              animationIterationCount: 'infinite',
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes float1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 50px) scale(1.2); }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0) scale(1.2); }
          100% { transform: translate(-50px, -50px) scale(1); }
        }
        @keyframes soundWave {
          0%, 100% { height: 20px; }
          50% { height: 80px; }
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

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 flex flex-col items-start"
    >
      <div className="p-3 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-neutral-300 text-sm">{description}</p>
    </motion.div>
  );
};

// App preview component with parallax effect
const AppPreview: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      
      const { left, top, width, height } = previewRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      previewRef.current.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    };

    const handleMouseLeave = () => {
      if (!previewRef.current) return;
      previewRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      previewRef.current.style.transition = 'transform 0.5s ease';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={previewRef}
      className="relative w-full max-w-md bg-black rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 ease-out border border-white/10"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* App interface mockup */}
      <div className="p-4 bg-gradient-to-b from-violet-950 to-black">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IconPlayerPlay size={18} className="text-emerald-500" />
            <span className="text-white font-medium text-sm">play</span>
          </div>
          <div className="w-24 h-6 bg-white/10 rounded-full"></div>
        </div>
        
        {/* Currently playing */}
        <div className="bg-white/5 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-violet-500 rounded"></div>
            <div>
              <div className="text-white font-medium text-sm">Currently Playing</div>
              <div className="text-neutral-400 text-xs">Artist Name</div>
            </div>
          </div>
        </div>
        
        {/* Playlist rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5">
            <div className="w-10 h-10 bg-white/10 rounded"></div>
            <div>
              <div className="text-white text-xs">Track Name {i + 1}</div>
              <div className="text-neutral-400 text-xs">Artist</div>
            </div>
            <div className="ml-auto text-neutral-400 text-xs">3:2{i}</div>
          </div>
        ))}
        
        {/* AI suggestion */}
        <div className="mt-4 bg-gradient-to-r from-violet-900/30 to-emerald-900/30 p-3 rounded-lg">
          <div className="text-xs text-emerald-400 font-medium mb-1">AI SUGGESTION</div>
          <div className="text-white text-sm">Based on your listening, try this playlist</div>
        </div>
      </div>
    </div>
  );
};

// Navbar component
const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <IconPlayerPlay size={28} className="text-emerald-500" />
          <span className="text-white font-bold text-xl">play</span>
        </motion.div>
        
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            Features
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            Pricing
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

// Testimonial section
const Testimonial: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-violet-900/20 to-emerald-900/20 p-8 rounded-xl backdrop-blur-md">
      <div className="flex flex-col items-center text-center">
        <div className="text-4xl mb-6">⭐⭐⭐⭐⭐</div>
        <p className="text-lg text-white italic mb-8 max-w-2xl">
          "Play has completely transformed how I discover new music. The AI recommendations
          are spot on, and the interface makes browsing my library a joy."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-full"></div>
          <div className="text-left">
            <div className="text-white font-medium">Alex Johnson</div>
            <div className="text-neutral-400 text-sm">Music Producer</div>
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
            <div className="flex flex-col lg:flex-row items-center gap-12 justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="lg:w-1/2"
              >
                <div className="text-emerald-400 font-medium mb-4">INTRODUCING PLAY</div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  The Next Generation
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-violet-400"> Music Experience</span>
                </h1>
                
                <p className="text-xl text-neutral-300 mb-8 max-w-lg">
                  AI-powered music discovery, personalized playlists, and high-definition audio
                  in one beautiful platform.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-violet-500 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    Get Started <IconArrowRight size={18} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white font-medium border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    Watch Demo
                  </motion.button>
                </div>
                
                <div className="flex items-center gap-6 mt-12">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-black"></div>
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-black -ml-2"></div>
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-black -ml-2"></div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-black -ml-2 flex items-center justify-center text-xs font-bold">
                      +5k
                    </div>
                  </div>
                  <div className="text-sm text-neutral-300">
                    Joined this month
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:w-1/2 flex justify-center"
              >
                <AppPreview />
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Platform Integration Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Seamless Integration</h2>
              <p className="text-neutral-300 max-w-lg mx-auto">
                Import your existing libraries and playlists from all major streaming platforms
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <motion.div
                whileHover={{ y: -5 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-[#1ED760] rounded-full flex items-center justify-center mb-2">
                  <IconBrandSpotify size={32} className="text-black" />
                </div>
                <span className="text-sm">Spotify</span>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2">
                  <IconBrandApple size={32} className="text-black" />
                </div>
                <span className="text-sm">Apple Music</span>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-2">
                  <IconMusic size={32} className="text-white" />
                </div>
                <span className="text-sm">YouTube Music</span>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-2">
                  <div className="text-xl font-bold text-violet-400">℗</div>
                </div>
                <span className="text-sm">Pandora</span>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Play</h2>
              <p className="text-neutral-300 max-w-lg mx-auto">
                Redefining how you discover, enjoy, and interact with music
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        
        {/* Testimonial Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Testimonial />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-violet-900/30 to-emerald-900/30 rounded-2xl p-12 backdrop-blur-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Ready to transform your music experience?</h2>
                  <p className="text-neutral-300 max-w-lg">
                    Join thousands of music lovers already enjoying the next generation platform. 
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-violet-500 text-white text-lg font-medium hover:shadow-lg transition-all"
                >
                  Get Started Free
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <IconPlayerPlay size={24} className="text-emerald-500" />
                <span className="text-white font-bold text-xl">play</span>
              </div>
              <p className="text-neutral-400 text-sm">
                The next generation music platform with AI-powered discovery and HD audio.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Licenses</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-400 text-sm">
              {new Date().getFullYear()} Play Music. All rights reserved.
            </div>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                Twitter
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                Instagram
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                LinkedIn
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                Facebook
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
