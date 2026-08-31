import { type Chart, esc, fontPx, type Measure } from '../svg';
import { COLORS, FONTS, FRAME, MODULES, P1, SIZES } from '../theme';

/**
 * Module Completed pie: a legend row above the circle, slices starting at 12
 * o'clock running clockwise in `MODULES` order, and a two-line name/percentage
 * label outside every non-empty slice.
 */
export const moduleCompleted = (
  modules: { key: string; value: number }[],
  measure: Measure,
): Chart => {
  const {
    legendBaseline,
    legendDotX,
    legendDotR,
    legendDotGap,
    legendTextGap,
    cx,
    cy,
    r,
    labelR,
    labelLine,
  } = P1.pie;
  const box = {
    x: FRAME.left,
    y: legendBaseline - 20,
    w: FRAME.right - FRAME.left,
    h: cy + labelR + 32 - (legendBaseline - 20),
  };
  const lx = (px: number) => px - box.x;
  const ly = (px: number) => px - box.y;

  const items = MODULES.map((m) => ({
    ...m,
    value: modules.find((v) => v.key === m.key)?.value ?? 0,
  }));

  // Legend: dot + label pairs, left to right, each label measured for real.
  let dotX = legendDotX;
  const legend = items
    .map((m) => {
      const textX = dotX + legendDotGap;
      const out =
        `<circle cx="${lx(dotX)}" cy="${ly(legendBaseline - 5)}" r="${legendDotR}" fill="${m.color}"/>` +
        `<text x="${lx(textX)}" y="${ly(legendBaseline)}" font-family="${FONTS.regular}" font-size="${fontPx(SIZES.legend)}" fill="${COLORS.ink}">${esc(m.label)}</text>`;
      dotX =
        textX + measure(m.label, FONTS.regular, SIZES.legend) + legendTextGap;
      return out;
    })
    .join('');

  const total = items.reduce((a, m) => a + m.value, 0);
  const slices: string[] = [];
  const labels: string[] = [];

  if (total <= 0) {
    slices.push(
      `<circle cx="${lx(cx)}" cy="${ly(cy)}" r="${r}" fill="${COLORS.grid}"/>`,
    );
  } else {
    // -90deg puts the first slice's edge at 12 o'clock, as in the reference.
    let start = -Math.PI / 2;
    for (const m of items) {
      const sweep = (m.value / total) * Math.PI * 2;
      if (sweep <= 0) continue;
      const end = start + sweep;
      const mid = start + sweep / 2;

      slices.push(
        sweep >= Math.PI * 2 - 1e-9
          ? `<circle cx="${lx(cx)}" cy="${ly(cy)}" r="${r}" fill="${m.color}"/>`
          : `<path d="M${lx(cx)} ${ly(cy)}L${(lx(cx) + r * Math.cos(start)).toFixed(2)} ${(ly(cy) + r * Math.sin(start)).toFixed(2)}` +
              `A${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${(lx(cx) + r * Math.cos(end)).toFixed(2)} ${(ly(cy) + r * Math.sin(end)).toFixed(2)}Z" fill="${m.color}"/>`,
      );

      // Two centred lines just outside the slice, as in the reference.
      const ax = lx(cx) + labelR * Math.cos(mid);
      const ay = ly(cy) + labelR * Math.sin(mid);
      const line = (t: string, dy: number) =>
        `<text x="${ax.toFixed(2)}" y="${(ay + dy).toFixed(2)}" text-anchor="middle" font-family="${FONTS.regular}" font-size="${fontPx(SIZES.pieLabel)}" fill="${COLORS.ink}">${t}</text>`;
      labels.push(
        line(esc(m.label), -labelLine / 2) +
          line(`${m.value.toFixed(1)}%`, labelLine / 2),
      );

      start = end;
    }
  }

  return { ...box, body: legend + slices.join('') + labels.join('') };
};
