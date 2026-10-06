import * as React from "react";
import { MaybeRTF } from "@yext/visual-editor";
import { getBodyStyleOverrides, getRichTextStyleOverrides } from "./sectionHelpers";
import "./typography.css";

type Overrides = ReturnType<typeof getRichTextStyleOverrides>;

/** Forward field overrides into resolved renderers and their inner body wrappers. */
const applyOverrides = (
  node: React.ReactNode,
  overrides: Overrides,
): React.ReactNode => {
  if (!React.isValidElement(node)) return node;
  const element = node as React.ReactElement<{
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    richTextStyleOverrides?: Overrides;
  }>;
  const style = {
    ...element.props.style,
    ...getBodyStyleOverrides(overrides),
    color: overrides.color,
  };
  const children = element.props.children === undefined
    ? undefined
    : React.Children.map(element.props.children, (child) =>
        applyOverrides(child, overrides),
      );
  if (element.type === MaybeRTF) {
    return React.cloneElement(element, {
      richTextStyleOverrides: {
        ...element.props.richTextStyleOverrides,
        ...overrides,
      },
      style,
    });
  }
  if (element.props.className?.includes("rtf-wrapper")) {
    return React.cloneElement(element, { style, children });
  }
  return children === undefined
    ? element
    : React.cloneElement(element, { children });
};

export const ResolvedRichText = ({ content, overrides }: {
  content: unknown;
  overrides: Overrides;
}) => {
  const data = typeof content === "string" ||
    (content && typeof content === "object" && "html" in content)
      ? content as string | { html: string }
      : "";

  return (
    <div
      className="ybc-body"
      style={{ ...getBodyStyleOverrides(overrides), color: overrides.color }}
    >
      {React.isValidElement(content) ? (
        applyOverrides(content, overrides)
      ) : (
        <MaybeRTF
          data={data}
          richTextStyleOverrides={overrides}
          style={getBodyStyleOverrides(overrides)}
        />
      )}
    </div>
  );
};
