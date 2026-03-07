// components/dashboard/UrgentList.tsx
// List of urgent maintenance action items for the dashboard.

"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { UrgentActionCard } from "./UrgentActionCard";
import type { MaintenanceItem } from "@/lib/utils";

interface UrgentListProps {
    items: MaintenanceItem[];
}

export function UrgentList({ items }: UrgentListProps) {
    const [list, setList] = useState<MaintenanceItem[]>(items);

    function handleNotified(id: string) {
        setList((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: "notified" } : item))
        );
    }

    if (list.length === 0) {
        return (
            <div className="mx-4 card flex flex-col items-center gap-3 py-10 text-center">
                <span className="text-4xl">✅</span>
                <p className="font-bold text-[var(--text-primary)]">¡Al día!</p>
                <p className="text-sm text-[var(--text-muted)]">No hay revisiones urgentes este mes.</p>
            </div>
        );
    }

    return (
        <section aria-label="Acciones urgentes">
            {/* Section header */}
            <div className="flex items-center gap-2 px-4 py-3">
                <AlertTriangle size={16} className="text-[var(--accent-yellow)]" aria-hidden="true" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Acciones urgentes
                </h2>
                <span
                    className="badge badge-pending ml-auto text-xs"
                    aria-label={`${list.length} pendientes`}
                >
                    {list.length}
                </span>
            </div>

            {/* List */}
            <div role="list" className="px-4 space-y-3 pb-4">
                {list.map((item, i) => (
                    <div
                        key={item.id}
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <UrgentActionCard item={item} onNotified={handleNotified} />
                    </div>
                ))}
            </div>
        </section>
    );
}
