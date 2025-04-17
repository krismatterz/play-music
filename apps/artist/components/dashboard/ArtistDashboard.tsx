"use client";

import React from "react";
import ArtistHeader from "./ArtistHeader";
import TopTracks from "./TopTracks";
import Albums from "./Albums";
import AudienceStats from "./AudienceStats";
import UpcomingEvents from "./UpcomingEvents";

const ArtistDashboard: React.FC = () => {
  // Inspired by the gradient in SmartPlaylistPreview
  const backgroundStyle = {
    // Using a darker gradient suitable for a dashboard background
    backgroundImage: `radial-gradient(ellipse at top, hsl(220 10% 15%) 0%, hsl(220 10% 5%) 70%)`,
  };

  return (
    <div className="min-h-screen p-4 text-white sm:p-8" style={backgroundStyle}>
      <ArtistHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Wider for tracks */}
        <div className="lg:col-span-2">
          <TopTracks />
        </div>
        {/* Right Column: Stacked stats and events */}
        <div className="space-y-6">
          <AudienceStats />
          <UpcomingEvents />
        </div>
      </div>
      {/* Full Width Section for Albums */}
      <div className="mt-6">
        <Albums />
      </div>
    </div>
  );
};

export default ArtistDashboard;
