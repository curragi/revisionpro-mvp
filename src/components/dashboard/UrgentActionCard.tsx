// components/dashboard/UrgentActionCard.tsx
// Single item card in the "Acciones Urgentes" list.
// Shows vehicle info, service type, urgency, and WhatsApp mock button.

"use client";

import { useState } from "react";
import { MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
    cn,
    formatDateShort,
    getUrgencyLabel,
    daysUntilDue,
    sendWhatsAppReminder,
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
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(item.status === "notified");

    const days = daysUntilDue(item.nextDueDate);
    const isOverdue = days < 0;
    const isUrgent = days >= 0 && days <= 7;

    // Border color based on urgency
    const borderStyle = isOverdue
        ? "border-l-[var(--accent-red)]"
        : isUrgent
            ? "border-l-[var(--accent-yellow)]"
            : "border-l-[var(--bg-border)]";

    async function handleWhatsApp() {
        if (sending || sent) return;
        setSending(true);
        try {
            await sendWhatsAppReminder({
                customerName: item.customerName,
                customerPhone: item.customerPhone,
                vehiclePlate: item.vehiclePlate,
                serviceType: item.serviceType,
                nextDueDate: formatDateShort(item.nextDueDate),
                shopName: SHOP_NAME,
            });
            setSent(true);
            onNotified?.(item.id);
        } catch (err) {
            console.error("[RevisiónPro] Error sending WhatsApp:", err);
        } finally {
            setSending(false);
        }
    }

    return (
        <article
            className={cn(
                "card border-l-4 flex gap-3 items-start animate-fade-in",
                borderStyle
            )}
            role="listitem"
            aria-label={`Revisión de ${item.customerName}, ${item.vehiclePlate}`}
        >
            {/* Service icon */}
            <div
                className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
                style={{ background: "var(--bg-raised)" }}
                aria-hidden="true"
            >
                {SERVICE_ICONS[item.serviceType]}
            </div>

            {/* Info block */}
            <div className="flex-1 min-w-0 space-y-1">
                {/* Plate + Model */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-base tracking-widest text-[var(--text-primary)]">
                        {item.vehiclePlate}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] truncate">{item.brandModel}</span>
                </div>

                {/* Customer */}
                <p className="text-sm text-[var(--text-secondary)] truncate">{item.customerName}</p>

                {/* Service type + due urgency */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge badge-pending text-[0.7rem]">
                        {SERVICE_LABELS[item.serviceType]}
                    </span>
                    <span
                        className={cn(
                            "text-xs font-bold",
                            isOverdue ? "glow-red" : isUrgent ? "glow-yellow" : "text-[var(--text-muted)]"
                        )}
                    >
                        {getUrgencyLabel(item.nextDueDate)}
                    </span>
                </div>
            </div>

            {/* WhatsApp action */}
            <div className="flex-shrink-0 self-center">
                {sent ? (
                    <span
                        className="flex items-center gap-1 text-xs font-semibold"
                        style={{ color: "var(--accent-green)" }}
                        aria-label="Aviso enviado"
                    >
                        <CheckCircle2 size={18} />
                        <span className="hidden sm:inline">Enviado</span>
                    </span>
                ) : (
                    <button
                        onClick={handleWhatsApp}
                        disabled={sending}
                        className="btn-whatsapp"
                        aria-label={`Avisar por WhatsApp a ${item.customerName}`}
                    >
                        {sending ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <MessageCircle size={16} />
                        )}
                        <span className="hidden sm:inline">Avisar</span>
                    </button>
                )}
            </div>
        </article>
    );
}
