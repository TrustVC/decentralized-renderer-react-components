import React from "react";
import { TemplateProps, TemplateWithComponent } from "./types";
import { getTemplateUrl } from "./utils";
import NotificationBanner from "./components/NotificationBanner";

const container = {
  marginRight: "auto",
  marginLeft: "auto",
};

const textColor = `#333`;
const paddingBox = `.75rem 1.25rem`;

export interface ConnectionFailureProps {
  source?: string;
}

export const ConnectionFailureTemplate: React.FunctionComponent<ConnectionFailureProps> = (props) => {
  return (
    <div style={{ ...container, fontFamily: "Arial", wordBreak: "break-all" }}>
      <div style={{ backgroundColor: "#FDFDEA", borderLeft: "2px solid #8E4B10", padding: "16px 16px 16px 18px" }}>
        <p style={{ margin: "0px", lineHeight: "21px", fontSize: "16px", color: "#8E4B10", fontWeight: "700" }}>
          This document might be having loading issues
        </p>
        <p style={{ margin: "0px", lineHeight: "21px", fontSize: "14px", color: "#374151", marginTop: "6px" }}>
          Try refreshing the page or check your internet connection. If the issue continues, please contact the issuer
          with the information below:
          <br />
          <br />
          <span style={{ fontFamily: "Courier" }}>Template URL: &quot;{props.source}&quot;</span>
        </p>
      </div>
    </div>
  );
};

export const DefaultTemplate: React.FunctionComponent<TemplateProps<any>> = (props) => {
  return (
    <div id="default-template">
      <div style={{ ...container, ...{ color: textColor } }}>
        <NotificationBanner notificationType={props.errorType} templateURL={getTemplateUrl(props.document)} />
        <pre
          style={{
            backgroundColor: "#f7f8fc",
            padding: paddingBox,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {JSON.stringify(props.document, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const defaultTemplate: TemplateWithComponent<any> = {
  id: "default-template",
  label: "Default",
  template: DefaultTemplate,
};
