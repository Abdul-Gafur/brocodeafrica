import type { Metadata } from "next";
import { Geist, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brocode Africa",
  description:
    "A dedicated digital sanctuary for the modern African youth — SRHR resources, mental wellness support, and financial literacy training in one safe, anonymous space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0e0e0e] text-[#e5e2e1] font-manrope">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
