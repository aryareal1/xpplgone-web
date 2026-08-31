import { text } from '../text';
import { COLORS, FONTS, P1, PAGE, pt, SIZES } from '../theme';

/**
 * Full-width banner matching the frontend's `banner.tsx`: solid brand blue with
 * a darker bottom edge, faint -45deg white hairline stripes, and two stacks of
 * concentric white rings bleeding off the bottom-left and top-right corners.
 */
export const drawHeader = (
  doc: PDFKit.PDFDocument,
  title: string,
  month: string,
) => {
  const { banner, titleBaseline, monthBaseline } = P1;
  const h = pt(banner.h);

  doc.save();
  doc.rect(0, 0, PAGE.w, h).fill(COLORS.brandBlue);
  doc
    .rect(0, h - pt(banner.edge), PAGE.w, pt(banner.edge))
    .fill(COLORS.brandBlueEdge);

  // Keep the decoration inside the banner.
  doc.rect(0, 0, PAGE.w, h).clip();

  // `repeating-linear-gradient(-45deg, #fff 0 1px, transparent 2px 26px)` @ 20%.
  // Spacing measured off the reference: 27 ref px between stripe crossings.
  doc.save().opacity(0.2).lineWidth(pt(1)).strokeColor(COLORS.white);
  const spacing = pt(27);
  for (let x = -h; x < PAGE.w + h; x += spacing)
    doc.moveTo(x, 0).lineTo(x + h, h);
  doc.stroke();
  doc.restore();

  // The frontend's r=270/190/110, strokeWidth=36 rings on a 600-unit viewBox,
  // scaled to a 580 px box and offset so they bleed off the corners.
  doc.save().opacity(0.1).strokeColor(COLORS.white);
  const s = pt(580) / 600;
  doc.lineWidth(36 * s);
  for (const [cx, cy] of [
    [pt(-52), h + pt(52)],
    [PAGE.w + pt(52), pt(-52)],
  ] as const)
    for (const r of [270, 190, 110]) doc.circle(cx, cy, r * s).stroke();
  doc.restore();

  doc.restore();

  text(doc, title, {
    font: FONTS.displayBold,
    size: SIZES.title,
    color: COLORS.white,
    center: true,
    y: titleBaseline,
  });
  text(doc, month, {
    font: FONTS.displaySemi,
    size: SIZES.month,
    color: COLORS.white,
    center: true,
    y: monthBaseline,
  });
};
