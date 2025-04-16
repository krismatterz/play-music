"use client";

import { Button } from "@play/ui";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-6 text-5xl font-bold">Artist Dashboard</h1>
      <p className="mb-8 text-xl text-gray-300">
        Manage your music, track performance, and connect with your audience
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/dashboard" className="inline-block">
          <Button variant="primary" size="lg">
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/(auth)/sign-in" className="inline-block">
          <Button variant="outline" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
