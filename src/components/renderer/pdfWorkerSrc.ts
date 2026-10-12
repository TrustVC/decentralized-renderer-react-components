// Bundlers rewrite this to a same-origin URL for the worker shipped with pdfjs-dist
// (pinned to the same version as react-pdf). Do not load it from a third-party CDN.
export const pdfWorkerSrc = new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();
