import { text } from '../text';
import { COLORS, FONTS, P1, SIZES } from '../theme';

/**
 * The four headline metrics, laid out on fixed columns with the label above the
 * value — plain text, no cards, as in the reference.
 */
export const drawSummary = (
  doc: PDFKit.PDFDocument,
  overview: {
    rate: number;
    checkins: number;
    late: number;
    needAttention: number;
  },
) => {
  const items = [
    ['Rate', `${overview.rate}%`],
    ['Checkins', String(overview.checkins)],
    ['Late', String(overview.late)],
    ['Need Attention', String(overview.needAttention)],
  ] as const;

  items.forEach(([label, value], i) => {
    const x = P1.metricX[i]!;
    text(doc, label, {
      font: FONTS.bold,
      size: SIZES.metricLabel,
      color: COLORS.ink,
      x,
      y: P1.metricLabelBaseline,
    });
    text(doc, value, {
      font: FONTS.regular,
      size: SIZES.metricValue,
      color: COLORS.ink,
      x,
      y: P1.metricValueBaseline,
    });
  });
};
