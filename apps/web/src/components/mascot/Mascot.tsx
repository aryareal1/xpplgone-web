export default function XiRplMascot({
  className = '',
  size = 340,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={(size * 1180) / 1320}
      viewBox="0 0 1320 1180"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Maskot robot XI RPL"
    >
      <defs>
        <linearGradient id="bodyBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3FA9F5" />
          <stop offset="55%" stopColor="#1E88E5" />
          <stop offset="100%" stopColor="#106BC4" />
        </linearGradient>
        <linearGradient id="bodySide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0E5DAE" />
          <stop offset="100%" stopColor="#0A4990" />
        </linearGradient>
        <linearGradient id="topBar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5CBBFA" />
          <stop offset="100%" stopColor="#2E9BF0" />
        </linearGradient>
        <linearGradient id="yellowBall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE59A" />
          <stop offset="45%" stopColor="#FFC93C" />
          <stop offset="100%" stopColor="#F5A400" />
        </linearGradient>
        <linearGradient id="yellowPill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD966" />
          <stop offset="100%" stopColor="#F7A800" />
        </linearGradient>
        <linearGradient id="bubbleYellow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE083" />
          <stop offset="100%" stopColor="#F8AC0E" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#132A44" />
          <stop offset="100%" stopColor="#081522" />
        </linearGradient>
        <linearGradient id="footGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123B66" />
          <stop offset="100%" stopColor="#081D38" />
        </linearGradient>
        <linearGradient id="laptopGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3C4A6B" />
          <stop offset="100%" stopColor="#232E48" />
        </linearGradient>
        <linearGradient id="laptopBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#28324E" />
          <stop offset="100%" stopColor="#181F33" />
        </linearGradient>
        <radialGradient id="handShade" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D9E6F2" />
        </radialGradient>
      </defs>

      {/* ================= ANTENNA ================= */}
      <g>
        <path d="M472 300 q10 -95 55 -150" fill="none" stroke="#0A2540" strokeWidth="20" strokeLinecap="round" />
        <path d="M478 296 q8 -85 50 -136" fill="none" stroke="#1E88E5" strokeWidth="9" strokeLinecap="round" opacity="0.55" />
        <circle cx="537" cy="128" r="52" fill="url(#yellowBall)" stroke="#0A2540" strokeWidth="14" />
        <ellipse cx="519" cy="108" rx="15" ry="11" fill="#FFF6D8" opacity="0.85" />
      </g>

      {/* ================= BODY (side / depth slab first) ================= */}
      <rect x="440" y="345" width="605" height="620" rx="70" fill="url(#bodySide)" />
      <rect x="990" y="345" width="55" height="620" rx="26" fill="#083868" opacity="0.5" />

      {/* ================= BODY (front face) ================= */}
      <rect x="400" y="330" width="605" height="600" rx="70"
        fill="url(#bodyBlue)" stroke="#0A2540" strokeWidth="16" />
      {/* right edge highlight strip like the reference's cyan sliver */}
      <rect x="955" y="345" width="14" height="565" rx="6" fill="#7FD4FF" opacity="0.55" />

      {/* subtle top sheen */}
      <path d="M420 350 q280 -40 565 0 q10 60 -6 110 q-280 -34 -560 0 q-14 -55 1 -110 Z"
        fill="#FFFFFF" opacity="0.08" />

      {/* ================= TOP LOGO ROW ================= */}
      <g transform="translate(455,405)">
        <ellipse cx="55" cy="45" rx="80" ry="30" fill="none" stroke="#FFC93C" strokeWidth="9" transform="rotate(-20 55 45)" />
        <circle cx="52" cy="45" r="36" fill="#0A2540" />
        <circle cx="52" cy="45" r="36" fill="none" stroke="#0F3F6E" strokeWidth="4" />
        <text x="52" y="46" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700" fontSize="24" fill="#FFC93C">&lt;/&gt;</text>
      </g>

      <text x="660" y="470" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontStyle="italic" fontSize="74" fill="#FFFFFF" letterSpacing="1">XI</text>
      <text x="770" y="470" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontStyle="italic" fontSize="74" fill="#FFC93C" letterSpacing="1">RPL</text>
      <text x="953" y="460" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontStyle="italic" fontSize="46" fill="#FFC93C" opacity="0.9">{'//'}</text>

      <rect x="450" y="500" width="700" height="7" rx="3.5" fill="#8FD0FF" opacity="0.55" />

      {/* ================= SCREEN ================= */}
      <rect x="450" y="545" width="600" height="330" rx="34"
        fill="#BEE3FF" opacity="0.5" />
      <rect x="462" y="557" width="576" height="306" rx="28"
        fill="url(#screenGrad)" stroke="#08182A" strokeWidth="8" />

      {/* code lines left column */}
      <rect x="497" y="600" width="6" height="34" rx="3" fill="#3DBE6C" />
      <rect x="497" y="642" width="6" height="34" rx="3" fill="#F5A623" />
      <rect x="497" y="684" width="6" height="34" rx="3" fill="#3DA6F5" />
      <rect x="497" y="726" width="6" height="34" rx="3" fill="#3DBE6C" />
      {[600, 622, 644, 666, 688, 710, 732, 754].map((y, i) => (
        <rect key={y} x="520" y={y + 4} width={[96, 130, 70, 150, 90, 120, 60, 105][i]} height="9" rx="4.5" fill="#3E5C7A" opacity="0.85" />
      ))}

      {/* face: >_ winking smile */}
      <g>
        <path d="M712 690 l38 32 l-38 32" fill="none" stroke="#FFC93C"
          strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="808" y="694" width="22" height="62" rx="9" fill="#FFC93C" />
        <line x1="748" y1="758" x2="800" y2="758" stroke="#FFC93C" strokeWidth="16" strokeLinecap="round" />
        <path d="M862 738 q28 34 60 0" fill="none" stroke="#FFC93C"
          strokeWidth="14" strokeLinecap="round" />
      </g>

      {/* screen glare stripes */}
      <path d="M905 575 l55 0 l-95 150 l-55 0 Z" fill="#FFFFFF" opacity="0.05" />
      <path d="M975 575 l35 0 l-95 150 l-35 0 Z" fill="#FFFFFF" opacity="0.05" />

      {/* ================= BOTTOM BAR: RPL badge + status dots ================= */}
      <g>
        <rect x="462" y="910" width="230" height="86" rx="43"
          fill="url(#yellowPill)" stroke="#0A2540" strokeWidth="11" />
      </g>
      <text x="577" y="968" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900" fontStyle="italic" fontSize="40" fill="#0A2540">&gt;&gt; RPL</text>

      <circle cx="812" cy="953" r="19" fill="#4CD671" stroke="#0A2540" strokeWidth="5" />
      <circle cx="812" cy="948" r="7" fill="#B6FFC9" opacity="0.7" />
      <circle cx="872" cy="953" r="19" fill="#FFC93C" stroke="#0A2540" strokeWidth="5" />
      <circle cx="872" cy="948" r="7" fill="#FFEFAF" opacity="0.7" />
      <circle cx="932" cy="953" r="19" fill="#FF7043" stroke="#0A2540" strokeWidth="5" />
      <circle cx="932" cy="948" r="7" fill="#FFC4AC" opacity="0.7" />

      {/* ================= FEET ================= */}
      <g>
        <rect x="505" y="1020" width="150" height="34" rx="17" fill="#0D3E70" />
        <rect x="505" y="1044" width="150" height="86" rx="43" fill="url(#footGrad)" stroke="#061428" strokeWidth="8" />
        <rect x="820" y="1020" width="150" height="34" rx="17" fill="#0D3E70" />
        <rect x="820" y="1044" width="150" height="86" rx="43" fill="url(#footGrad)" stroke="#061428" strokeWidth="8" />
      </g>

      {/* ================= SPEECH BUBBLE (top right) ================= */}
      <g>
        <path d="M1035 250 h225 a42 42 0 0 1 42 42 v95 a42 42 0 0 1 -42 42 h-118 l-52 55 v-55 h-55 a42 42 0 0 1 -42 -42 v-95 a42 42 0 0 1 42 -42 Z"
          fill="url(#bubbleYellow)" stroke="#0A2540" strokeWidth="14" strokeLinejoin="round" />
        <ellipse cx="1090" cy="278" rx="26" ry="12" fill="#FFF3C0" opacity="0.65" transform="rotate(-18 1090 278)" />
        <text x="1147" y="345" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700" fontSize="52" fill="#0A2540">&lt;/&gt;</text>
      </g>

      {/* ================= THUMBS-UP HAND (left) ================= */}
      <g>
        {/* sparkles */}
        <path d="M175 660 l30 62 l-62 -20 Z" fill="#FFC93C" transform="rotate(18 175 660)" />
        <path d="M150 745 l22 46 l-46 -16 Z" fill="#FFC93C" transform="rotate(12 150 745)" />

        {/* forearm */}
        <rect x="330" y="815" width="120" height="150" rx="40" fill="url(#bodyBlue)" stroke="#0A2540" strokeWidth="14" />

        {/* fist */}
        <ellipse cx="300" cy="855" rx="95" ry="88" fill="url(#handShade)" stroke="#0A2540" strokeWidth="14" />
        {/* knuckle creases */}
        <path d="M250 830 q40 30 0 65" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
        <path d="M285 815 q35 40 -5 85" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />

        {/* thumb */}
        <path d="M255 815 q-45 -10 -48 -68 q-2 -46 34 -50 q34 -3 40 34 l10 70 Z"
          fill="url(#handShade)" stroke="#0A2540" strokeWidth="14" strokeLinejoin="round" />
        <ellipse cx="223" cy="742" rx="9" ry="20" fill="#FFFFFF" opacity="0.7" />
      </g>

      {/* ================= LAPTOP HAND (right) ================= */}
      <g>
        {/* cuff / wrist */}
        <ellipse cx="1090" cy="960" rx="72" ry="55" fill="url(#handShade)" stroke="#0A2540" strokeWidth="13" />
        <path d="M1045 930 q10 -35 55 -20" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />

        {/* laptop base (angled) */}
        <g transform="translate(950,760) rotate(-16)">
          {/* screen back panel */}
          <path d="M0 0 h250 l-14 165 h-250 Z" fill="url(#laptopGrad)" stroke="#0A2540" strokeWidth="14" strokeLinejoin="round" />
          {/* screen inner bezel */}
          <path d="M22 20 h206 l-10 125 h-206 Z" fill="#111A2E" opacity="0.55" />
          {/* hinge highlight */}
          <rect x="95" y="10" width="55" height="12" rx="6" fill="#FFC93C" />
          <text x="122" y="88" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700" fontSize="42" fill="#FFFFFF">&lt;/&gt;</text>
          {/* base keyboard sliver for depth */}
          <path d="M-14 165 h278 l-18 34 h-250 Z" fill="url(#laptopBase)" stroke="#0A2540" strokeWidth="10" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}
