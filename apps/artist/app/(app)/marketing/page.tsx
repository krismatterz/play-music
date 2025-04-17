"use client";

import { Button } from "../../../components/ui/button";

export default function MarketingPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-6 text-5xl font-bold">Marketing</h1>
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="default" size="lg">
          Promote Your Music
        </Button>
        <Button variant="outline" size="lg">
          Create a Playlist
        </Button>
        <Button variant="outline" size="lg">
          Create a Landing Page
        </Button>
        <Button variant="outline" size="lg">
          Manage Your Audience
        </Button>
      </div>
    </div>
  );
}
