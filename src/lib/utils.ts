// lib/utils.ts
// Shared utility helpers for RevisiónPro

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, addMonths, addYears, differenceInDays, isAfter, isThisMonth } from "date-fns";
import { es } from "date-fns/locale";

// ─── CSS Class Merging ────────────────────────────────────────────────────────

/**
 * Merges Tailwind CSS class names safely, resolving conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

/**
 * Formats a date for display in Spanish locale.
 * @example formatDateES(new Date()) → "7 de marzo de 2026"
 */
export function formatDateES(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d 'de' MMMM 'de' yyyy", { locale: es });
}

/**
 * Formats a date in compact form for lists/cards.
 * @example formatDateShort(new Date()) → "07/03/2026"
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd/MM/yyyy");
}

/**
 * Calculates the suggested "next due date" for a service type.
 */
export function calculateNextDueDate(
  datePerformed: Date,
  serviceType: ServiceType
): Date {
  switch (serviceType) {
    case "OilChange":
      return addMonths(datePerformed, 6); // Every 6 months or 10,000km
    case "ITV":
      return addYears(datePerformed, 2);  // Every 2 years (standard Spain)
    case "TimingBelt":
      return addYears(datePerformed, 4);  // Every 4 years or 60,000km
    case "General":
    default:
      return addYears(datePerformed, 1);  // Annual general service
  }
}

/**
 * Returns how many days until a due date (negative = overdue).
 */
export function daysUntilDue(nextDueDate: Date | string): number {
  const d = typeof nextDueDate === "string" ? new Date(nextDueDate) : nextDueDate;
  return differenceInDays(d, new Date());
}

/**
 * Returns the urgency color class for a maintenance record.
 * Green (ok) / Yellow (due soon) / Red (overdue or this month)
 */
export function getUrgencyClass(nextDueDate: Date | string): string {
  const days = daysUntilDue(nextDueDate);
  if (days < 0) return "text-red-500 border-red-500";           // Vencido
  if (days <= 30) return "text-yellow-400 border-yellow-400";   // Este mes / urgente
  return "text-neon-green border-neon-green";                    // OK
}

/**
 * Returns a human-readable urgency label in Spanish.
 */
export function getUrgencyLabel(nextDueDate: Date | string): string {
  const days = daysUntilDue(nextDueDate);
  if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
  if (days === 0) return "Vence HOY";
  if (days === 1) return "Vence mañana";
  if (days <= 7) return `Vence en ${days} días`;
  if (days <= 30) return "Este mes";
  return formatDateShort(nextDueDate);
}

/**
 * Checks if a due date falls within the next N days.
 */
export function isDueWithinDays(nextDueDate: Date | string, days: number): boolean {
  const d = daysUntilDue(nextDueDate);
  return d >= 0 && d <= days;
}

// ─── WhatsApp Mock ────────────────────────────────────────────────────────────

/**
 * Mock function that will eventually call the WhatsApp Business API.
 * For now, logs the payload and resolves immediately.
 */
export async function sendWhatsAppReminder(payload: WhatsAppReminderPayload): Promise<void> {
  console.log("[RevisiónPro] 📲 WhatsApp Reminder — Mock Dispatch:", payload);
  // TODO: Replace with actual WhatsApp Business API / Twilio call:
  // await fetch("/api/whatsapp/send", { method: "POST", body: JSON.stringify(payload) });
  await new Promise((res) => setTimeout(res, 800)); // Simulate network latency
}

// ─── Service Label Helpers ────────────────────────────────────────────────────

export type ServiceType = "ITV" | "OilChange" | "TimingBelt" | "General";
export type MaintenanceStatus = "pending" | "notified" | "completed";

export const SERVICE_LABELS: Record<ServiceType, string> = {
  ITV: "ITV",
  OilChange: "Cambio de Aceite",
  TimingBelt: "Correa de Distribución",
  General: "Revisión General",
};

export const SERVICE_ICONS: Record<ServiceType, string> = {
  ITV: "🚗",
  OilChange: "🛢️",
  TimingBelt: "⚙️",
  General: "🔧",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WhatsAppReminderPayload {
  customerName: string;
  customerPhone: string;
  vehiclePlate: string;
  serviceType: ServiceType;
  nextDueDate: string;
  shopName: string;
}

export interface MaintenanceItem {
  id: string;
  vehiclePlate: string;
  brandModel: string;
  customerName: string;
  customerPhone: string;
  serviceType: ServiceType;
  nextDueDate: string;
  status: MaintenanceStatus;
}
