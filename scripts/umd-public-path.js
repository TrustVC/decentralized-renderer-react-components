// UMD entry only. Chunks and the pdf.js worker load relative to this bundle.
// The capture block is also prepended outside the UMD factory so it runs while
// document.currentScript is this file, before an AMD loader defers the factory.
// A host can set __decentralizedRendererBundleSrc before load. Node and SSR have
// no document, so they skip this instead of throwing at require time.
/* amd-capture:start */
(function () {
  if (typeof document === "undefined") return;
  var root = typeof self !== "undefined" ? self : this;
  if (!root || root.__decentralizedRendererBundleSrc) return;
  if (!document.currentScript || !document.currentScript.src) return;
  root.__decentralizedRendererBundleSrc = document.currentScript.src;
})();
/* amd-capture:end */
if (typeof document !== "undefined") {
  var root = typeof self !== "undefined" ? self : this;
  var bundleSrc = root && root.__decentralizedRendererBundleSrc;
  if (!bundleSrc && document.currentScript && document.currentScript.src) {
    bundleSrc = document.currentScript.src;
  }
  if (bundleSrc) {
    __webpack_public_path__ = String(bundleSrc).replace(/[?#].*$/, "").replace(/[^/]*$/, "");
  }
}
