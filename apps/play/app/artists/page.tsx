"use client";

import ArtistLayout from "./layout";

export default function ArtistsPage() {
  return (
    <ArtistLayout>
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="text-4xl font-bold">Artists</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Manage your Artist Profile</h2>
            <p className="text-sm text-neutral-400">
              Add your artist profile information and manage your profile.
            </p>
          </div>
        </div>
      </div>
    </ArtistLayout>
  );
}
