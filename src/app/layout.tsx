// app/layout.tsx
// Root layout: dark theme, Inter font, bottom navigation, FAB portal.

import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "RevisiónPro — Taller Mecánico",
  description: "CRM y recordatorios WhatsApp para talleres mecánicos independientes",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#0d0f11",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,   // Prevent accidental zoom on input focus
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body>
        <div className="page-content">
          {children}
        </div>
        {/* Bottom navigation — always visible */}
        <BottomNav />
      </body>
    </html>
  );
}
