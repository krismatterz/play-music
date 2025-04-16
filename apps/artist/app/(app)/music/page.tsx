"use client";

import { Button } from "@play/ui";

export default function MusicPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-6 text-5xl font-bold">My Music</h1>
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="primary" size="lg">
          Upload Music
        </Button>
        <Button variant="outline" size="lg">
          View Analytics
        </Button>
      </div>
    </div>
  );
}
