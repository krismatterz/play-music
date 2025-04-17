"use client";

import React from "react";
import { upcomingEvents } from "./mockData";

const UpcomingEvents: React.FC = () => {
  return (
    <div className="rounded-xl bg-black/30 p-4 backdrop-blur-sm">
      <h2 className="mb-4 text-xl font-semibold text-white">Upcoming Events</h2>
      {upcomingEvents.map((event, index) => (
        <div
          key={`${event.city}-${event.date}`}
          className={`flex items-center gap-4 py-3 ${index < upcomingEvents.length - 1 ? "border-b border-white/10" : ""}`}
        >
          <div className="flex flex-col items-center rounded bg-white/10 px-2 py-1 text-center">
            <span className="text-xs font-bold text-amber-400 uppercase">
              {event.date.split(" ")[0]}
            </span>
            <span className="text-sm font-semibold text-white">
              {event.date.split(" ")[1]}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{event.city}</p>
            <p className="text-xs text-neutral-400">{event.venue}</p>
          </div>
        </div>
      ))}
      {/* Optional: Add a link to view all events */}
      <button className="mt-4 w-full rounded-lg bg-white/10 py-2 text-sm font-medium text-white transition hover:bg-white/20">
        View All Events
      </button>
    </div>
  );
};

export default UpcomingEvents;
