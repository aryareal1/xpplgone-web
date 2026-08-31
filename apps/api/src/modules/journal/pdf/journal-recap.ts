import { SITE_NAME } from '@xirpl/shared';
import PDFDocument from 'pdfkit';
import type { MonthlyJournalRecap } from '../service';
import { dailyTrend } from './charts/daily-trend';
import { moduleCompleted } from './charts/module-completed';
import { scoreDistribution } from './charts/score-distribution';
import { drawFooter } from './components/footer';
import { drawHeader } from './components/header';
import { drawStudent } from './components/student';
import { drawSummary } from './components/summary';
import { registerFonts } from './fonts';
import { drawSvg } from './svg';
import { text } from './text';
import { COLORS, FONTS, P1, P2, SIZES } from './theme';

const TITLE = 'Rekap Jurnal Kebiasaan';
const SCHOOL = 'SMK N 1 Kandeman';

/**
 * Render the monthly recap: one overview page, then as many student pages as
 * the blocks need. Returns the finished PDF as a single buffer.
 */
export const renderJournalRecap = async (recap: MonthlyJournalRecap) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    info: {
      Title: `${TITLE} \u2014 ${recap.month.label}`,
      Author: `${SITE_NAME} ${SCHOOL}`,
    },
  });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  await registerFonts(doc);

  const footerLabel = `${SITE_NAME} ${SCHOOL}`;
  let page = 1;
  const footer = () => drawFooter(doc, footerLabel, page);
  const nextPage = () => {
    footer();
    doc.addPage();
    page++;
  };

  /** Text width in reference px, for SVG label layout. */
  const measure = (value: string, font: string, size: number) => {
    doc.font(font).fontSize(size);
    return doc.widthOfString(value) * (1414 / doc.page.width);
  };

  // ── page 1: monthly overview ────────────────────────
  drawHeader(doc, TITLE, recap.month.label);
  drawSummary(doc, recap.overview);

  const heading = (value: string, x: number, y: number) =>
    text(doc, value, {
      font: FONTS.bold,
      size: SIZES.heading,
      color: COLORS.ink,
      x,
      y,
    });

  heading('Daily Trend', P1.trend.headingX, P1.trendHeadingBaseline);
  drawSvg(doc, dailyTrend(recap.dailyTrend, recap.month.days));

  heading('Module Completed', P1.pie.headingX, P1.lowerHeadingBaseline);
  heading('Score Distribution', P1.bar.headingX, P1.lowerHeadingBaseline);
  drawSvg(doc, moduleCompleted(recap.modules, measure));
  drawSvg(doc, scoreDistribution(recap.scoreDistribution));

  // ── page 2+: per-student recap ──────────────────────
  if (recap.students.length) {
    nextPage();
    text(doc, 'Per Students', {
      font: FONTS.bold,
      size: SIZES.studentsHeading,
      color: COLORS.ink,
      x: P1.trend.headingX,
      y: P2.headingBaseline,
    });

    let top: number = P2.firstTop;
    for (const student of recap.students) {
      // Never split a block: start a new page when the next one won't fit.
      if (top + P2.height > P2.bottom) {
        nextPage();
        top = P2.continuedTop;
      }
      drawStudent(doc, student, recap.month.days, top);
      top += P2.pitch;
    }
  }

  footer();
  doc.end();
  return done;
};
