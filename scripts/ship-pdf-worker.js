// Ships the pdf.js worker inside build/esm and points pdfWorkerSrc at it with a relative URL,
// so consumers' bundlers emit it from the package itself instead of resolving "pdfjs-dist" again.
const fs = require("fs");
const path = require("path");

const SPECIFIER = "pdfjs-dist/build/pdf.worker.min.js";
const rendererDir = path.join(__dirname, "..", "build", "esm", "components", "renderer");
const moduleFile = path.join(rendererDir, "pdfWorkerSrc.js");

const source = fs.readFileSync(moduleFile, "utf8");
if (!source.includes(`"${SPECIFIER}"`)) {
  throw new Error(`${moduleFile} no longer references "${SPECIFIER}"`);
}

fs.copyFileSync(require.resolve(SPECIFIER), path.join(rendererDir, "pdf.worker.min.js"));
fs.writeFileSync(moduleFile, source.replace(`"${SPECIFIER}"`, '"./pdf.worker.min.js"'));
