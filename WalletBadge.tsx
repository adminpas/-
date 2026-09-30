"use client";

import { useState } from "react";
import { copyText, type Wallet } from "@/lib/client";

export function WalletIcon({ w, size = 48 }: { w: Wallet; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full border-2 border-white/90 font-extrabold text-white shadow-[0_0_10px_rgba(255,255,255,0.4)]"
      style={{ width: size, height: size, background: w.color, fontSize: size * 0.34 }}
    >
      {w.logo}
    </span>
  );
}

/** بطاقة محفظة: أيقونة + اسم + رقم النقطة/الحساب مع نسخ بلمسة */
export default function WalletBadge({
  w,
  selected,
  onSelect,
}: {
  w: Wallet;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      onClick={onSelect}
      className={`glass flex cursor-pointer items-center gap-3 p-3 ${selected ? "!border-[#c4b5fd] shadow-[0_0_22px_rgba(255,255,255,0.8)]" : ""}`}
    >
      <WalletIcon w={w} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold">{w.name}</div>
        <div dir="ltr" className="truncate text-right text-base font-extrabold tracking-wider">
          {w.number}
        </div>
      </div>
      <button
        type="button"
        onClick={async (e) => {
          e.stopPropagation();
          if (await copyText(w.number)) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }
        }}
        className="rounded-xl border border-white/70 px-2 py-1 text-xs"
      >
        {copied ? "تم ✓" : "نسخ"}
      </button>
    </div>
  );
}
