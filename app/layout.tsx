import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { PreferencesProvider } from "@/app/context/preferences-context";
import { DEFAULT_USER_ID } from "@/lib/config";
import { validateUserId } from "@/lib/user-id";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoMeals",
  description: "Find Recipe in 1 Click",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieUserId = cookieStore.get("userId")?.value ?? DEFAULT_USER_ID;
  const validated = validateUserId(cookieUserId);
  const activeUserId = validated.ok ? validated.sanitized : DEFAULT_USER_ID;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Analytics />
        <SpeedInsights />
        <PreferencesProvider userId={activeUserId}>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
