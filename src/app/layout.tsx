import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SyncDay — Plan your day. Sync to Google Calendar.",
  description:
    "A premium, professional calendar dashboard that exports and synchronizes your events directly into a dedicated Google Calendar with one click.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.className} bg-[#09090b] text-[#fafafa] min-h-screen antialiased selection:bg-brand-500/30 selection:text-brand-200`}
      >
        <div className="relative min-h-screen flex flex-col">
          {/* Subtle top-right gradient glow */}
          <div className="absolute top-0 right-0 -z-50 w-[500px] h-[500px] bg-brand-600/10 blur-[120px] rounded-full pointer-events-none" />
          {/* Subtle bottom-left gradient glow */}
          <div className="absolute bottom-0 left-0 -z-50 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
          {children}
        </div>
      </body>
    </html>
  );
}
