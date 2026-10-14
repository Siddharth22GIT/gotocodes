import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "GotoCodes — Heaven for Devs",
  description: "Roadmaps, notes, and code from a CSE journey lived the hard way. DSA, MERN, AI, Projects — everything devs need in one place.",
  keywords: "coding, DSA, MERN, programming, developer resources, notes, roadmap",
  authors: [{ name: "GotoCodes" }],
  openGraph: {
    title: "GotoCodes — Heaven for Devs",
    description: "Roadmaps, notes, and code from a CSE journey lived the hard way.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
