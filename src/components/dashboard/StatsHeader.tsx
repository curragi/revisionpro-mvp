// components/dashboard/StatsHeader.tsx
// Quick stats strip for dashboard. Clean light-mode cards.

import { CalendarClock, SendHorizonal } from "lucide-react";

interface StatsHeaderProps {
    appointmentsNext7Days: number;
    remindersToday: number;
}

export function StatsHeader({ appointmentsNext7Days, remindersToday }: StatsHeaderProps) {
    return (
        <div className="grid grid-cols-2 gap-3 px-4 pt-3">
            {/* Próximas revisiones */}
            <div className="card flex flex-col gap-1.5 animate-fade-in">
                <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <CalendarClock size={15} className="text-amber-600" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 truncate">
                        Próx. 7 días
                    </span>
                </div>
                <span
                    className="text-3xl font-bold text-slate-900 leading-none"
                    aria-label={`${appointmentsNext7Days} revisiones próximas`}
                >
                    {appointmentsNext7Days}
                </span>
                <span className="text-xs text-slate-400">revisiones pendientes</span>
            </div>

            {/* Recordatorios enviados hoy */}
            <div className="card flex flex-col gap-1.5 animate-fade-in" style={{ animationDelay: "60ms" }}>
                <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <SendHorizonal size={15} className="text-blue-600" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 truncate">
                        Enviados hoy
                    </span>
                </div>
                <span
                    className="text-3xl font-bold text-slate-900 leading-none"
                    aria-label={`${remindersToday} recordatorios enviados hoy`}
                >
                    {remindersToday}
                </span>
                <span className="text-xs text-slate-400">recordatorios WhatsApp</span>
            </div>
        </div>
    );
}
