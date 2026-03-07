// components/quick-add/FloatingActionButton.tsx
// The FAB that triggers the Quick Add modal.
// Fixed position above the bottom nav, highly visible neon green.

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { QuickAddModal } from "./QuickAddModal";

export function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* FAB Button */}
            <button
                className="fab"
                onClick={() => setIsOpen(true)}
                aria-label="Añadir nueva revisión"
                aria-expanded={isOpen}
                aria-controls="quick-add-modal"
            >
                <Plus strokeWidth={3} size={28} />
            </button>

            {/* Quick Add Modal */}
            <QuickAddModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
