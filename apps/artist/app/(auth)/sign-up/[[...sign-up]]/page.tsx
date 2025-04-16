"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-[#F2622D] to-[#F2A62D]">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-black/80 p-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col items-center">
          <Link href="/" className="text-4xl font-bold text-white">
            Play
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Sign Up
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Create your artist account
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-[#F2622D] to-[#F2A62D] hover:opacity-90",
                card: "bg-transparent shadow-none",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-300",
                formFieldLabel: "text-white",
                formFieldInput:
                  "bg-black/40 border border-gray-700 text-white placeholder-gray-400 focus:border-[#F2A62D] focus:ring-[#F2A62D]",
                footerActionLink: "text-[#F2A62D] hover:text-[#F2622D]",
                socialButtonsBlockButton:
                  "border border-gray-600 bg-black/30 text-white hover:bg-black/50",
                dividerLine: "bg-gray-600",
                dividerText: "text-gray-300 bg-black/80",
              },
            }}
            redirectUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}
