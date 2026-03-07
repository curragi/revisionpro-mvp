// app/page.tsx
// Dashboard (Home) — the main screen of RevisiónPro.
// Shows stats, urgent action items, and the Quick Add FAB.

import { StatsHeader } from "@/components/dashboard/StatsHeader";
import { UrgentList } from "@/components/dashboard/UrgentList";
import { FloatingActionButton } from "@/components/quick-add/FloatingActionButton";
import { MOCK_STATS, MOCK_URGENT_ITEMS } from "@/lib/mock-data";
import { Wrench } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="max-w-2xl mx-auto">
      {/* ── Page Header ─────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <Wrench
              size={20}
              style={{ color: "var(--accent-green)" }}
              aria-hidden="true"
            />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--accent-green)" }}
            >
              RevisiónPro
            </span>
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] leading-tight mt-1">
            Hoy,{" "}
            <span style={{ color: "var(--accent-yellow)" }}>
              {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" })}
            </span>
          </h1>
        </div>

        {/* Shop avatar / initials */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
          style={{ background: "var(--accent-green)", color: "#000" }}
          aria-label="Perfil del taller"
        >
          TM
        </div>
      </header>

      {/* ── Stats Cards ─────────────────────────────────── */}
      <StatsHeader
        appointmentsNext7Days={MOCK_STATS.appointmentsNext7Days}
        remindersToday={MOCK_STATS.remindersToday}
      />

      {/* ── Urgent Actions ───────────────────────────────── */}
      <section className="mt-4">
        <UrgentList items={MOCK_URGENT_ITEMS} />
      </section>

      {/* ── Floating Action Button ───────────────────────── */}
      <FloatingActionButton />
    </main>
  );
}
