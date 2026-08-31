import boldFont from './fonts/DMSans-Bold.ttf';
import mediumFont from './fonts/DMSans-Medium.ttf';
import regularFont from './fonts/DMSans-Regular.ttf';
import displayBoldFont from './fonts/Fredoka-Bold.ttf';
import displaySemiFont from './fonts/Fredoka-SemiBold.ttf';
import { FONTS } from './theme';

/**
 * The same two families the web frontend loads (DM Sans for body, Fredoka for
 * display), shipped as static TTFs. PDFKit cannot instance a variable font —
 * `fontkit`'s glyph encoder rejects the subset — so one file per weight.
 */
const FILES: Record<string, string> = {
  [FONTS.regular]: regularFont,
  [FONTS.medium]: mediumFont,
  [FONTS.bold]: boldFont,
  [FONTS.displaySemi]: displaySemiFont,
  [FONTS.displayBold]: displayBoldFont,
};

let cache: Record<string, Buffer> | null = null;

/** Read every font once per process. */
const load = async () => {
  if (cache) return cache;
  const entries = await Promise.all(
    Object.entries(FILES).map(
      async ([name, path]) =>
        [
          name,
          Buffer.from(await Bun.file(new URL(path, import.meta.url)).bytes()),
        ] as const,
    ),
  );
  cache = Object.fromEntries(entries);
  return cache;
};

/** Register every family on `doc` under its `FONTS` name. */
export const registerFonts = async (doc: PDFKit.PDFDocument) => {
  for (const [name, buf] of Object.entries(await load()))
    doc.registerFont(name, buf);
};
