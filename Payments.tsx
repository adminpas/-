"use client";

import { useState } from "react";
import { copyText } from "@/lib/client";
import type { Act, Data } from "./types";

const DIR = { credit: "وارد", debit: "صادر", unknown: "غير محدد" } as const;
const ST = {
  matched: { t: "✅ تمت المطابقة", c: "" },
  unmatched: { t: "⏳ بانتظار طلب", c: "" },
  ignored: { t: "تم تجاهله", c: "opacity-60" },
} as const;

export default function Payments({ data, act }: { data: Data; act: Act }) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState("");
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}/api/payments/notify`;

  async function copy(k: string, v: string) {
    if (await copyText(v)) {
      setCopied(k);
      setTimeout(() => setCopied(""), 1500);
    }
  }

  return (
    <div className="space-y-4">
      <div className="glass space-y-3 p-4 text-sm leading-7">
        <b className="text-base">🔔 استقبال إشعارات المحافظ تلقائياً</b>
        <p className="opacity-90">
          ثبّت على هاتف مالك الشبكة (الذي تصله رسائل المحافظ) أي تطبيق يحوّل الرسائل إلى رابط (مثل «SMS Forwarder»)، واضبطه ليرسل كل رسالة
          إلى الرابط التالي. عند وصول رسالة «استلام مبلغ» يطابقها النظام مع طلب العميل (برقم العملية أو الهاتف والمبلغ) ويصرف الكرت فوراً.
        </p>
        <div>
          <div className="text-xs opacity-80">الرابط (POST)</div>
          <div className="flex items-center gap-2">
            <code dir="ltr" className="flex-1 overflow-x-auto rounded-xl bg-black/30 px-3 py-2 text-left text-xs">{url}</code>
            <button className="pill px-3 py-1 text-xs" onClick={() => copy("url", url)}>{copied === "url" ? "تم ✓" : "نسخ"}</button>
          </div>
        </div>
        <div>
          <div className="text-xs opacity-80">المفتاح السري (أرسله في ترويسة x-webhook-secret)</div>
          <div className="flex items-center gap-2">
            <code dir="ltr" className="flex-1 overflow-x-auto rounded-xl bg-black/30 px-3 py-2 text-left text-xs">{data.webhook.secret}</code>
            <button className="pill px-3 py-1 text-xs" onClick={() => copy("key", data.webhook.secret)}>{copied === "key" ? "تم ✓" : "نسخ"}</button>
            {!data.webhook.fromEnv && (
              <button
                className="pill px-3 py-1 text-xs"
                onClick={() => confirm("سيتوقف المفتاح القديم عن العمل. متابعة؟") && act({ action: "regenSecret" }, "تم توليد مفتاح جديد")}
              >
                تجديد
              </button>
            )}
          </div>
        </div>
        <div>
          <div className="text-xs opacity-80">صيغة الجسم (JSON)</div>
          <code dir="ltr" className="block rounded-xl bg-black/30 px-3 py-2 text-left text-xs">{`{"from":"%from%","text":"%text%"}`}</code>
        </div>
        <p className="text-xs opacity-80">
          رقم المحفظة الذي يحوّل إليه العملاء يجب أن يكون نفس الحساب الذي تصله رسائله. الرسائل الصادرة (سحب/تحويل منك) تُتجاهل تلقائياً.
        </p>
      </div>

      <div className="glass space-y-2 p-4">
        <b>لصق إشعار يدوياً</b>
        <p className="text-xs opacity-80">إن لم تستخدم تطبيق التحويل التلقائي، الصق نص رسالة المحفظة هنا ليتم التحقق والصرف.</p>
        <textarea
          className="input-pill !rounded-2xl !text-right text-sm"
          rows={3}
          placeholder="الصق رسالة استلام المبلغ هنا"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="btn-glow w-full py-2"
          disabled={!text.trim()}
          onClick={async () => {
            const ok = await act({ action: "addNotification", text }, (d) =>
              d.duplicate ? "هذا الإشعار مسجّل مسبقاً" : d.orderId ? `تمت المطابقة مع الطلب #${d.orderId}` : d.status === "ignored" ? "إشعار صادر — تم تجاهله" : "تم تسجيل الإشعار، بانتظار طلب مطابق",
            );
            if (ok) setText("");
          }}
        >
          تحقق وصرف
        </button>
      </div>

      <b className="block">آخر الإشعارات ({data.notifications.length})</b>
      {data.notifications.length === 0 && <p className="glass p-4 text-center text-sm">لم تصل إشعارات بعد</p>}
      {data.notifications.map((n) => (
        <div key={n.id} className={`glass space-y-1 p-3 text-sm ${ST[n.status].c}`}>
          <div className="flex items-center justify-between">
            <b>{n.amount ? `${n.amount} ريال` : "مبلغ غير معروف"} • {DIR[n.direction]}</b>
            <span className="pill px-2 py-0.5 text-xs">{ST[n.status].t}{n.orderId ? ` #${n.orderId}` : ""}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs opacity-90">
            <span>المحفظة: {n.walletName ?? "—"}</span>
            <span dir="ltr" className="text-right">المرجع: {n.ref ?? "—"}</span>
            <span dir="ltr" className="text-right">الهاتف: {n.phone ?? "—"}</span>
            <span>{new Date(n.createdAt).toLocaleString("ar")} • {n.source === "manual" ? "يدوي" : "تلقائي"}</span>
          </div>
          <p className="line-clamp-2 rounded-lg bg-black/20 px-2 py-1 text-xs opacity-80">{n.raw}</p>
          {n.status === "unmatched" && (
            <button className="text-xs underline" onClick={() => act({ action: "ignoreNotification", id: n.id }, "تم التجاهل")}>
              تجاهل
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
