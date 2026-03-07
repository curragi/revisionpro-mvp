// lib/mock-data.ts
// Mock data for RevisiónPro dashboard development.
// Replace with real Supabase queries when the backend is connected.

import { MaintenanceItem } from "./utils";

export const MOCK_SHOP_NAME = "Taller Mecánico López";

/**
 * Mock maintenance items that appear on the dashboard as urgent actions.
 * Due dates are set relative to today for realistic demo.
 */
export const MOCK_URGENT_ITEMS: MaintenanceItem[] = [
    {
        id: "1",
        vehiclePlate: "4821 KBF",
        brandModel: "Toyota Corolla 2018",
        customerName: "Paco Martínez",
        customerPhone: "+34612345678",
        serviceType: "ITV",
        nextDueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Overdue 5 days
        status: "pending",
    },
    {
        id: "2",
        vehiclePlate: "7732 LMP",
        brandModel: "Seat León 2020",
        customerName: "Lucía Fernández",
        customerPhone: "+34698765432",
        serviceType: "OilChange",
        nextDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Due in 3 days
        status: "pending",
    },
    {
        id: "3",
        vehiclePlate: "1190 GHJ",
        brandModel: "Ford Focus 2017",
        customerName: "Manolo García",
        customerPhone: "+34677112233",
        serviceType: "TimingBelt",
        nextDueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Due in 10 days
        status: "pending",
    },
    {
        id: "4",
        vehiclePlate: "5523 RBT",
        brandModel: "Renault Megane 2019",
        customerName: "Ana Ruíz",
        customerPhone: "+34655443322",
        serviceType: "OilChange",
        nextDueDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Due in 22 days
        status: "notified",
    },
    {
        id: "5",
        vehiclePlate: "8841 ZXC",
        brandModel: "Volkswagen Golf 2021",
        customerName: "Carlos Pérez",
        customerPhone: "+34633987654",
        serviceType: "ITV",
        nextDueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Tomorrow!
        status: "pending",
    },
];

/**
 * Mock stats for the dashboard header cards.
 */
export const MOCK_STATS = {
    appointmentsNext7Days: 8,
    remindersToday: 3,
};
