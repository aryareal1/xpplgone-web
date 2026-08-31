import { type Chart, fontPx, niceScale } from '../svg';
import { BUCKET_COLORS, COLORS, FONTS, FRAME, P1, SIZES } from '../theme';

/**
 * Score Distribution: five vertical bars with rounded tops, horizontal
 * gridlines on a nice integer scale, bucket labels underneath.
 */
export const scoreDistribution = (
  buckets: { min: number; max: number; count: number }[],
): Chart => {
  const { x, w, y0, h, gapRatio, radius, labelRight, dayBaseline } = P1.bar;
  const top = y0 - h;
  const box = {
    x: FRAME.left,
    y: top - 14,
    w: FRAME.right - FRAME.left,
    h: dayBaseline + 6 - (top - 14),
  };
  const lx = (px: number) => px - box.x;
  const ly = (px: number) => px - box.y;

  const { max, step } = niceScale(Math.max(...buckets.map((b) => b.count), 0));
  const py = (v: number) => y0 - (v / max) * h;

  const grid: string[] = [];
  for (let v = 0; v <= max; v += step) {
    const gy = ly(py(v));
    grid.push(
      `<line x1="${lx(x)}" y1="${gy}" x2="${lx(x + w)}" y2="${gy}" stroke="${COLORS.grid}" stroke-width="1.4"/>` +
        `<text x="${lx(labelRight)}" y="${gy + 6.2}" text-anchor="end" font-family="${FONTS.regular}" font-size="${fontPx(SIZES.barAxisLabel)}" fill="${COLORS.ink}">${v}</text>`,
    );
  }

  // Bars sit on a fixed pitch; the gap is a share of the bar width.
  const pitch = w / buckets.length;
  const barW = pitch / (1 + gapRatio);
  const bars = buckets.map((b, i) => {
    const bx = x + i * pitch + (pitch - barW) / 2;
    const cx = bx + barW / 2;
    const label = `<text x="${lx(cx).toFixed(2)}" y="${ly(dayBaseline)}" text-anchor="middle" font-family="${FONTS.regular}" font-size="${fontPx(SIZES.barAxisLabel)}" fill="${COLORS.ink}">${b.min}\u2013${b.max}</text>`;
    if (b.count <= 0) return label;

    const bh = y0 - py(b.count);
    const r = Math.min(radius, barW / 2, bh);
    const l = lx(bx);
    const t = ly(py(b.count));
    const bottom = ly(y0);
    const path =
      `M${l.toFixed(2)} ${bottom}V${(t + r).toFixed(2)}` +
      `A${r} ${r} 0 0 1 ${(l + r).toFixed(2)} ${t.toFixed(2)}` +
      `H${(l + barW - r).toFixed(2)}` +
      `A${r} ${r} 0 0 1 ${(l + barW).toFixed(2)} ${(t + r).toFixed(2)}` +
      `V${bottom}Z`;
    return `<path d="${path}" fill="${BUCKET_COLORS[i] ?? BUCKET_COLORS.at(-1)}"/>${label}`;
  });

  return { ...box, body: grid.join('') + bars.join('') };
};
