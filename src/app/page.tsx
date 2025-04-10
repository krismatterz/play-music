"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function HomePage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Play</h1>
        <p className="text-lg">The Next Music Platform</p>
      </div>
    </main>
  );
}
