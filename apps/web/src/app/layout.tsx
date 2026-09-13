import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HagSpot",
  description: "Find a place to study at Hagfors Center.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
