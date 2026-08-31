/**
 * Geometry + palette for the monthly recap PDF.
 *
 * Layout numbers are expressed in **reference pixels** — the coordinate space
 * of `.habit-recap-visual/1.png` / `2.png` (1414 x 2000 for A4) — so values
 * measured off the mockups can be used verbatim. `pt()` converts to points.
 */

/** A4 in PDF points. */
export const PAGE = { w: 595.276, h: 841.89 };

/** Reference image width: 1414 px of mockup == 595.276 pt of paper. */
const REF_W = 1414;

/** Reference pixels per PDF point. */
export const PX = REF_W / PAGE.w;

/** Reference px -> PDF pt. */
export const pt = (px: number) => px / PX;

export const COLORS = {
  /** `--color-brand-blue`, the frontend banner background. */
  brandBlue: '#1e88e5',
  /** `border-b-4 border-[#1268b8]` under the frontend banner. */
  brandBlueEdge: '#1268b8',
  white: '#ffffff',
  /** `--foreground` */
  ink: '#0a2540',
  /** `--muted-foreground` */
  muted: '#5b7086',
  footer: '#9aa5b1',
  grid: '#e5e5e5',
  /** `TrendArea` default stroke. */
  trend: '#10b981',
  timeline: '#b4b4b4',
} as const;

/** Mirrors the web dashboard's `MODULES` order and `MODULE_HEX` palette. */
export const MODULES = [
  { key: 'checkins', label: 'Kehadiran', color: '#0ea5e9' },
  { key: 'prays', label: 'Ibadah', color: '#8b5cf6' },
  { key: 'sports', label: 'Olahraga', color: '#10b981' },
  { key: 'studies', label: 'Belajar', color: '#f59e0b' },
] as const;

export type ModuleKey = (typeof MODULES)[number]['key'];

/** Score bucket colors, low -> high (`BUCKET_HEX` extended to five steps). */
export const BUCKET_COLORS = [
  '#f43f5e',
  '#f59e0b',
  '#facc15',
  '#a3e635',
  '#10b981',
] as const;

/** Avatar fills; the web app has no name->color convention to reuse. */
export const AVATAR_COLORS = [
  '#0ea5e9',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#f43f5e',
  '#1e88e5',
] as const;

export const FONTS = {
  regular: 'DMSans-Regular',
  medium: 'DMSans-Medium',
  bold: 'DMSans-Bold',
  displaySemi: 'Fredoka-SemiBold',
  displayBold: 'Fredoka-Bold',
} as const;

/** Font sizes in pt, fitted to the reference glyph extents. */
export const SIZES = {
  title: 25.75,
  month: 22,
  metricLabel: 17.4,
  metricValue: 17.4,
  heading: 17.4,
  axisLabel: 8.2,
  barAxisLabel: 7.5,
  legend: 8.3,
  pieLabel: 8.35,
  footer: 9.6,
  studentsHeading: 17.6,
  studentName: 17.5,
  studentNis: 11.9,
  avatar: 16,
  moduleLabel: 8.5,
  dayLabel: 8.3,
  studentStat: 11.9,
} as const;

/** Page frame shared by every page, in reference px. */
export const FRAME = {
  left: 96,
  right: 1311,
  footerBaseline: 1927,
} as const;

/** Page 1 anchors, in reference px. */
export const P1 = {
  banner: { h: 264, edge: 4 },
  titleBaseline: 123,
  monthBaseline: 178.5,
  /** The four metric columns never move; their labels are fixed. */
  metricX: [96, 362, 739, 1015],
  metricLabelBaseline: 362,
  metricValueBaseline: 410.5,
  trendHeadingBaseline: 548.5,
  /**
   * Trend plot: gridlines span `x`..`x+w`; value 0 sits at `y0` and 100 at
   * `y0 - h`. Points land on band centres, as in the reference.
   */
  trend: {
    headingX: 96,
    x: 155,
    w: 1148,
    y0: 1083,
    h: 473,
    labelRight: 141,
    dayBaseline: 1107,
    stroke: 6,
    dotR: 6,
  },
  lowerHeadingBaseline: 1253.5,
  pie: {
    headingX: 96,
    legendBaseline: 1331,
    legendDotX: 146,
    legendDotR: 10,
    /** Dot centre -> label start. */
    legendDotGap: 20,
    /** Label end -> next dot centre. */
    legendTextGap: 37,
    cx: 402.5,
    cy: 1604.5,
    r: 203.5,
    /** Label block centre radius, and the gap between its two lines. */
    labelR: 248,
    labelLine: 26,
  },
  bar: {
    headingX: 787,
    /** Gridlines span the first bar's left edge to the last bar's right edge. */
    x: 842,
    w: 463,
    y0: 1776,
    h: 462,
    /** gap / barWidth, from the reference's 80 px bars on a 95.75 px pitch. */
    gapRatio: 0.2,
    radius: 6,
    labelRight: 829,
    dayBaseline: 1798,
  },
} as const;

/** Student pages, in reference px. Offsets are relative to the block top. */
export const P2 = {
  headingBaseline: 156.5,
  /** First block top on the page carrying the `Per Students` heading. */
  firstTop: 184,
  /** First block top on continuation pages. */
  continuedTop: 126,
  /** Distance between consecutive block tops. */
  pitch: 293,
  /** Ink height of one block, measured from its top. */
  height: 228,
  /** A block must fit above this to stay on the page. */
  bottom: 1878,
  avatar: { cx: 140.5, cy: 47.5, r: 48, letterBaseline: 60 },
  nameX: 206,
  nameBaseline: 47,
  nisBaseline: 80.5,
  /** Four tracks: first at `y`, then `pitch` apart; points on band centres. */
  track: { x: 201, w: 930, y: 124.5, pitch: 25.85, dotR: 8, stroke: 2 },
  /** Module labels are left-aligned on the content margin. */
  moduleLabelX: 92,
  /** Module label baselines sit a touch below their track. */
  moduleLabelDrop: 5.5,
  dayBaseline: 228,
  stat: {
    labelX: 1151,
    valueRight: 1324,
    rateBaseline: 146,
    streakBaseline: 190,
  },
} as const;
