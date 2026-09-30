"use client";

import { useState } from "react";
import type { Act, Data } from "./types";

export default function WalletsTab({ data, act }: { data: Data; act: Act }) {
  const empty = { name: "", number: "", holder: "", color: "#7c3aed", logo: "" };
  const [f, setF] = useState(empty);
  const [edits, setEdits] = useState<Record<number, string>>({});
  return (
    <div className="space-y-3">
      <p className="glass p-3 text-xs leading-6">
        هذه الأرقام تظهر للعملاء للتحويل إليها. تأكد أنها حسابات تصلك إشعاراتها على الهاتف المربوط بالتحقق التلقائي.
      </p>
      {data.wallets.map((w) => (
        <div key={w.id} className={`glass space-y-2 p-3 text-sm ${w.active ? "" : "opacity-50"}`}>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-white font-bold" style={{ background: w.color }}>
              {w.logo}
            </span>
            <b className="flex-1">{w.name}</b>
            <button className="pill px-3 py-1 text-xs" onClick={() => act({ action: "toggleWallet", id: w.id, active: !w.active }, "تم")}>
              {w.active ? "إخفاء" : "إظهار"}
            </button>
          </div>
          <div className="flex gap-2">
            <input
              className="input-pill !py-1.5"
              dir="ltr"
              value={edits[w.id] ?? w.number}
              onChange={(e) => setEdits((s) => ({ ...s, [w.id]: e.target.value }))}
            />
            <button className="btn-glow px-4 text-xs" onClick={() => act({ action: "saveWallet", ...w, number: edits[w.id] ?? w.number })}>
              حفظ الرقم
            </button>
          </div>
        </div>
      ))}
      <div className="glass space-y-2 p-4">
        <b>إضافة محفظة</b>
        <input className="input-pill" placeholder="اسم المحفظة" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className="input-pill" dir="ltr" placeholder="رقم المحفظة / النقطة" value={f.number} onChange={(e) => setF({ ...f, number: e.target.value })} />
        <input className="input-pill" placeholder="اسم المستلم" value={f.holder} onChange={(e) => setF({ ...f, holder: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <input className="input-pill" placeholder="رمز قصير للأيقونة" value={f.logo} onChange={(e) => setF({ ...f, logo: e.target.value })} />
          <input type="color" className="h-11 w-full rounded-full bg-transparent" value={f.color} onChange={(e) => setF({ ...f, color: e.target.value })} />
        </div>
        <button
          className="btn-glow w-full py-2"
          onClick={async () => {
            if (await act({ action: "saveWallet", ...f })) setF(empty);
          }}
        >
          حفظ المحفظة
        </button>
      </div>
    </div>
  );
}
