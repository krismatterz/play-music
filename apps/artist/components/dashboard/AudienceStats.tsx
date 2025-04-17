"use client";

import React from "react";
import { audienceLocations } from "./mockData";

const AudienceStats: React.FC = () => {
  return (
    <div className="rounded-xl bg-black/30 p-4 backdrop-blur-sm">
      <h2 className="mb-4 text-xl font-semibold text-white">
        Where People Listen
      </h2>
      {audienceLocations.map((location, index) => (
        <div
          key={location.city}
          className={`flex items-center justify-between py-2 ${index < audienceLocations.length - 1 ? "border-b border-white/10" : ""}`}
        >
          <span className="text-sm text-white">{location.city}</span>
          <span className="text-sm text-neutral-400">
            {location.listeners} listeners
          </span>
        </div>
      ))}
    </div>
  );
};

export default AudienceStats;
