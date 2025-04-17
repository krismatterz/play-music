import "./globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import PlayerProviderWrapper from "../components/PlayerProviderWrapper";

export const metadata: Metadata = {
  title: "Play",
  description: "The Next Music Platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <PlayerProviderWrapper>{children}</PlayerProviderWrapper>
      </body>
    </html>
  );
}
