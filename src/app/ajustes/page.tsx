// app/ajustes/page.tsx
// Ajustes (settings) page — placeholder for Phase 2.

import { Settings, Construction, ChevronRight } from "lucide-react";

const SETTING_ITEMS = [
    { label: "Datos del taller", icon: "🏪", desc: "Nombre, teléfono, dirección" },
    { label: "Plantilla de WhatsApp", icon: "💬", desc: "Personaliza el mensaje de aviso" },
    { label: "Días de aviso anticipado", icon: "⏰", desc: "Cuándo enviar el recordatorio" },
    { label: "Suscripción", icon: "⭐", desc: "Plan actual y facturación" },
];

export default function AjustesPage() {
    return (
        <main className="max-w-2xl mx-auto px-4 pt-6">
            <header className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <Settings size={20} style={{ color: "var(--accent-green)" }} aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent-green)" }}>
                        RevisiónPro
                    </span>
                </div>
                <h1 className="text-2xl font-black text-[var(--text-primary)]">Ajustes</h1>
                <p className="text-sm text-[var(--text-muted)] mt-1">Configuración de tu taller</p>
            </header>

            {/* Settings preview list */}
            <div className="space-y-2">
                {SETTING_ITEMS.map((item) => (
                    <button
                        key={item.label}
                        className="card w-full flex items-center gap-4 text-left hover:border-[var(--accent-green)] transition-colors"
                        aria-label={item.label}
                        disabled
                    >
                        <span className="text-2xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[var(--text-primary)] text-sm">{item.label}</p>
                            <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                        </div>
                        <ChevronRight size={18} style={{ color: "var(--text-muted)" }} />
                    </button>
                ))}
            </div>

            <div className="mt-6 card text-center py-8 opacity-60">
                <Construction size={36} className="mx-auto mb-3" style={{ color: "var(--accent-yellow)" }} />
                <p className="text-sm text-[var(--text-muted)]">Ajustes disponibles en próxima versión</p>
            </div>
        </main>
    );
}
