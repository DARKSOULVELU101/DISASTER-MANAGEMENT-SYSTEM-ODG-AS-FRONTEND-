import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Console · GENVOUCH India Disaster Intelligence",
  description:
    "Interactive India disaster analytics console by GENVOUCH TECHNOLOGIES PVT — charts, filters, risk scores, and an AI copilot over open government data.",
};

export default function DashboardPage() {
  return <DashboardShell />;
}
