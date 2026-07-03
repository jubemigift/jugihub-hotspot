import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JugiHub Internet",
  description: "Premium hotspot internet portal and ISP administration."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
