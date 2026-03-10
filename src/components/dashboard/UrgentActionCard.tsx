// components/dashboard/UrgentActionCard.tsx
// Single item in the "Acciones Urgentes" list.
// Clean white card with a colored left-border for urgency signalling.

"use client";

import { useState } from "react";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import {
    cn,
    formatDateShort,
    getUrgencyLabel,
    daysUntilDue,
    SERVICE_LABELS,
    SERVICE_ICONS,
    type MaintenanceItem,
} from "@/lib/utils";
import { MOCK_SHOP_NAME as SHOP_NAME } from "@/lib/mock-data";

interface UrgentActionCardProps {
    item: MaintenanceItem;
    onNotified?: (id: string) => void;
}

export function UrgentActionCard({ item, onNotified }: UrgentActionCardProps) {

    const [sent, setSent] = useState(item.status === "notified");

    const days = daysUntilDue(item.nextDueDate);
    const isOverdue = days < 0;
    const isUrgent = days >= 0 && days <= 7;

    // Left accent border colour
    const borderAccent = isOverdue
        ? "border-l-red-500"
        : isUrgent
            ? "border-l-amber-400"
            : "border-l-slate-200";

    // Status text colour
    const urgencyColor = isOverdue
        ? "text-red-600"
        : isUrgent
            ? "text-amber-600"
            : "text-slate-400";

    // Service badge colour
    const serviceBadge = isOverdue
        ? "bg-red-50 text-red-700 border border-red-200"
        : isUrgent
            ? "bg-amber-50 text-amber-700 border border-amber-200"
            : "bg-slate-100 text-slate-600 border border-slate-200";

    function handleWhatsApp() {
        if (sent) return;

        const formattedPhone = item.customerPhone.replace(/\s+/g, "");
        const serviceLabel = SERVICE_LABELS[item.serviceType] ?? item.serviceType;
        const text =
            `Hola ${item.customerName}, somos de ${SHOP_NAME}. ` +
            `Vemos que a tu vehículo ${item.vehiclePlate} le toca ${serviceLabel}. ` +
            `¿Te buscamos un hueco esta semana?`;

        window.open(
            `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`,
            "_blank"
        );

        setSent(true);
        onNotified?.(item.id);
    }

    return (
        <article
            className={cn(
                "card border-l-4 flex gap-3 items-center animate-fade-in",
                borderAccent
            )}
            role="listitem"
            aria-label={`Revisión de ${item.customerName}, ${item.vehiclePlate}`}
        >
            {/* Service icon */}
            <div
                className="text-xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100"
                aria-hidden="true"
            >
                {SERVICE_ICONS[item.serviceType]}
            </div>

            {/* Info block */}
            <div className="flex-1 min-w-0">
                {/* Plate + Model */}
                <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-bold text-sm tracking-widest text-slate-900">
                        {item.vehiclePlate}
                    </span>
                    <span className="text-xs text-slate-400 truncate">{item.brandModel}</span>
                </div>

                {/* Customer */}
                <p className="text-sm text-slate-600 truncate leading-tight">{item.customerName}</p>

                {/* Service type + due date */}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                        className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
                            serviceBadge
                        )}
                    >
                        {SERVICE_LABELS[item.serviceType]}
                    </span>
                    <span className={cn("text-xs font-semibold", urgencyColor)}>
                        {getUrgencyLabel(item.nextDueDate)}
                    </span>
                </div>
            </div>

            {/* WhatsApp action */}
            <div className="flex-shrink-0 self-center">
                {sent ? (
                    <span
                        className="flex items-center gap-1 text-xs font-semibold text-emerald-600"
                        aria-label="Aviso enviado"
                    >
                        <CheckCircle2 size={18} />
                        <span className="hidden sm:inline">Enviado</span>
                    </span>
                ) : (
                    <button
                        onClick={handleWhatsApp}
                        className="btn-whatsapp"
                        aria-label={`Avisar por WhatsApp a ${item.customerName}`}
                    >
                        <MessageCircle size={16} />
                        <span className="hidden sm:inline">Avisar</span>
                    </button>
                )}
            </div>
        </article>
    );
}
