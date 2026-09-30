"use client";

import { useState } from "react";
import { formatData, formatPackageDuration } from "@/lib/format";
import type { Act, APkg, Data } from "./types";

const EMPTY = { id: 0, name: "", description: "", price: "", durationMinutes: "", dataMb: "0", speedKbps: "2048", active: true };

export default function PackagesTab({ data, act }: { data: Data; act: Act }) {
  const [f, setF] = useState(EMPTY);
  const set = (k: keyof typeof EMPTY, v: string) => setF((s) => ({ ...s, [k]: v }));

  function edit(p: APkg) {
    setF({
      id: p.id,
      name: p.name,
      description: p.description,
      price: String(p.price),
      durationMinutes: String(p.durationMinutes),
      dataMb: String(p.dataMb),
      speedKbps: String(p.speedKbps),
      active: p.active,
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  return (
    <div className="space-y-3">
      {data.packages.map((p) => (
        <div key={p.id} className={`glass flex items-center justify-between gap-3 p-3 text-sm ${p.active ? "" : "opacity-50"}`}>
          <div>
            <b>{p.name}</b> — {p.price} ريال
            <div className="text-xs opacity-80">
              {formatPackageDuration(p.durationMinutes)} • {formatData(p.dataMb)} • {p.speedKbps}KB • متاح: {p.stock}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="pill px-3 py-1 text-xs" onClick={() => edit(p)}>
              تعديل
            </button>
            <button className="pill px-3 py-1 text-xs" onClick={() => act({ action: "togglePackage", id: p.id, active: !p.active }, "تم")}>
              {p.active ? "إخفاء" : "إظهار"}
            </button>
          </div>
        </div>
      ))}
      <div className="glass space-y-2 p-4">
        <b>{f.id ? "تعديل الباقة" : "إضافة باقة / ملف جديد"}</b>
        <input className="input-pill" placeholder="الاسم (مثال: باقة 100 ريال)" value={f.name} onChange={(e) => set("name", e.target.value)} />
        <input className="input-pill" placeholder="الوصف" value={f.description} onChange={(e) => set("description", e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <input className="input-pill" inputMode="numeric" placeholder="السعر (ريال)" value={f.price} onChange={(e) => set("price", e.target.value)} />
          <input className="input-pill" inputMode="numeric" placeholder="المدة بالدقائق" value={f.durationMinutes} onChange={(e) => set("durationMinutes", e.target.value)} />
          <input className="input-pill" inputMode="numeric" placeholder="البيانات MB (0 = مفتوح)" value={f.dataMb} onChange={(e) => set("dataMb", e.target.value)} />
          <input className="input-pill" inputMode="numeric" placeholder="السرعة KB" value={f.speedKbps} onChange={(e) => set("speedKbps", e.target.value)} />
        </div>
        <p className="text-xs opacity-80">يجب أن تطابق المدة والبيانات والسرعة إعدادات بروفايل الكرت في الميكروتك.</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="btn-glow py-2"
            onClick={async () => {
              if (await act({ action: "savePackage", ...f, id: f.id || undefined })) setF(EMPTY);
            }}
          >
            حفظ
          </button>
          {f.id ? (
            <button className="btn-glow py-2" onClick={() => setF(EMPTY)}>
              إلغاء التعديل
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
