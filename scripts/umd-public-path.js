// UMD entry only. Load chunks and the pdf.js worker relative to the script that loaded this
// bundle. Node and SSR have no document, so they skip this instead of throwing at require time.
if (typeof document !== "undefined") {
  const scripts = document.getElementsByTagName("script");
  const script = document.currentScript || scripts[scripts.length - 1];
  if (script && script.src) {
    __webpack_public_path__ = script.src.replace(/[?#].*$/, "").replace(/[^/]*$/, "");
  }
}
