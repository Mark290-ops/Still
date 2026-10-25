import type { Metadata, Viewport } from "next";
import SiteExperience from "@/components/SiteExperience";
import "./globals.css";

export const metadata: Metadata = {
  title: "STILL — A pocket camera for the moment",
  description:
    "A product concept for a more deliberate way to make photographs and stay present with the moments around you.",
  applicationName: "STILL camera concept",
  openGraph: {
    title: "STILL — Keep the moment",
    description: "A pocket camera concept about noticing first and sharing later.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><SiteExperience>{children}</SiteExperience></body>
    </html>
  );
}
