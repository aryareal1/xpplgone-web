import { type Chart, fontPx, monotonePath } from '../svg';
import { COLORS, FONTS, FRAME, P1, SIZES } from '../theme';

/**
 * Daily Trend: horizontal gridlines every 20, day numbers along the X axis and
 * a monotone curve with one dot per day.
 *
 * All coordinates are reference px. The SVG box starts at the content margin so
 * the Y axis labels fit inside it.
 */
export const dailyTrend = (
  data: { day: number; value: number }[],
  days: number,
): Chart => {
  const { x, w, y0, h, labelRight, dayBaseline, stroke, dotR } = P1.trend;
  const top = y0 - h;
  const box = {
    x: FRAME.left,
    y: top - 14,
    w: x + w - FRAME.left,
    h: dayBaseline + 6 - (top - 14),
  };
  /** Page px -> box-local px. */
  const lx = (px: number) => px - box.x;
  const ly = (px: number) => px - box.y;

  const band = w / days;
  /** Day -> page x, on its band centre as in the reference. */
  const px = (day: number) => x + (day - 0.5) * band;
  const py = (v: number) => y0 - (Math.min(Math.max(v, 0), 100) / 100) * h;

  const grid = [0, 20, 40, 60, 80, 100]
    .map((v) => {
      const gy = ly(py(v));
      return (
        `<line x1="${lx(x)}" y1="${gy}" x2="${lx(x + w)}" y2="${gy}" stroke="${COLORS.grid}" stroke-width="1.4"/>` +
        `<text x="${lx(labelRight)}" y="${gy + 6.6}" text-anchor="end" font-family="${FONTS.regular}" font-size="${fontPx(SIZES.axisLabel)}" fill="${COLORS.ink}">${v}</text>`
      );
    })
    .join('');

  const points = data.map((d) => ({ x: lx(px(d.day)), y: ly(py(d.value)) }));
  const line = points.length
    ? `<path d="${monotonePath(points)}" fill="none" stroke="${COLORS.trend}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>`
    : '';
  const dots = points
    .map(
      (p) =>
        `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${dotR}" fill="${COLORS.trend}"/>`,
    )
    .join('');

  // Thin the day labels so they never collide; day 1 and the last day always show.
  const minGap = SIZES.axisLabel * 2.9;
  const shown: number[] = [];
  let lastX = -Infinity;
  for (let day = 1; day <= days; day++) {
    const cx = px(day);
    if (cx - lastX < minGap) continue;
    shown.push(day);
    lastX = cx;
  }
  if (days > 1 && shown.at(-1) !== days) {
    if (px(days) - px(shown.at(-1)!) < minGap) shown.pop();
    shown.push(days);
  }
  const labels = shown
    .map(
      (day) =>
        `<text x="${lx(px(day)).toFixed(2)}" y="${ly(dayBaseline)}" text-anchor="middle" font-family="${FONTS.regular}" font-size="${fontPx(SIZES.axisLabel)}" fill="${COLORS.ink}">${day}</text>`,
    )
    .join('');

  return { ...box, body: grid + line + dots + labels };
};
