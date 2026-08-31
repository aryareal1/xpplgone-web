import { text } from '../text';
import { COLORS, FONTS, FRAME, SIZES } from '../theme';

/** Class/school line on the left, page number on the right, on every page. */
export const drawFooter = (
  doc: PDFKit.PDFDocument,
  label: string,
  page: number,
) => {
  const opts = {
    font: FONTS.regular,
    size: SIZES.footer,
    color: COLORS.footer,
    y: FRAME.footerBaseline,
  } as const;
  text(doc, label, { ...opts, x: FRAME.left });
  text(doc, String(page), { ...opts, right: FRAME.right });
};
