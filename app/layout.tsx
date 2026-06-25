import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "16-0 IPL Draft",
  description: "A neon cricket drafting game built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
