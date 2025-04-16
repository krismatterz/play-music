"use client";

import { Button } from "@play/ui";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-6 text-5xl font-bold">Artist Dashboard</h1>

      <div className="mb-6 flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
          {user && (
            <p className="text-lg font-medium text-gray-200">
              Welcome,{" "}
              {user.firstName ??
                user.username ??
                user.emailAddresses[0]?.emailAddress ??
                "Artist"}
            </p>
          )}
        </div>
      </div>

      <p className="mb-8 text-xl text-gray-300">
        Manage your music, track performance, and connect with your audience
      </p>

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
