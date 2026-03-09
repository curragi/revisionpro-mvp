// app/layout.tsx
// Root layout: light theme, Inter font, bottom navigation.

import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "RevisiónPro — Taller Mecánico",
  description: "CRM y recordatorios WhatsApp para talleres mecánicos independientes",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default" },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
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
