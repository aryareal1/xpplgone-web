import { SVGtoPDF } from 'svg-for-pdfkit';
import { PX, pt } from './theme';

/** A chart ready to place: page position (reference px) plus its SVG body. */
export type Chart = {
  x: number;
  y: number;
  w: number;
  h: number;
  body: string;
};

/** Text width in reference px, for laying out inside an SVG. */
export type Measure = (text: string, font: string, size: number) => number;

/**
 * A pt font size as SVG user units. Chart SVGs are authored in reference px, so
 * every `font-size` needs this conversion or text renders 2.4x too small.
 */
export const fontPx = (size: number) => +(size * PX).toFixed(2);

/**
 * Draw an SVG whose user units are **reference pixels**, placed at a reference
 * pixel offset. The root carries a px `viewBox` and a pt `width`/`height` so
 * `svg-for-pdfkit` does the scaling; chart code keeps every coordinate in the
 * units measured off the mockups.
 */
export const drawSvg = (doc: PDFKit.PDFDocument, chart: Chart) => {
  const { x, y, w, h, body } = chart;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${pt(w)}" height="${pt(h)}">${body}</svg>`;
  SVGtoPDF(doc, svg, pt(x), pt(y), {
    assumePt: true,
    // Font families in our SVGs are the names registered on the document.
    fontCallback: (family: string) => family,
    warningCallback: () => {},
  });
};

/** Escape text for use inside an SVG text node. */
export const esc = (v: string | number) =>
  String(v).replace(
    /[&<>]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] ?? c,
  );

/**
 * A `nice` axis maximum for a count axis: the smallest 1/2/5 x 10^n multiple of
 * `divisions` that covers `max`. Returns the max plus its tick step.
 */
export const niceScale = (max: number, divisions = 4) => {
  if (max <= 0) return { max: divisions, step: 1 };
  const raw = max / divisions;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].find((m) => m * mag >= raw)! * mag;
  return { max: step * divisions, step };
};

/**
 * Monotone cubic path through `points`, matching the `type="monotone"` curve
 * recharts draws in the web dashboard.
 */
export const monotonePath = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M${points[0]!.x} ${points[0]!.y}`;

  const n = points.length;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const h = points[i + 1]!.x - points[i]!.x;
    dx.push(h);
    slope.push((points[i + 1]!.y - points[i]!.y) / h);
  }

  // Fritsch–Carlson tangents: zero at extrema, so the curve never overshoots.
  const m: number[] = [slope[0]!];
  for (let i = 1; i < n - 1; i++) {
    const a = slope[i - 1]!;
    const b = slope[i]!;
    m.push(a * b <= 0 ? 0 : (2 * a * b) / (a + b));
  }
  m.push(slope[n - 2]!);

  let d = `M${points[0]!.x} ${points[0]!.y}`;
  for (let i = 0; i < n - 1; i++) {
    const p = points[i]!;
    const q = points[i + 1]!;
    const h = dx[i]! / 3;
    d += `C${p.x + h} ${p.y + m[i]! * h} ${q.x - h} ${q.y - m[i + 1]! * h} ${q.x} ${q.y}`;
  }
  return d;
};
