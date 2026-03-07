// components/quick-add/QuickAddModal.tsx
// Multi-step modal for adding a new maintenance record ("Nueva Revisión").
// Step 1: Matrícula + Teléfono
// Step 2: Select Service Type (big visual tiles)
// Step 3: Confirm next reminder date

"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronRight, ChevronLeft, Calendar, Check, Loader2 } from "lucide-react";
import { cn, calculateNextDueDate, formatDateShort, SERVICE_LABELS, SERVICE_ICONS, type ServiceType } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
    licensePlate: string;
    phone: string;
    serviceType: ServiceType | null;
    datePerformed: string;        // ISO date string
    nextDueDate: string;          // ISO date string (auto-calculated, editable)
}

interface QuickAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: FormData) => Promise<void>;
}

const TOTAL_STEPS = 3;
const SERVICE_TYPES: ServiceType[] = ["OilChange", "ITV", "TimingBelt", "General"];

const TODAY_ISO = new Date().toISOString().split("T")[0];

const INITIAL_FORM: FormData = {
    licensePlate: "",
    phone: "",
    serviceType: null,
    datePerformed: TODAY_ISO,
    nextDueDate: "",
};

// ─── Service Tile Component ───────────────────────────────────────────────────

function ServiceTile({
    type,
    selected,
    onSelect,
}: {
    type: ServiceType;
    selected: boolean;
    onSelect: (type: ServiceType) => void;
}) {
    return (
        <button
            type="button"
            className={cn("service-tile", selected && "selected")}
            onClick={() => onSelect(type)}
            aria-pressed={selected}
            aria-label={SERVICE_LABELS[type]}
        >
            <span className="service-tile__icon" aria-hidden="true">
                {SERVICE_ICONS[type]}
            </span>
            <span className="service-tile__label">{SERVICE_LABELS[type]}</span>
        </button>
    );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center justify-center gap-2 py-2" aria-label={`Paso ${current} de ${total}`}>
            {Array.from({ length: total }, (_, i) => (
                <div
                    key={i}
                    className={cn("step-dot", i + 1 === current && "active", i + 1 < current && "done")}
                />
            ))}
        </div>
    );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function QuickAddModal({ isOpen, onClose, onSave }: QuickAddModalProps) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<FormData>(INITIAL_FORM);
    const [saving, setSaving] = useState(false);
    const [savedOk, setSavedOk] = useState(false);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setForm(INITIAL_FORM);
            setSaving(false);
            setSavedOk(false);
            // Focus first input after animation
            setTimeout(() => firstInputRef.current?.focus(), 350);
        }
    }, [isOpen]);

    // Auto-calculate next due date when service type or performed date changes
    useEffect(() => {
        if (form.serviceType && form.datePerformed) {
            const performed = new Date(form.datePerformed);
            const nextDue = calculateNextDueDate(performed, form.serviceType);
            setForm((prev) => ({ ...prev, nextDueDate: nextDue.toISOString().split("T")[0] }));
        }
    }, [form.serviceType, form.datePerformed]);

    // Keyboard: close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // ── Step validation ──────────────────────────────────────────────────────────

    const step1Valid = form.licensePlate.trim().length >= 6 && form.phone.trim().length >= 9;
    const step2Valid = form.serviceType !== null;
    const step3Valid = Boolean(form.nextDueDate);

    const canAdvance = step === 1 ? step1Valid : step === 2 ? step2Valid : step3Valid;

    // ── Event handlers ───────────────────────────────────────────────────────────

    function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleNext() {
        if (step < TOTAL_STEPS && canAdvance) setStep((s) => s + 1);
    }

    function handleBack() {
        if (step > 1) setStep((s) => s - 1);
    }

    async function handleSave() {
        if (!canAdvance || saving) return;
        setSaving(true);
        try {
            if (onSave) {
                await onSave(form);
            } else {
                // Mock save — log and simulate latency
                console.log("[RevisiónPro] 💾 Nueva Revisión guardada (mock):", form);
                await new Promise((res) => setTimeout(res, 1000));
            }
            setSavedOk(true);
            setTimeout(() => onClose(), 1200);
        } catch (err) {
            console.error("[RevisiónPro] Error saving record:", err);
        } finally {
            setSaving(false);
        }
    }

    // ── Render ───────────────────────────────────────────────────────────────────

    return (
        <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Nueva revisión"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-sheet">
                {/* ─ Header ─────────────────────────────────────────── */}
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h2 className="text-lg font-black text-[var(--text-primary)]">Nueva Revisión</h2>
                        <p className="text-xs text-[var(--text-muted)]">Paso {step} de {TOTAL_STEPS}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-ghost !min-h-[40px] !px-3 !rounded-full"
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <StepIndicator current={step} total={TOTAL_STEPS} />

                {/* ─ Steps ──────────────────────────────────────────── */}
                <div className="mt-4 space-y-5 min-h-[240px]">

                    {/* STEP 1: Matrícula + Teléfono */}
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label className="label">🚗 Matrícula del vehículo</label>
                                <input
                                    ref={firstInputRef}
                                    type="text"
                                    className="input uppercase"
                                    placeholder="Ej: 1234 ABC"
                                    value={form.licensePlate}
                                    onChange={(e) => updateField("licensePlate", e.target.value.toUpperCase())}
                                    maxLength={10}
                                    autoComplete="off"
                                    aria-label="Matrícula"
                                />
                            </div>
                            <div>
                                <label className="label">📞 Teléfono del cliente (WhatsApp)</label>
                                <input
                                    type="tel"
                                    className="input"
                                    placeholder="+34 600 000 000"
                                    value={form.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    autoComplete="tel"
                                    aria-label="Teléfono"
                                />
                            </div>
                            <div>
                                <label className="label">📅 Fecha de realización</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={form.datePerformed}
                                    onChange={(e) => updateField("datePerformed", e.target.value)}
                                    max={TODAY_ISO}
                                    aria-label="Fecha de realización"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Select Service */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <p className="label mb-4">🔧 ¿Qué servicio se realizó?</p>
                            <div className="grid grid-cols-2 gap-3">
                                {SERVICE_TYPES.map((type) => (
                                    <ServiceTile
                                        key={type}
                                        type={type}
                                        selected={form.serviceType === type}
                                        onSelect={(t) => updateField("serviceType", t)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Confirm next due date */}
                    {step === 3 && (
                        <div className="space-y-4 animate-fade-in">
                            {/* Summary card */}
                            <div className="card" style={{ borderColor: "var(--accent-green-dim)" }}>
                                <p className="text-xs text-[var(--text-muted)] mb-2">Resumen del registro</p>
                                <div className="space-y-1">
                                    <InfoRow label="Matrícula" value={form.licensePlate} />
                                    <InfoRow label="Teléfono" value={form.phone} />
                                    <InfoRow label="Servicio" value={form.serviceType ? SERVICE_LABELS[form.serviceType] : "—"} />
                                    <InfoRow label="Realizado" value={formatDateShort(form.datePerformed)} />
                                </div>
                            </div>

                            {/* Next due date (editable) */}
                            <div>
                                <label className="label flex items-center gap-2">
                                    <Calendar size={14} />
                                    Próximo aviso calculado
                                </label>
                                <input
                                    type="date"
                                    className="input"
                                    value={form.nextDueDate}
                                    onChange={(e) => updateField("nextDueDate", e.target.value)}
                                    min={TODAY_ISO}
                                    aria-label="Fecha del próximo aviso"
                                />
                                {form.serviceType && (
                                    <p className="text-xs text-[var(--text-muted)] mt-1">
                                        💡 Calculado automáticamente según el tipo de servicio. Puedes ajustarlo.
                                    </p>
                                )}
                            </div>

                            {/* Saved success splash */}
                            {savedOk && (
                                <div className="flex items-center justify-center gap-2 py-4 glow-green animate-fade-in">
                                    <Check size={24} strokeWidth={3} />
                                    <span className="font-bold text-lg">¡Guardado!</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ─ Footer navigation ──────────────────────────────── */}
                <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: "1px solid var(--bg-border)" }}>
                    {step > 1 && (
                        <button onClick={handleBack} className="btn-ghost flex-1">
                            <ChevronLeft size={18} />
                            Atrás
                        </button>
                    )}

                    {step < TOTAL_STEPS ? (
                        <button
                            onClick={handleNext}
                            disabled={!canAdvance}
                            className={cn(
                                "btn-primary flex-1 transition-opacity",
                                !canAdvance && "opacity-40 cursor-not-allowed"
                            )}
                            aria-disabled={!canAdvance}
                        >
                            Siguiente
                            <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={!canAdvance || saving || savedOk}
                            className={cn(
                                "btn-primary flex-1",
                                (!canAdvance || saving || savedOk) && "opacity-60 cursor-not-allowed"
                            )}
                            aria-disabled={!canAdvance || saving}
                        >
                            {saving ? (
                                <><Loader2 size={18} className="animate-spin" /> Guardando...</>
                            ) : savedOk ? (
                                <><Check size={18} /> ¡Guardado!</>
                            ) : (
                                <><Check size={18} /> Guardar Revisión</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Small helper ──────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">{label}</span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">{value}</span>
        </div>
    );
}
