"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      {/* Blurred background shapes */}
      <div className="absolute -top-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 opacity-30 blur-3xl filter"></div>
      <div className="absolute -bottom-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-tl from-amber-700 to-orange-800 opacity-20 blur-3xl filter"></div>

      {/* SignIn component centered - removed the wrapping div */}
      <div className="z-10">
        {" "}
        {/* Added z-index to ensure SignIn is above blurred shapes */}
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-gradient-to-r from-[#F2622D] to-[#F2A62D] hover:opacity-90",
              card: "bg-transparent shadow-none", // Explicitly make card transparent
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400", // Adjusted for black bg
              formFieldLabel: "text-white",
              formFieldInput:
                "bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-[#F2A62D] focus:ring-[#F2A62D]", // Adjusted for black bg
              footerActionLink: "text-[#F2A62D] hover:text-[#F2622D]", // Back to orange link
              socialButtonsBlockButton:
                "border border-gray-600 bg-gray-800/50 text-white hover:bg-gray-700/50", // Adjusted for black bg
              dividerLine: "bg-gray-700", // Adjusted for black bg
              dividerText: "text-gray-400", // Adjusted for black bg
            },
          }}
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
