import React, { useState, useRef, useEffect } from 'react';

interface PlayerProps {
  className?: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

const MusicPlayer: React.FC<PlayerProps> = ({ className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Mock song for demonstration
  const mockSong: Song = {
    id: '1',
    title: 'Sample Track',
    artist: 'Demo Artist',
    coverUrl: '/placeholder.jpg',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  };

  useEffect(() => {
    // Set mock song for demonstration
    setCurrentSong(mockSong);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * duration;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePrevious = () => {
    // In a real app, this would go to the previous song
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleNext = () => {
    // In a real app, this would go to the next song
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className={`bg-gray-900 border-t border-gray-800 p-4 ${className}`}>
      <audio 
        ref={audioRef}
        src={currentSong?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="container mx-auto flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-800 rounded flex-shrink-0">
              {currentSong && (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span>🎵</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{currentSong?.title || 'Not Playing'}</p>
              <p className="text-gray-400 text-sm">{currentSong?.artist || 'Select a song to play'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={togglePlayPause}
              className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={handleNext}
              className="text-gray-400 hover:text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <button className="text-gray-400 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0l-2.828 2.828m0 0a9 9 0 010-12.728m2.828 2.828a5 5 0 00-1.414 1.414" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
          <div 
            ref={progressBarRef}
            className="flex-grow h-1 bg-gray-700 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-white rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
