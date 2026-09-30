"use client";

import { useRef, useState } from "react";
import { formatData, formatPackageDuration } from "@/lib/format";
import { api, type Act, type Data } from "./types";

type CardRow = { code: string; batch: string | null };

export default function Warehouse({ data, act }: { data: Data; act: Act }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [list, setList] = useState<{ id: number; status: "available" | "sold"; cards: CardRow[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const files = [...data.packages].sort((a, b) => a.price - b.price);
  const waiting = data.orders.filter((o) => o.status === "waiting_stock").length;
  const totalAvail = files.reduce((s, p) => s + p.stock, 0);

  function pickFile(f: File | undefined) {
    if (!f) return;
    setFileName(f.name);
    const r = new FileReader();
    r.onload = () => setText(String(r.result ?? ""));
    r.readAsText(f);
  }

  async function upload(packageId: number) {
    setBusy(true);
    const ok = await act(
      { action: "uploadCards", packageId, text },
      (d) =>
        `تم رفع ${d.added} كرت` +
        (Number(d.duplicates) ? ` — مكرر/موجود مسبقاً: ${d.duplicates}` : "") +
        (Number(d.invalid) ? ` — أسطر غير صالحة: ${d.invalid}` : "") +
        (Number(d.released) ? ` — وتم صرف ${d.released} طلب كان بالانتظار ✅` : ""),
    );
    setBusy(false);
    if (ok) {
      setText("");
      setFileName("");
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function show(id: number, status: "available" | "sold") {
    const { ok, d } = await api({ action: "listCards", packageId: id, status });
    if (ok) setList({ id, status, cards: d.cards as CardRow[] });
  }

  return (
    <div className="space-y-4">
      <div className="glass p-4 text-sm leading-7">
        <b className="text-base">📦 المستودع</b>
        <p className="mt-1 opacity-90">
          اطبع الكروت من User Manager أو نظام الهوسبوت، ثم ارفع ملف الأرقام (txt أو csv — سطر لكل كرت، ويمكن إضافة كلمة المرور بعد الرقم)
          داخل ملف الباقة المناسب. عند وصول تحويل العميل يصرف النظام أول كرت متاح من ملف باقته تلقائياً.
        </p>
        <p className="mt-1 font-bold">إجمالي الكروت المتاحة: {totalAvail}</p>
      </div>

      {waiting > 0 && (
        <p className="glass !border-amber-300 px-3 py-2 text-sm font-bold">
          ⚠️ يوجد {waiting} طلب مدفوع بانتظار كروت — ارفع كروت للملف المطلوب وسيُصرف تلقائياً.
        </p>
      )}

      {files.map((p) => {
        const low = p.stock === 0 ? "out" : p.stock < 10 ? "low" : "ok";
        const open = openId === p.id;
        return (
          <div key={p.id} className={`glass p-4 ${p.active ? "" : "opacity-60"}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-base font-extrabold">📁 ملف {p.name}</div>
                <div className="mt-0.5 text-xs opacity-80">
                  {formatPackageDuration(p.durationMinutes)} • {formatData(p.dataMb)} • {p.speedKbps}KB
                </div>
              </div>
              <span
                className={`pill px-3 py-1 text-xs font-bold ${
                  low === "out" ? "!border-red-400 text-red-300" : low === "low" ? "!border-amber-300 text-amber-200" : ""
                }`}
              >
                {low === "out" ? "فارغ" : low === "low" ? "قارب على النفاد" : "متوفر"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              <button onClick={() => show(p.id, "available")} className="rounded-xl border border-white/40 py-2">
                <div className="text-xl font-extrabold">{p.stock}</div>
                <div className="text-xs">متاح</div>
              </button>
              <button onClick={() => show(p.id, "sold")} className="rounded-xl border border-white/40 py-2">
                <div className="text-xl font-extrabold">{p.sold}</div>
                <div className="text-xs">مباع</div>
              </button>
              <div className="rounded-xl border border-white/40 py-2">
                <div className="text-xl font-extrabold">{p.total}</div>
                <div className="text-xs">الإجمالي</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                className="btn-glow py-2 text-sm"
                onClick={() => {
                  setOpenId(open ? null : p.id);
                  setText("");
                  setFileName("");
                }}
              >
                ⬆ رفع كروت
              </button>
              <button
                className="btn-glow py-2 text-sm"
                disabled={p.stock === 0}
                onClick={async () => {
                  if (confirm(`حذف ${p.stock} كرت متاح من ملف ${p.name}؟ (الكروت المباعة لا تُحذف)`)) {
                    await act({ action: "deleteAvailable", packageId: p.id }, "تم حذف الكروت المتاحة");
                    setList(null);
                  }
                }}
              >
                🗑 تفريغ المتاح
              </button>
            </div>

            {open && (
              <div className="mt-3 space-y-2 rounded-2xl border border-white/30 p-3">
                <label className="block cursor-pointer rounded-xl border border-dashed border-white/60 px-3 py-3 text-center text-sm">
                  {fileName ? `📄 ${fileName}` : "اختر ملف الكروت (txt / csv)"}
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".txt,.csv,.tsv,text/plain,text/csv"
                    className="hidden"
                    onChange={(e) => pickFile(e.target.files?.[0])}
                  />
                </label>
                <textarea
                  className="input-pill !rounded-2xl !text-left text-sm"
                  dir="ltr"
                  rows={5}
                  placeholder={"أو الصق الكروت هنا:\n1234567890\n2345678901,pass1\n..."}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button className="btn-glow w-full py-2" disabled={busy || !text.trim()} onClick={() => upload(p.id)}>
                  {busy ? "جارٍ الرفع..." : `رفع إلى ملف ${p.name}`}
                </button>
              </div>
            )}

            {list && list.id === p.id && (
              <div className="mt-3 rounded-2xl border border-white/30 p-3">
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span>{list.status === "available" ? "الكروت المتاحة" : "الكروت المباعة"} ({list.cards.length}{list.cards.length === 300 ? "+" : ""})</span>
                  <button className="text-xs underline" onClick={() => setList(null)}>
                    إغلاق
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto text-left text-sm" dir="ltr">
                  {list.cards.length === 0 && <p className="text-center opacity-70">لا توجد كروت</p>}
                  {list.cards.map((c) => (
                    <div key={c.code} className="flex justify-between border-b border-white/10 py-1">
                      <span className="font-mono">{c.code}</span>
                      <span className="opacity-60">{c.batch}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
