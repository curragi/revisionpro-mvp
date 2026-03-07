// app/clientes/page.tsx
// Clientes list page — placeholder for Phase 2.

import { Users, Construction } from "lucide-react";

export default function ClientesPage() {
    return (
        <main className="max-w-2xl mx-auto px-4 pt-6">
            <header className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <Users size={20} style={{ color: "var(--accent-green)" }} aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent-green)" }}>
                        RevisiónPro
                    </span>
                </div>
                <h1 className="text-2xl font-black text-[var(--text-primary)]">Clientes</h1>
                <p className="text-sm text-[var(--text-muted)] mt-1">Gestión de clientes y vehículos</p>
            </header>

            {/* Coming soon placeholder */}
            <div className="card flex flex-col items-center justify-center gap-4 py-16 text-center">
                <Construction size={48} style={{ color: "var(--accent-yellow)" }} />
                <div>
                    <p className="font-black text-lg text-[var(--text-primary)]">En construcción</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        La gestión de clientes estará disponible en la próxima versión.
                    </p>
                </div>
            </div>
        </main>
    );
}
