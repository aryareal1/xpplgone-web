import { pt } from './theme';

/**
 * Draw one line of text with its **baseline** at reference-px `y`. Every
 * measurement taken off the mockups is a baseline, so this is the only text
 * primitive the components need.
 */
export const text = (
  doc: PDFKit.PDFDocument,
  value: string,
  opts: {
    font: string;
    size: number;
    color: string;
    /** Left edge in reference px, or omit when using `right`/`center`. */
    x?: number;
    /** Right edge in reference px; the text is right-aligned to it. */
    right?: number;
    /** Centre the line across the full page width. */
    center?: boolean;
    /** Baseline in reference px. */
    y: number;
  },
) => {
  doc.font(opts.font).fontSize(opts.size).fillColor(opts.color);
  const y = pt(opts.y);
  if (opts.center) {
    doc.text(value, 0, y, {
      width: doc.page.width,
      align: 'center',
      baseline: 'alphabetic',
      lineBreak: false,
    });
    return;
  }
  const x =
    opts.right !== undefined
      ? pt(opts.right) - doc.widthOfString(value)
      : pt(opts.x ?? 0);
  doc.text(value, x, y, { baseline: 'alphabetic', lineBreak: false });
};
