"use client";

import { Button } from "@play/ui";
import { UserButton } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-6 text-5xl font-bold">Settings</h1>
      <div className="mb-6 flex items-center justify-center gap-4">
        <UserButton />
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="primary" size="lg">
          Edit Profile
        </Button>
        <Button variant="outline" size="lg">
          Change Password
        </Button>
        <Button variant="outline" size="lg">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
