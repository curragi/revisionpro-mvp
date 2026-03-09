// app/page.tsx
// Dashboard (Home) — the main screen of RevisiónPro.
// Clean light-mode header, stats strip, and urgent actions list.

import { StatsHeader } from "@/components/dashboard/StatsHeader";
import { UrgentList } from "@/components/dashboard/UrgentList";
import { FloatingActionButton } from "@/components/quick-add/FloatingActionButton";
import { MOCK_STATS, MOCK_URGENT_ITEMS } from "@/lib/mock-data";

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Capitalise first letter
  const dateLabel = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <main className="max-w-2xl mx-auto">
      {/* ── Page Header ─────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 pt-7 pb-3">
        <div>
          {/* App brand — small, subtle */}
          <p className="text-xs font-semibold tracking-wide text-blue-600 mb-0.5">
            RevisiónPro
          </p>
          {/* Greeting */}
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            {dateLabel}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Buenos días, Taller ✌️</p>
        </div>

        {/* Shop avatar / initials */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-blue-600 text-white shadow-sm flex-shrink-0"
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
      <section className="mt-5">
        <UrgentList items={MOCK_URGENT_ITEMS} />
      </section>

      {/* ── Floating Action Button ───────────────────────── */}
      <FloatingActionButton />
    </main>
  );
}
