/**
 * Bundler asset imports. `bun build` copies the file next to the entry point and
 * rewrites the default export to a relative path; the dev runtime resolves it to
 * an absolute one. Either way `new URL(path, import.meta.url)` finds the file.
 */
declare module '*.ttf' {
  const path: string;
  export default path;
}

/**
 * The package ships `export = SVGtoPDF` types but a named ESM export, which Bun
 * honours and TypeScript rejects. Declare the shape we actually import.
 */
declare module 'svg-for-pdfkit' {
  export function SVGtoPDF(
    doc: unknown,
    svg: string,
    x: number,
    y: number,
    options?: {
      width?: number;
      height?: number;
      assumePt?: boolean;
      preserveAspectRatio?: string;
      fontCallback?: (
        family: string,
        weight: string,
        italic: boolean,
      ) => string;
      warningCallback?: (warning: string) => void;
    },
  ): void;
}
