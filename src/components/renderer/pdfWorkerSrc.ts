// Bundlers rewrite this to a same-origin URL for the worker shipped with pdfjs-dist
// (pinned to the same version as react-pdf). Do not load it from a third-party CDN.
// The published ESM build ships the worker beside this file (scripts/ship-pdf-worker.js).
export const pdfWorkerSrc = new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();
