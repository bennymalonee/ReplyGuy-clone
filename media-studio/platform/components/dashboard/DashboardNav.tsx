"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/jobs", label: "Jobs" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/workflows", label: "Workflows" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-16 items-center justify-between px-8">
      <Link href="/dashboard" className="text-lg font-bold text-[var(--color-charcoal)]">
        Ultimate Multimodal
      </Link>
      <div className="hidden items-center gap-6 md:flex">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium ${
              pathname === item.href
                ? "text-[var(--color-electric-cobalt)]"
                : "text-[var(--color-graphite)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className="dashboard-ghost-btn text-sm">
          Studio
        </Link>
        <Link href="/dashboard/settings" className="dashboard-pill-btn text-sm no-underline">
          Settings
        </Link>
      </div>
    </nav>
  );
}
