/** شعار هلا سوفت — SVG بخلفية شفافة ومتحرك */
export default function Logo({ className = "", width = 240 }: { className?: string; width?: number }) {
  return (
    <div className={`logo-wrap ${className}`} style={{ width }} aria-label="شعار هلا سوفت" role="img">
      <svg viewBox="0 0 330 180" width="100%" xmlns="http://www.w3.org/2000/svg" style={{ direction: "ltr", overflow: "visible" }}>
        <defs>
          {/* تدرج لامع يتحرك عبر الشعار */}
          <linearGradient id="lg-main" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="330" y2="0">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#e9d5ff" />
            <stop offset="0.75" stopColor="#c084fc" />
            <stop offset="1" stopColor="#ffffff" />
            <animateTransform attributeName="gradientTransform" type="translate" values="-330 0; 330 0; -330 0" dur="6s" repeatCount="indefinite" />
          </linearGradient>
          <linearGradient id="lg-ball" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a855f7" />
            <stop offset="1" stopColor="#4c1d95" />
          </linearGradient>
          <radialGradient id="lg-shine" cx="0.35" cy="0.3" r="0.6">
            <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* هلا */}
        <text x="150" y="118" textAnchor="middle" fontSize="104" fontWeight="800" fontFamily="Tajawal, 'Segoe UI', Tahoma, sans-serif" fill="url(#lg-main)" stroke="#2a0556" strokeWidth="1.5" paintOrder="stroke">
          هلا
        </text>

        {/* سوفت */}
        <text x="14" y="112" fontSize="21" fontWeight="800" fontFamily="Tajawal, 'Segoe UI', Tahoma, sans-serif" fill="#e9d5ff">
          سوفت
        </text>

        {/* SOFT */}
        <text x="8" y="162" fontSize="50" fontStyle="italic" fontWeight="700" fontFamily="Georgia, 'Times New Roman', serif" fill="url(#lg-main)" stroke="#2a0556" strokeWidth="1.2" paintOrder="stroke">
          S<tspan fontSize="36">OFT</tspan>
        </text>

        {/* الكرة H */}
        <g className="logo-ball">
          <circle cx="215" cy="96" r="27" fill="url(#lg-ball)" stroke="#fff" strokeWidth="3" />
          <circle cx="215" cy="96" r="27" fill="url(#lg-shine)" />
          <text x="215" y="108" textAnchor="middle" fontSize="34" fontStyle="italic" fontWeight="800" fontFamily="Georgia, serif" fill="#fff">
            H
          </text>
          <circle className="logo-ring" cx="215" cy="96" r="34" fill="none" stroke="#e9d5ff" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round" />
        </g>

        {/* الشخص */}
        <g className="logo-person" fill="#fff" stroke="#2a0556" strokeWidth="1">
          <circle cx="268" cy="108" r="7" />
          <path d="M268 117 L268 146 M258 124 L268 130 L278 120 M268 146 L260 166 M268 146 L277 166" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* موجات الإشارة */}
        {[20, 32, 44].map((r, i) => (
          <path
            key={r}
            className="logo-arc"
            style={{ animationDelay: `${i * 0.35}s` }}
            d={`M268 ${100 - r} A ${r} ${r} 0 0 1 ${268 + r} 100`}
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            transform="translate(0 -8)"
          />
        ))}
      </svg>
    </div>
  );
}
