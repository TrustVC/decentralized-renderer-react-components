import { readFileSync } from "fs";
import { join } from "path";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { pdfjs } from "react-pdf";
import { PdfRenderer } from "./PdfRenderer";

jest.mock("./pdfWorkerSrc", (): typeof import("./pdfWorkerSrc") => ({
  pdfWorkerSrc: "/pdf.worker.min.js",
}));

// Mock react-pdf to simulate different scenarios
jest.mock(
  "react-pdf",
  (): {
    Document: React.ComponentType<any>;
    Page: React.ComponentType<any>;
    pdfjs: any;
  } => ({
    Document: ({ children, onSourceError }: any) => {
      // Simulate error for corrupted data
      if (onSourceError) {
        setTimeout(() => {
          onSourceError(new Error("Invalid or corrupted PDF data"));
        }, 0);
      }
      return <div data-testid="pdf-document">{children}</div>;
    },
    Page: ({ pageNumber }: any) => <div data-testid={`pdf-page-${pageNumber}`}>Page {pageNumber}</div>,
    pdfjs: {
      version: "3.0.0",
      GlobalWorkerOptions: {
        workerSrc: "",
        workerPort: undefined,
      },
    },
  }),
);

describe("component PdfRenderer", () => {
  it("should load the pdf.js worker from the bundled package instead of a third-party CDN", () => {
    const source = readFileSync(join(__dirname, "pdfWorkerSrc.ts"), "utf8");
    expect(source).toContain('new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url)');
    expect(source).not.toMatch(/unpkg\.com|cdnjs\.cloudflare|jsdelivr\.net/);
    expect(pdfjs.GlobalWorkerOptions.workerSrc).toBe("/pdf.worker.min.js");
    expect(String(pdfjs.GlobalWorkerOptions.workerSrc).startsWith("//")).toBe(false);
  });

  it("should show error message for invalid base64 data like 'BASE64_ENCODED_FILE'", async () => {
    const { getByAltText } = render(
      <PdfRenderer attachment={{ type: "application/pdf", data: "BASE64_ENCODED_FILE", filename: "test.pdf" }} />,
    );

    await waitFor(() => {
      expect(getByAltText("Crash Icon")).toBeDefined();
    });
  });

  it("should show error message for empty data", async () => {
    const { getByAltText } = render(
      <PdfRenderer attachment={{ type: "application/pdf", data: "", filename: "test.pdf" }} />,
    );

    await waitFor(() => {
      expect(getByAltText("Crash Icon")).toBeDefined();
    });
  });

  it("should show error message for invalid base64 characters", async () => {
    const { getByAltText } = render(
      <PdfRenderer attachment={{ type: "application/pdf", data: "invalid!@#$%characters", filename: "test.pdf" }} />,
    );

    await waitFor(() => {
      expect(getByAltText("Crash Icon")).toBeDefined();
    });
  });
});
