import { type Chart, fontPx } from '../svg';
import { COLORS, FONTS, MODULES, P2, SIZES } from '../theme';

/**
 * One student's activity timeline: four labelled tracks, each a thin baseline
 * with a coloured dot on every day the module was completed, and day numbers
 * underneath. `top` is the student block's top edge in page px.
 */
export const studentTimeline = (
  modules: { key: string; days: number[] }[],
  days: number,
  top: number,
): Chart => {
  const { track, moduleLabelX, moduleLabelDrop, dayBaseline } = P2;
  const box = {
    x: 0,
    y: top + track.y - 16,
    w: track.x + track.w + 8,
    h: top + dayBaseline + 6 - (top + track.y - 16),
  };
  const ly = (offset: number) => top + offset - box.y;

  const band = track.w / days;
  /** Day -> x, on its band centre as in the reference. */
  const dx = (day: number) => track.x + (day - 0.5) * band;

  const rows = MODULES.map((m, i) => {
    const y = ly(track.y + i * track.pitch);
    const done = modules.find((v) => v.key === m.key)?.days ?? [];
    const dots = done
      .filter((d) => d >= 1 && d <= days)
      .map(
        (d) =>
          `<circle cx="${dx(d).toFixed(2)}" cy="${y.toFixed(2)}" r="${track.dotR}" fill="${m.color}"/>`,
      )
      .join('');
    return (
      `<text x="${moduleLabelX}" y="${(y + moduleLabelDrop).toFixed(2)}" font-family="${FONTS.regular}" font-size="${fontPx(SIZES.moduleLabel)}" fill="${COLORS.ink}">${m.label}</text>` +
      `<line x1="${track.x}" y1="${y.toFixed(2)}" x2="${track.x + track.w}" y2="${y.toFixed(2)}" stroke="${COLORS.timeline}" stroke-width="${track.stroke}"/>` +
      dots
    );
  }).join('');

  // Every day number, left to right; 31 labels fit on the track pitch.
  const marks = Array.from({ length: days }, (_, i) => i + 1);
  const labels = marks
    .map(
      (d) =>
        `<text x="${dx(d).toFixed(2)}" y="${ly(dayBaseline)}" text-anchor="middle" font-family="${FONTS.regular}" font-size="${fontPx(SIZES.dayLabel)}" fill="${COLORS.ink}">${d}</text>`,
    )
    .join('');

  return { ...box, body: rows + labels };
};
