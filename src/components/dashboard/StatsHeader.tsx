// components/dashboard/StatsHeader.tsx
// Quick stats strip for the dashboard top bar.
// Shows: upcoming appointments (7 days) and reminders sent today.

import { CalendarClock, SendHorizonal } from "lucide-react";

interface StatsHeaderProps {
    appointmentsNext7Days: number;
    remindersToday: number;
}

export function StatsHeader({ appointmentsNext7Days, remindersToday }: StatsHeaderProps) {
    return (
        <div className="grid grid-cols-2 gap-3 px-4 pt-4">
            {/* Citas próximas */}
            <div className="card flex flex-col gap-2 animate-fade-in">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <CalendarClock size={16} strokeWidth={2} aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                        Próximos 7 días
                    </span>
                </div>
                <span
                    className="text-4xl font-black glow-yellow leading-none"
                    aria-label={`${appointmentsNext7Days} citas próximas`}
                >
                    {appointmentsNext7Days}
                </span>
                <span className="text-xs text-[var(--text-muted)]">revisiones pendientes</span>
            </div>

            {/* Recordatorios enviados hoy */}
            <div className="card flex flex-col gap-2 animate-fade-in" style={{ animationDelay: "60ms" }}>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <SendHorizonal size={16} strokeWidth={2} aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                        Enviados hoy
                    </span>
                </div>
                <span
                    className="text-4xl font-black glow-green leading-none"
                    aria-label={`${remindersToday} recordatorios enviados hoy`}
                >
                    {remindersToday}
                </span>
                <span className="text-xs text-[var(--text-muted)]">recordatorios WhatsApp</span>
            </div>
        </div>
    );
}
