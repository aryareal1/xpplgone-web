'use client';

import { type ReactElement, useId } from 'react';

export type MascotPose =
  | 'happy'
  | 'sleep'
  | 'search'
  | 'cozy'
  | 'cheer'
  | 'cold'
  | 'angry';

/** Props the mascot can hold; drives the left hand only. */
export type MascotTool =
  | 'broom'
  | 'mop'
  | 'bucket'
  | 'duster'
  | 'dustpan'
  | 'medal'
  | 'trophy';

const TOOL_STROKE = '#0A2540';

/**
 * Each tool is drawn around the hand's grip point (0,0), handle running up and
 * the working end below, so the same left-hand branch fits all of them.
 */
const TOOLS: Record<MascotTool, ReactElement> = {
  broom: (
    <g transform="rotate(10)">
      <rect x="-13" y="-185" width="26" height="390" rx="13" fill="#C98A4B" stroke={TOOL_STROKE} strokeWidth="12" />
      <rect x="-46" y="196" width="92" height="40" rx="14" fill="#FFC93C" stroke={TOOL_STROKE} strokeWidth="12" />
      <path d="M-42 232 h84 l16 92 h-116 Z" fill="#E8C77E" stroke={TOOL_STROKE} strokeWidth="12" strokeLinejoin="round" />
      {[-26, -8, 10, 28].map((x) => (
        <line key={x} x1={x} y1="240" x2={x + 5} y2="316" stroke={TOOL_STROKE} strokeWidth="7" strokeLinecap="round" opacity="0.5" />
      ))}
    </g>
  ),
  mop: (
    <g transform="rotate(12)">
      <rect x="-13" y="-185" width="26" height="382" rx="13" fill="#9AA7B8" stroke={TOOL_STROKE} strokeWidth="12" />
      <rect x="-40" y="190" width="80" height="34" rx="12" fill="#4FB3F0" stroke={TOOL_STROKE} strokeWidth="12" />
      {/* shaggy strands instead of a solid block, so it reads as a mop */}
      <path d="M-52 220 q14 66 -4 104 q22 -30 26 -96 q10 70 4 104 q20 -34 20 -104 q12 66 6 100 q22 -28 24 -100 q14 62 2 98 q24 -30 22 -98 Z"
        fill="#D8DEE7" stroke={TOOL_STROKE} strokeWidth="11" strokeLinejoin="round" />
    </g>
  ),
  bucket: (
    <g transform="translate(0,54)">
      <path d="M-60 40 a60 34 0 0 1 120 0" fill="none" stroke={TOOL_STROKE} strokeWidth="12" strokeLinecap="round" />
      <path d="M-64 42 h128 l-20 138 h-88 Z" fill="#4FB3F0" stroke={TOOL_STROKE} strokeWidth="13" strokeLinejoin="round" />
      <path d="M-56 58 h112 l-5 34 h-102 Z" fill="#BFE6FF" opacity="0.75" />
    </g>
  ),
  duster: (
    <g transform="rotate(-14)">
      <rect x="-12" y="-40" width="24" height="196" rx="12" fill="#C98A4B" stroke={TOOL_STROKE} strokeWidth="12" />
      {/* feather fan above the grip */}
      <path d="M0 -46 q-86 -22 -104 -104 q64 6 104 62 q40 -56 104 -62 q-18 82 -104 104 Z"
        fill="#FF8FB1" stroke={TOOL_STROKE} strokeWidth="12" strokeLinejoin="round" />
      <path d="M0 -46 v-92" stroke={TOOL_STROKE} strokeWidth="9" strokeLinecap="round" opacity="0.55" />
    </g>
  ),
  dustpan: (
    <g transform="rotate(16)">
      <rect x="-13" y="-150" width="26" height="270" rx="13" fill="#5B6675" stroke={TOOL_STROKE} strokeWidth="12" />
      <path d="M-78 118 h156 l-16 104 h-124 Z" fill="#FF8A4C" stroke={TOOL_STROKE} strokeWidth="13" strokeLinejoin="round" />
      <path d="M-64 214 h128" stroke={TOOL_STROKE} strokeWidth="11" strokeLinecap="round" opacity="0.5" />
    </g>
  ),
  medal: (
    <g transform="rotate(8)">
      {/* ribbon hangs from the grip, disc below */}
      <path d="M-34 -8 l-26 96 l34 26 l30 -96 Z" fill="#FF7043" stroke={TOOL_STROKE} strokeWidth="11" strokeLinejoin="round" />
      <path d="M34 -8 l26 96 l-34 26 l-30 -96 Z" fill="#4FB3F0" stroke={TOOL_STROKE} strokeWidth="11" strokeLinejoin="round" />
      <circle cx="0" cy="176" r="66" fill="#FFC93C" stroke={TOOL_STROKE} strokeWidth="13" />
      <path d="M-22 168 l14 18 l30 -36" fill="none" stroke={TOOL_STROKE} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="-20" cy="150" rx="16" ry="10" fill="#FFF6D8" opacity="0.8" transform="rotate(-24 -20 150)" />
    </g>
  ),
  trophy: (
    <g transform="rotate(6)">
      {/* cup */}
      <path d="M-62 -120 h124 l-14 118 a50 50 0 0 1 -96 0 Z" fill="#FFC93C" stroke={TOOL_STROKE} strokeWidth="13" strokeLinejoin="round" />
      {/* handles */}
      <path d="M-62 -96 h-34 a30 30 0 0 0 30 56" fill="none" stroke={TOOL_STROKE} strokeWidth="13" strokeLinecap="round" />
      <path d="M62 -96 h34 a30 30 0 0 1 -30 56" fill="none" stroke={TOOL_STROKE} strokeWidth="13" strokeLinecap="round" />
      {/* stem + base */}
      <rect x="-14" y="-2" width="28" height="60" fill="#E8A80C" stroke={TOOL_STROKE} strokeWidth="12" />
      <path d="M-56 58 h112 l10 52 h-132 Z" fill="#E8A80C" stroke={TOOL_STROKE} strokeWidth="13" strokeLinejoin="round" />
      <path d="M-26 -78 l16 20 l34 -40" fill="none" stroke={TOOL_STROKE} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
    </g>
  ),
};

export default function XiRplMascot({
  className = '',
  size = 340,
  pose = 'happy',
  withLaptop = false,
  tool,
  toolRight,
  frozen = false,
}: {
  className?: string;
  size?: number;
  pose?: MascotPose;
  /** Laptop is the hero identity prop — only the `/` hero passes it. */
  withLaptop?: boolean;
  /** Cleaning gear for the left hand; overrides the pose's own hand. */
  tool?: MascotTool;
  /** Prop for the right hand (mirrored grip). */
  toolRight?: MascotTool;
  /** Ice shell; implied automatically by pose="cold". */
  frozen?: boolean;
}) {
  const uid = useId();
  const g = (n: string) => `${uid}-${n}`;
  const stroke = '#0A2540';
  const yellow = '#FFC93C';
  const hand = `url(#${g('handShade')})`;
  const blue = `url(#${g('bodyBlue')})`;
  const inIce = frozen || pose === 'cold';

  // Per-pose bubble text and body tilt. A record beats an 8-deep ternary.
  const bubbleText =
    { sleep: 'zzz', search: '?', cozy: '<3', cheer: 'Yay!', cold: 'brr', angry: 'grr!' }[
      pose as Exclude<MascotPose, 'happy'>
    ] ?? '</>';

  const tiltDeg = { sleep: 8, search: -6, cozy: -4, cheer: -5, cold: 3, angry: -5 }[
    pose as Exclude<MascotPose, 'happy'>
  ];
  const tilt = tiltDeg && !inIce ? `rotate(${tiltDeg} 700 640)` : undefined;

  return (
    <svg
      className={className}
      width={size}
      height={(size * 1180) / 1320}
      viewBox="0 0 1320 1180"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={
        inIce
          ? 'Maskot robot XI RPL membeku'
          : pose === 'angry'
            ? 'Maskot robot XI RPL marah'
            : 'Maskot robot XI RPL'
      }
    >
      <defs>
        <linearGradient id={g('bodyBlue')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3FA9F5" />
          <stop offset="55%" stopColor="#1E88E5" />
          <stop offset="100%" stopColor="#106BC4" />
        </linearGradient>
        <linearGradient id={g('bodySide')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0E5DAE" />
          <stop offset="100%" stopColor="#0A4990" />
        </linearGradient>
        <linearGradient id={g('topBar')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5CBBFA" />
          <stop offset="100%" stopColor="#2E9BF0" />
        </linearGradient>
        <linearGradient id={g('yellowBall')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE59A" />
          <stop offset="45%" stopColor="#FFC93C" />
          <stop offset="100%" stopColor="#F5A400" />
        </linearGradient>
        <linearGradient id={g('yellowPill')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD966" />
          <stop offset="100%" stopColor="#F7A800" />
        </linearGradient>
        <linearGradient id={g('bubbleYellow')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE083" />
          <stop offset="100%" stopColor="#F8AC0E" />
        </linearGradient>
        <linearGradient id={g('screenGrad')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#132A44" />
          <stop offset="100%" stopColor="#081522" />
        </linearGradient>
        <linearGradient id={g('footGrad')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123B66" />
          <stop offset="100%" stopColor="#081D38" />
        </linearGradient>
        <linearGradient id={g('laptopGrad')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3C4A6B" />
          <stop offset="100%" stopColor="#232E48" />
        </linearGradient>
        <linearGradient id={g('laptopBase')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#28324E" />
          <stop offset="100%" stopColor="#181F33" />
        </linearGradient>
        <radialGradient id={g('handShade')} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D9E6F2" />
        </radialGradient>
        {inIce && (
          <linearGradient id={g('ice')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E0F7FF" stopOpacity="0.82" />
            <stop offset="48%" stopColor="#7DD3FC" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.58" />
          </linearGradient>
        )}
      </defs>

      {/* Body core tilts per pose; bubble stays upright so it never clips. */}
      <g transform={tilt}>
        {/* ================= ANTENNA ================= */}
        <g transform="translate(0,55)">
          <path d="M472 300 q10 -95 55 -150" fill="none" stroke={stroke} strokeWidth="20" strokeLinecap="round" />
          <path d="M478 296 q8 -85 50 -136" fill="none" stroke="#1E88E5" strokeWidth="9" strokeLinecap="round" opacity="0.55" />
          <circle cx="537" cy="128" r="52" fill={`url(#${g('yellowBall')})`} stroke={stroke} strokeWidth="14" />
          <ellipse cx="519" cy="108" rx="15" ry="11" fill="#FFF6D8" opacity="0.85" />
        </g>

        {/* ================= BODY (side / depth slab first) ================= */}
        <rect x="440" y="345" width="605" height="620" rx="70" fill={`url(#${g('bodySide')})`} />
        <rect x="990" y="345" width="55" height="620" rx="26" fill="#083868" opacity="0.5" />

        {/* ================= BODY (front face) ================= */}
        <rect x="400" y="330" width="605" height="600" rx="70"
          fill={`url(#${g('bodyBlue')})`} stroke={stroke} strokeWidth="16" />
        <rect x="955" y="345" width="14" height="565" rx="6" fill="#7FD4FF" opacity="0.55" />

        <path d="M420 350 q280 -40 565 0 q10 60 -6 110 q-280 -34 -560 0 q-14 -55 1 -110 Z"
          fill="#FFFFFF" opacity="0.08" />

        {/* ================= TOP LOGO ROW ================= */}
        <g transform="translate(455,405)">
          <ellipse cx="55" cy="45" rx="80" ry="30" fill="none" stroke={yellow} strokeWidth="9" transform="rotate(-20 55 45)" />
          <circle cx="52" cy="45" r="36" fill={stroke} />
          <circle cx="52" cy="45" r="36" fill="none" stroke="#0F3F6E" strokeWidth="4" />
          <text x="52" y="46" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700" fontSize="24" fill={yellow}>&lt;/&gt;</text>
        </g>

        <text x="660" y="470" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontStyle="italic" fontSize="74" fill="#FFFFFF" letterSpacing="1">XI</text>
        <text x="770" y="470" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontStyle="italic" fontSize="74" fill={yellow} letterSpacing="1">RPL</text>
        <text x="953" y="460" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontStyle="italic" fontSize="46" fill={yellow} opacity="0.9">{'//'}</text>

        <rect x="450" y="500" width="700" height="7" rx="3.5" fill="#8FD0FF" opacity="0.55" />

        {/* ================= SCREEN ================= */}
        <rect x="450" y="545" width="600" height="330" rx="34"
          fill="#BEE3FF" opacity="0.5" />
        <rect x="462" y="557" width="576" height="306" rx="28"
          fill={`url(#${g('screenGrad')})`} stroke="#08182A" strokeWidth="8" />

        {/* code lines left column */}
        <rect x="497" y="600" width="6" height="34" rx="3" fill="#3DBE6C" />
        <rect x="497" y="642" width="6" height="34" rx="3" fill="#F5A623" />
        <rect x="497" y="684" width="6" height="34" rx="3" fill="#3DA6F5" />
        <rect x="497" y="726" width="6" height="34" rx="3" fill="#3DBE6C" />
        {[600, 622, 644, 666, 688, 710, 732, 754].map((y, i) => (
          <rect key={y} x="520" y={y + 4} width={[96, 130, 70, 150, 90, 120, 60, 105][i]} height="9" rx="4.5" fill="#3E5C7A" opacity="0.85" />
        ))}

        {/* face: pose-dependent */}
        {pose === 'sleep' ? (
          <g>
            <path d="M712 716 q38 26 76 0" fill="none" stroke={yellow} strokeWidth="16" strokeLinecap="round" />
            <path d="M808 716 q38 26 76 0" fill="none" stroke={yellow} strokeWidth="16" strokeLinecap="round" />
            <ellipse cx="780" cy="768" rx="16" ry="10" fill={yellow} stroke={stroke} strokeWidth="7" />
          </g>
        ) : pose === 'search' ? (
          <g>
            <circle cx="752" cy="726" r="17" fill="none" stroke={yellow} strokeWidth="15" />
            <circle cx="838" cy="726" r="17" fill="none" stroke={yellow} strokeWidth="15" />
            <path d="M742 768 q15 -12 30 0 q15 12 30 0" fill="none" stroke={yellow} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : pose === 'cozy' ? (
          <g>
            <path d="M712 722 q38 -26 76 0" fill="none" stroke={yellow} strokeWidth="16" strokeLinecap="round" />
            <path d="M808 722 q38 -26 76 0" fill="none" stroke={yellow} strokeWidth="16" strokeLinecap="round" />
            <path d="M722 762 q28 22 58 0" fill="none" stroke={yellow} strokeWidth="14" strokeLinecap="round" />
          </g>
        ) : pose === 'cheer' ? (
          <g>
            <path d="M712 690 q38 32 76 0" fill="none" stroke={yellow} strokeWidth="16" strokeLinecap="round" />
            <path d="M808 690 q38 32 76 0" fill="none" stroke={yellow} strokeWidth="16" strokeLinecap="round" />
            <path d="M748 758 q32 30 64 0" fill="none" stroke={yellow} strokeWidth="15" strokeLinecap="round" />
          </g>
        ) : pose === 'cold' ? (
          <g>
            {/* eyes squeezed shut, mouth chattering */}
            <path d="M712 716 l38 -22 l38 22" fill="none" stroke={yellow} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M808 716 l38 -22 l38 22" fill="none" stroke={yellow} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M744 762 l17 -14 l17 14 l17 -14 l17 14" fill="none" stroke={yellow} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : pose === 'angry' ? (
          <g>
            {/* brows pressed into a hard V, small hot eyes, gritted teeth */}
            <path d="M704 692 l88 30" fill="none" stroke={yellow} strokeWidth="16" strokeLinecap="round" />
            <path d="M896 692 l-88 30" fill="none" stroke={yellow} strokeWidth="16" strokeLinecap="round" />
            <circle cx="750" cy="744" r="13" fill={yellow} />
            <circle cx="850" cy="744" r="13" fill={yellow} />
            <rect x="744" y="766" width="68" height="26" rx="9" fill={yellow} />
            <path d="M767 768 v22 M790 768 v22 M813 768 v22" stroke="#081522" strokeWidth="6" />
          </g>
        ) : (
          <g>
            <path d="M712 690 l38 32 l-38 32" fill="none" stroke={yellow}
              strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="808" y="694" width="22" height="62" rx="9" fill={yellow} />
            <line x1="748" y1="758" x2="800" y2="758" stroke={yellow} strokeWidth="16" strokeLinecap="round" />
            <path d="M862 738 q28 34 60 0" fill="none" stroke={yellow}
              strokeWidth="14" strokeLinecap="round" />
          </g>
        )}

        {/* anime anger pop beside the head */}
        {pose === 'angry' && (
          <path
            d="M330 346 q7 24 30 30 q-24 7 -30 30 q-7 -24 -30 -30 q24 -7 30 -30 Z"
            fill="#FF4D4D"
            stroke={stroke}
            strokeWidth="8"
            strokeLinejoin="round"
          />
        )}

        {/* screen glare stripes */}
        <path d="M905 575 l55 0 l-95 150 l-55 0 Z" fill="#FFFFFF" opacity="0.05" />
        <path d="M975 575 l35 0 l-95 150 l-35 0 Z" fill="#FFFFFF" opacity="0.05" />

        {/* ================= BOTTOM BAR: RPL badge + status dots ================= */}
        <rect x="462" y="910" width="230" height="86" rx="43"
          fill={`url(#${g('yellowPill')})`} stroke={stroke} strokeWidth="11" />
        <text x="577" y="968" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="900" fontStyle="italic" fontSize="40" fill={stroke}>&gt;&gt; RPL</text>

        <circle cx="812" cy="953" r="19" fill="#4CD671" stroke={stroke} strokeWidth="5" />
        <circle cx="812" cy="948" r="7" fill="#B6FFC9" opacity="0.7" />
        <circle cx="872" cy="953" r="19" fill={yellow} stroke={stroke} strokeWidth="5" />
        <circle cx="872" cy="948" r="7" fill="#FFEFAF" opacity="0.7" />
        <circle cx="932" cy="953" r="19" fill="#FF7043" stroke={stroke} strokeWidth="5" />
        <circle cx="932" cy="948" r="7" fill="#FFC4AC" opacity="0.7" />

        {/* ================= FEET ================= */}
        <rect x="505" y="1020" width="150" height="34" rx="17" fill="#0D3E70" />
        <rect x="505" y="1044" width="150" height="86" rx="43" fill={`url(#${g('footGrad')})`} stroke="#061428" strokeWidth="8" />
        <rect x="820" y="1020" width="150" height="34" rx="17" fill="#0D3E70" />
        <rect x="820" y="1044" width="150" height="86" rx="43" fill={`url(#${g('footGrad')})`} stroke="#061428" strokeWidth="8" />

        {/* ================= LEFT HAND (tool wins, else pose) ================= */}
        {tool ? (
          <g>
            {/* arm tilts out toward the hand; the hand grips whatever tool is passed */}
            <rect x="330" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" transform="rotate(36 390 890)" />
            <g transform="translate(282,812)">{TOOLS[tool]}</g>
            <ellipse cx="282" cy="812" rx="66" ry="56" fill={hand} stroke={stroke} strokeWidth="13" transform="rotate(-10 282 812)" />
            <path d="M258 796 q16 12 0 26" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
          </g>
        ) : pose === 'sleep' ? (
          <g>
            <rect x="330" y="820" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" />
            <ellipse cx="300" cy="920" rx="70" ry="52" fill={hand} stroke={stroke} strokeWidth="13" />
            <path d="M262 905 q30 20 0 40" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <path d="M115 640 l26 58 l-58 -18 Z" fill={yellow} transform="rotate(14 115 640)" opacity="0.7" />
            <text x="92" y="655" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700" fontSize="60" fill={yellow} opacity="0.85" transform="rotate(10 92 655)">z</text>
          </g>
        ) : pose === 'search' ? (
          <g>
            <rect x="330" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" transform="rotate(-55 390 890)" />
            <ellipse cx="272" cy="760" rx="72" ry="62" fill={hand} stroke={stroke} strokeWidth="13" transform="rotate(-12 272 760)" />
            <path d="M245 745 q16 12 0 26" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <path d="M278 730 q16 12 0 26" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <path d="M150 745 l22 46 l-46 -16 Z" fill={yellow} transform="rotate(12 150 745)" />
            <text x="96" y="772" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700" fontSize="62" fill={yellow} opacity="0.9" transform="rotate(-10 96 772)">?</text>
          </g>
        ) : pose === 'cozy' ? (
          <g>
            <rect x="330" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" />
            <ellipse cx="300" cy="855" rx="95" ry="88" fill={hand} stroke={stroke} strokeWidth="14" />
            <path d="M250 830 q40 30 0 65" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
            <path d="M285 815 q35 40 -5 85" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <path d="M240 880 c-18 -20 8 -48 30 -26 c22 -22 48 6 30 26 l-30 34 Z"
              fill="#FF5C8A" stroke={stroke} strokeWidth="10" strokeLinejoin="round" />
            <ellipse cx="215" cy="746" rx="9" ry="20" fill="#FFFFFF" opacity="0.7" />
          </g>
        ) : pose === 'cheer' ? (
          <g>
            <path d="M175 620 l30 62 l-62 -20 Z" fill={yellow} transform="rotate(18 175 620)" />
            <path d="M150 705 l22 46 l-46 -16 Z" fill={yellow} transform="rotate(12 150 705)" />
            <rect x="330" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" transform="rotate(55 390 890)" />
            <ellipse cx="270" cy="700" rx="72" ry="62" fill={hand} stroke={stroke} strokeWidth="13" transform="rotate(12 270 700)" />
            <path d="M243 685 q16 12 0 26" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <path d="M276 670 q16 12 0 26" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
          </g>
        ) : pose === 'angry' ? (
          <g>
            {/* clenched fist and bent arm */}
            <rect x="330" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" transform="rotate(-42 390 890)" />
            <ellipse cx="264" cy="852" rx="66" ry="56" fill={hand} stroke={stroke} strokeWidth="13" transform="rotate(-12 264 852)" />
            <path d="M230 836 q22 18 0 36 M258 826 q22 18 0 38" fill="none" stroke="#B9CBDD" strokeWidth="7" strokeLinecap="round" />
            <path d="M168 724 l28 52 l-50 -16 Z" fill="#FF7043" transform="rotate(12 168 724)" />
          </g>
        ) : tool ? (
          <g>
            {/* arm tilts out toward the hand; the hand grips whatever tool is passed */}
            <rect x="330" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" transform="rotate(36 390 890)" />
            <g transform="translate(282,812)">{TOOLS[tool]}</g>
            <ellipse cx="282" cy="812" rx="66" ry="56" fill={hand} stroke={stroke} strokeWidth="13" transform="rotate(-10 282 812)" />
            <path d="M258 796 q16 12 0 26" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
          </g>
        ) : (
          <g>
            <path d="M175 660 l30 62 l-62 -20 Z" fill={yellow} transform="rotate(18 175 660)" />
            <path d="M150 745 l22 46 l-46 -16 Z" fill={yellow} transform="rotate(12 150 745)" />
            <rect x="330" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" />
            <ellipse cx="300" cy="855" rx="95" ry="88" fill={hand} stroke={stroke} strokeWidth="14" />
            <path d="M250 830 q40 30 0 65" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
            <path d="M285 815 q35 40 -5 85" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <path d="M255 815 q-45 -10 -48 -68 q-2 -46 34 -50 q34 -3 40 34 l10 70 Z"
              fill={hand} stroke={stroke} strokeWidth="14" strokeLinejoin="round" />
            <ellipse cx="223" cy="742" rx="9" ry="20" fill="#FFFFFF" opacity="0.7" />
          </g>
        )}

        {/* ================= RIGHT SIDE ================= */}
        {withLaptop ? (
          <g>
            <ellipse cx="1090" cy="960" rx="72" ry="55" fill={hand} stroke={stroke} strokeWidth="13" />
            <path d="M1045 930 q10 -35 55 -20" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <g transform="translate(950,760) rotate(-16)">
              <path d="M0 0 h250 l-14 165 h-250 Z" fill={`url(#${g('laptopGrad')})`} stroke={stroke} strokeWidth="14" strokeLinejoin="round" />
              <path d="M22 20 h206 l-10 125 h-206 Z" fill="#111A2E" opacity="0.55" />
              <rect x="95" y="10" width="55" height="12" rx="6" fill={yellow} />
              <text x="122" y="88" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700" fontSize="42" fill="#FFFFFF">&lt;/&gt;</text>
              <path d="M-14 165 h278 l-18 34 h-250 Z" fill={`url(#${g('laptopBase')})`} stroke={stroke} strokeWidth="10" strokeLinejoin="round" />
            </g>
          </g>
        ) : toolRight ? (
          <g>
            {/* mirrored grip: arm tilts out, hand holds the prop */}
            <rect x="910" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" transform="rotate(-36 990 890)" />
            <g transform="translate(1095,812) scale(-1 1)">{TOOLS[toolRight]}</g>
            <ellipse cx="1095" cy="812" rx="66" ry="56" fill={hand} stroke={stroke} strokeWidth="13" transform="rotate(10 1095 812)" />
            <path d="M1119 796 q-16 12 0 26" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
          </g>
        ) : tool ? (
          <g>
            {/* tool already claimed the left hand, so this one just rests */}
            <rect x="910" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" />
            <ellipse cx="1095" cy="855" rx="95" ry="88" fill={hand} stroke={stroke} strokeWidth="14" />
            <path d="M1050 830 q40 30 0 65" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
            <path d="M1085 815 q35 40 -5 85" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <path d="M1196 618 l26 54 l-54 -18 Z" fill={yellow} transform="rotate(-16 1196 618)" />
            <path d="M1222 700 l19 40 l-40 -14 Z" fill={yellow} transform="rotate(-10 1222 700)" opacity="0.8" />
          </g>
        ) : pose === 'sleep' ? (
          <g>
            <rect x="910" y="820" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" />
            <ellipse cx="1090" cy="920" rx="70" ry="52" fill={hand} stroke={stroke} strokeWidth="13" />
            <path d="M1128 905 q30 20 0 40" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <text x="1208" y="655" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700" fontSize="60" fill={yellow} opacity="0.85" transform="rotate(-10 1208 655)">z</text>
          </g>
        ) : pose === 'search' ? (
          <g>
            <rect x="910" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" />
            <ellipse cx="1095" cy="865" rx="90" ry="82" fill={hand} stroke={stroke} strokeWidth="14" />
            <path d="M1055 838 q38 28 0 60" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
            <path d="M1090 822 q38 34 -4 80" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
          </g>
        ) : pose === 'cozy' ? (
          <g>
            <rect x="910" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" />
            <ellipse cx="1095" cy="855" rx="95" ry="88" fill={hand} stroke={stroke} strokeWidth="14" />
            <path d="M1050 830 q40 30 0 65" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
            <path d="M1085 815 q35 40 -5 85" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <path d="M1080 885 c-18 -20 8 -48 30 -26 c22 -22 48 6 30 26 l-30 34 Z"
              fill="#FF5C8A" stroke={stroke} strokeWidth="10" strokeLinejoin="round" />
          </g>
        ) : pose === 'cheer' ? (
          <g>
            <path d="M1140 620 l30 62 l-62 -20 Z" fill={yellow} transform="rotate(-18 1140 620)" />
            <path d="M1168 705 l22 46 l-46 -16 Z" fill={yellow} transform="rotate(-12 1168 705)" />
            <rect x="910" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" transform="rotate(-55 990 890)" />
            <ellipse cx="1125" cy="700" rx="72" ry="62" fill={hand} stroke={stroke} strokeWidth="13" transform="rotate(-12 1125 700)" />
            <path d="M1102 685 q16 12 0 26" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <path d="M1135 670 q16 12 0 26" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
          </g>
        ) : (
          <g>
            <rect x="910" y="815" width="120" height="150" rx="40" fill={blue} stroke={stroke} strokeWidth="14" />
            <ellipse cx="1095" cy="855" rx="95" ry="88" fill={hand} stroke={stroke} strokeWidth="14" />
            <path d="M1050 830 q40 30 0 65" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
            <path d="M1085 815 q35 40 -5 85" fill="none" stroke="#B9CBDD" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
          </g>
        )}
      </g>

      {inIce && (
        <g pointerEvents="none" opacity="0.92">
          {/* Ice shell around body; silhouette remains readable through the fill. */}
          <path
            d="M430 388 L470 342 L540 350 L610 316 L690 344 L770 320 L850 350 L940 338 L1002 398 L1018 500 L1060 566 L1034 650 L1064 732 L1018 804 L1028 900 L956 944 L870 928 L790 966 L704 938 L620 966 L548 932 L460 948 L418 876 L382 810 L408 730 L380 650 L410 566 L386 478 Z"
            fill={`url(#${g('ice')})`}
            stroke="#BAE6FD"
            strokeWidth="18"
            strokeLinejoin="round"
          />
          <path d="M430 430 L492 476 L448 544 L510 596 L452 664 L500 728 L446 806" fill="none" stroke="#EFFBFF" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
          <path d="M982 426 L930 488 L980 548 L922 620 L974 688 L918 754 L962 824" fill="none" stroke="#EFFBFF" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
          <path d="M540 360 L576 410 L624 366 M846 354 L810 410 L862 466" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          <circle cx="420" cy="522" r="12" fill="#FFFFFF" opacity="0.85" />
          <circle cx="1018" cy="584" r="10" fill="#FFFFFF" opacity="0.85" />
        </g>
      )}

      {/* ================= SPEECH BUBBLE (stays upright, never clips) ================= */}
      <g>
        <path d="M1035 250 h225 a42 42 0 0 1 42 42 v95 a42 42 0 0 1 -42 42 h-118 l-52 55 v-55 h-55 a42 42 0 0 1 -42 -42 v-95 a42 42 0 0 1 42 -42 Z"
          fill={`url(#${g('bubbleYellow')})`} stroke={stroke} strokeWidth="14" strokeLinejoin="round" />
        <ellipse cx="1090" cy="278" rx="26" ry="12" fill="#FFF3C0" opacity="0.65" transform="rotate(-18 1090 278)" />
        <text x="1147" y="345" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700" fontSize="52" fill={stroke}>{bubbleText}</text>
      </g>
    </svg>
  );
}