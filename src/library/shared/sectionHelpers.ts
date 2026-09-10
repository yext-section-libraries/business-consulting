import type { CSSProperties } from "react";
import {
  getSurfaceColorStyle,
  getThemeColorCssValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  type YextEntityField,
} from "@yext/visual-editor";

export type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

export type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

export type PhoneItemProps = {
  number: YextEntityField<string>;
  label?: YextEntityField<TranslatableString>;
};

export type PhoneFieldProps = {
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

/** Options formerly exposed as ThemeOptions.ASPECT_RATIO. */
export const aspectRatioOptions = [
  { label: "1:1", value: 1 },
  { label: "5:4", value: 1.25 },
  { label: "4:3", value: 1.33 },
  { label: "3:2", value: 1.5 },
  { label: "5:3", value: 1.67 },
  { label: "16:9", value: 1.78 },
  { label: "2:1", value: 2 },
  { label: "3:1", value: 3 },
  { label: "4:1", value: 4 },
  { label: "4:5", value: 0.8 },
  { label: "3:4", value: 0.75 },
  { label: "2:3", value: 0.67 },
];

export const getCardStyle = (
  backgroundColor: ThemeColor,
  padding: CSSProperties["padding"],
): CSSProperties => ({
  ...getSurfaceColorStyle(backgroundColor),
  borderRadius: "20px",
  padding,
});

export const getRichTextStyleOverrides = (
  styles: StyledTextValue,
  color?: ThemeColor | string,
) => ({
  color: getThemeColorCssValue(color),
  ...(styles.fontFamily !== "default" ? { fontFamily: styles.fontFamily } : {}),
  ...(styles.fontSize !== "default" ? { fontSize: styles.fontSize } : {}),
  ...(styles.fontStyle !== "default" ? { fontStyle: styles.fontStyle } : {}),
  ...(styles.fontWeight !== "default" ? { fontWeight: styles.fontWeight } : {}),
  ...(styles.textTransform !== "default"
    ? { textTransform: styles.textTransform }
    : {}),
});

/**
 * Produces the theme typography rules shared by custom sections. Section-only
 * layout rules can be appended by the caller.
 */
export const getScopedTypographyStyles = (
  scope: string,
  linkDecoration: CSSProperties["textDecoration"] = "underline",
): string => `
  [data-scope="${scope}"] p,
  [data-scope="${scope}"] li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  ${[1, 2, 3, 4, 5, 6]
    .map(
      (level) => `[data-scope="${scope}"] h${level} {
    font-family: var(--fontFamily-h${level}-fontFamily);
    font-size: var(--fontSize-h${level}-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h${level}-fontWeight);
    font-style: var(--fontStyle-h${level}-fontStyle);
    text-transform: var(--textTransform-h${level}-textTransform);
  }`,
    )
    .join("\n\n  ")}

  [data-scope="${scope}"] a {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: ${linkDecoration};
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
`;
