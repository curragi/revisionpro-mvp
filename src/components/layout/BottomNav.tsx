// components/layout/BottomNav.tsx
// Mobile-first bottom navigation bar with touch-friendly targets.
// Routes: Dashboard (/) | Clientes (/clientes) | Ajustes (/ajustes)

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
    { href: "/", label: "Inicio", icon: LayoutDashboard },
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/ajustes", label: "Ajustes", icon: Settings },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav" role="navigation" aria-label="Navegación principal">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn("bottom-nav__item", isActive && "active")}
                        aria-current={isActive ? "page" : undefined}
                    >
                        <Icon
                            size={24}
                            strokeWidth={isActive ? 2.5 : 1.8}
                            aria-hidden="true"
                        />
                        <span>{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
