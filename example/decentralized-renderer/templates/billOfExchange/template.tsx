import React, { FunctionComponent, ReactNode } from "react";
import { TemplateProps } from "../../../../src";

export interface BillOfExchangeParty {
  name?: string;
  address?: string;
  authorisedSignatoryName?: string;
  signature?: string;
}

export interface BillOfExchangeDocument {
  electronicDocumentIdentifier?: string;
  referenceNumber?: string;
  amountInFigures?: string;
  amountInWords?: string;
  currencyCode?: string;
  blDate?: string;
  placeOfIssue?: string;
  dateOfIssue?: string;
  tenor?: string;
  payee?: string;
  drawnUnder?: string;
  drawnUnderDate?: string;
  issuedBy?: string;
  drawee?: BillOfExchangeParty;
  drawer?: BillOfExchangeParty;
}

/** Matches classic BoE form dates e.g. "06 Jul 2022". */
const formatBoeDate = (input?: string): string => {
  const date = new Date(input || "");
  if (isNaN(date.getTime())) return input || "";
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
};

const formatAmountInFigures = (currencyCode?: string, amountInFigures?: string): string => {
  if (!amountInFigures && !currencyCode) return "";
  const numericAmount = Number(amountInFigures);
  const amount =
    amountInFigures && Number.isFinite(numericAmount)
      ? new Intl.NumberFormat("en-US").format(numericAmount)
      : amountInFigures || "";
  return [currencyCode, amount].filter(Boolean).join(" ");
};
};

const extractData = (document: any): BillOfExchangeDocument => {
  if (!document || typeof document !== "object") return {};
  if (document.credentialSubject && typeof document.credentialSubject === "object") {
    return document.credentialSubject as BillOfExchangeDocument;
  }
  return document as BillOfExchangeDocument;
};

const cellStyle: React.CSSProperties = {
  border: "1px solid #000",
  padding: "8px",
  verticalAlign: "top",
  textAlign: "left",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.25,
  color: "#000",
};

const valueStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 14,
  color: "#000",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const FieldCell = ({
  label,
  value,
  colSpan,
  style,
}: {
  label: string;
  value?: ReactNode;
  colSpan?: number;
  style?: React.CSSProperties;
}): JSX.Element => (
  <td colSpan={colSpan} style={{ ...cellStyle, ...style }}>
    <div style={labelStyle}>{label}</div>
    {value !== undefined && value !== null && value !== "" && <div style={valueStyle}>{value}</div>}
  </td>
);

const PartySignedCell = ({
  label,
  party,
  colSpan,
}: {
  label: string;
  party?: BillOfExchangeParty;
  colSpan?: number;
}): JSX.Element => (
  <FieldCell
    label={label}
    colSpan={colSpan}
    style={{ height: 96 }}
    value={
      party?.name || party?.address ? (
        <>
          {party.name && <div style={{ fontWeight: 500 }}>{party.name}</div>}
          {party.address && (
            <div style={{ fontSize: 12, marginTop: 4, color: "#1f2937" }}>{party.address}</div>
          )}
        </>
      ) : undefined
    }
  />
);

const SignatureImageCell = ({
  label,
  signature,
  colSpan,
}: {
  label: string;
  signature?: string;
  colSpan?: number;
}): JSX.Element => (
  <td colSpan={colSpan} style={{ ...cellStyle, height: 120 }}>
    <div style={labelStyle}>{label}</div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        minHeight: 72,
      }}
    >
      {signature ? (
        <img
          src={signature}
          alt={`${label} image`}
          style={{ maxHeight: 64, maxWidth: "100%", objectFit: "contain" }}
        />
      ) : null}
    </div>
  </td>
);

export const Template: FunctionComponent<TemplateProps<any>> = ({ document }) => {
  const data = extractData(document);
  const {
    referenceNumber,
    amountInFigures,
    amountInWords,
    currencyCode,
    blDate,
    placeOfIssue,
    dateOfIssue,
    tenor,
    payee,
    drawnUnder,
    drawnUnderDate,
    issuedBy,
    drawee,
    drawer,
  } = data;

  return (
    <div
      data-testid="bill-of-exchange-template"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#000",
        background: "#fff",
        maxWidth: 896,
        margin: "0 auto",
        padding: 16,
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          margin: "0 0 12px",
        }}
      >
        Bill of Exchange
      </h1>

      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "25%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "25%" }} />
        </colgroup>
        <tbody>
          <tr>
            <FieldCell label="Reference No." value={referenceNumber} colSpan={2} style={{ height: 52 }} />
            <FieldCell
              label="Amount in figures"
              value={formatAmountInFigures(currencyCode, amountInFigures)}
              colSpan={2}
              style={{ height: 52 }}
            />
          </tr>
          <tr>
            <FieldCell
              label="B/L Date (if applicable)"
              value={formatBoeDate(blDate)}
              colSpan={2}
              style={{ height: 52 }}
            />
            <FieldCell label="Place of issue" value={placeOfIssue} style={{ height: 52 }} />
            <FieldCell label="Date of issue" value={formatBoeDate(dateOfIssue)} style={{ height: 52 }} />
          </tr>
          <tr>
            <FieldCell label="At" value={tenor} colSpan={4} style={{ height: 52 }} />
          </tr>
          <tr>
            <FieldCell label="Pay to the order of" value={payee} colSpan={4} style={{ height: 52 }} />
          </tr>
          <tr>
            <FieldCell
              label="The sum of (amount in words)"
              value={amountInWords}
              colSpan={4}
              style={{ height: 52 }}
            />
          </tr>
          <tr>
            <FieldCell label="Drawn under" value={drawnUnder} colSpan={2} style={{ height: 64 }} />
            <FieldCell label="Dated" value={formatBoeDate(drawnUnderDate)} colSpan={2} style={{ height: 64 }} />
          </tr>
          <tr>
            <FieldCell label="Issued by" value={issuedBy} colSpan={4} style={{ height: 52 }} />
          </tr>
          <tr>
            <PartySignedCell label="Signed for and on behalf of Drawee" party={drawee} colSpan={2} />
            <PartySignedCell label="Signed for and on behalf of Drawer" party={drawer} colSpan={2} />
          </tr>
          <tr>
            <FieldCell
              label="Name of authorized signatory"
              value={drawee?.authorisedSignatoryName}
              colSpan={2}
              style={{ height: 44 }}
            />
            <FieldCell
              label="Name of authorized signatory"
              value={drawer?.authorisedSignatoryName}
              colSpan={2}
              style={{ height: 44 }}
            />
          </tr>
          <tr>
            <SignatureImageCell label="signature" signature={drawee?.signature} colSpan={2} />
            <SignatureImageCell label="Signature" signature={drawer?.signature} colSpan={2} />
          </tr>
        </tbody>
      </table>
    </div>
  );
};
