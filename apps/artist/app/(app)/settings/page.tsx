"use client";

import { Button } from "../../../components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

export default function SettingsPage() {
  const backgroundStyle = {
    backgroundImage: `radial-gradient(ellipse at top, hsl(220 10% 15%) 0%, hsl(220 10% 5%) 70%)`,
  };

  const mockSettings = {
    name: "Eladio Carrión",
    email: "eladio@example.com",
    username: "eladiocarrion",
    bio: "Latin trap & hip hop artist from Puerto Rico.",
    plan: "Pro",
  };

  return (
    <div className="min-h-screen text-white" style={backgroundStyle}>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Settings</h1>
          <UserButton />
        </div>

        <div className="mb-12 overflow-hidden rounded-lg border border-white/10 bg-black/40 p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold">Account Info</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-white/70">Name</p>
              <p className="text-lg">{mockSettings.name}</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Email</p>
              <p className="text-lg">{mockSettings.email}</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Username</p>
              <p className="text-lg">{mockSettings.username}</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Plan</p>
              <p className="text-lg">{mockSettings.plan}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40 p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold">Profile Settings</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-white/70">
                  Name
                </label>
                <Input
                  id="name"
                  className="text-black/70"
                  defaultValue={mockSettings.name}
                />
                <p className="text-muted-foreground text-sm">
                  Your full name as it appears on your profile.
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-white/70">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  className="text-black/70"
                  defaultValue={mockSettings.email}
                />
                <p className="text-muted-foreground text-sm">
                  We will never share your email.
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm text-white/70">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  className="text-black/70"
                  defaultValue={mockSettings.bio}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="plan" className="text-sm text-white/70">
                  Plan
                </label>
                <Select defaultValue={mockSettings.plan}>
                  <SelectTrigger id="plan" className="text-black/70">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
