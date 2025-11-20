import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const mollieGlaston = localFont({
  src: "./fonts/MollieGlaston.ttf",
  variable: "--font-mollie-glaston",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${mollieGlaston.variable}`}>{children}</body>
    </html>
  );
}
