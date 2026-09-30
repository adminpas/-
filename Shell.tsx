"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Logo from "@/components/Logo";

const TILES = [
  { top: "8%", left: "8%", bg: "#ec4899", d: "0s" },
  { top: "18%", left: "78%", bg: "#ef4444", d: "1.5s" },
  { top: "42%", left: "60%", bg: "#3b82f6", d: "3s" },
  { top: "60%", left: "6%", bg: "#22c55e", d: "2s" },
  { top: "72%", left: "80%", bg: "#f59e0b", d: "4s" },
  { top: "88%", left: "40%", bg: "#06b6d4", d: "1s" },
];

function Icon({ name }: { name: string }) {
  const c = { width: 26, height: 26, fill: "none", stroke: "#fff", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "login":
      return (
        <svg viewBox="0 0 24 24" {...c}>
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
        </svg>
      );
    case "buy":
      return (
        <svg viewBox="0 0 24 24" {...c}>
          <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8ZM7.5 7.5h.01" />
        </svg>
      );
    case "orders":
      return (
        <svg viewBox="0 0 24 24" {...c}>
          <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...c}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      );
  }
}

const NAV = [
  { href: "/status", label: "حالة الكرت", icon: "info" },
  { href: "/", label: "الدخول", icon: "login" },
  { href: "/buy", label: "شراء باقة", icon: "buy" },
  { href: "/order", label: "طلباتي", icon: "orders" },
];

export default function Shell({ title, children }: { title?: string; children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md px-4 pb-32 pt-5">
      {TILES.map((t, i) => (
        <span key={i} className="float-tile" style={{ top: t.top, left: t.left, background: t.bg, animationDelay: t.d }} />
      ))}
      <div className="relative z-10">
        <header className="mb-4 text-center">
          <Logo width={250} />
          <h1 className="mt-2 text-xl font-extrabold">{title ?? "بوابة الإنترنت الذكية"}</h1>
          <div className="mx-auto mt-3 h-px w-11/12 bg-white/70" />
        </header>
        {children}
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#1a0338] via-[#1a0338]/95 to-transparent pb-4 pt-6">
        <div className="mx-auto flex max-w-md items-start justify-around px-4">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-3 ${active ? "nav-active" : ""}`}>
                <div className="nav-diamond">
                  <Icon name={n.icon} />
                </div>
                <span className="text-xs font-bold">{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
