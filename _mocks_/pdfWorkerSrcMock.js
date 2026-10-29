// Jest can't parse import.meta.url in CommonJS; the real worker URL is resolved by bundlers.
module.exports = { pdfWorkerSrc: "/pdf.worker.min.js" };
