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

type TypographyOverrides = Partial<Pick<
  StyledTextValue,
  "fontFamily" | "fontSize" | "fontWeight" | "fontStyle" | "textTransform"
>>;

/** Undefined and default leave each semantic CSS property active. */
export const resolveTextStyles = (styles?: TypographyOverrides) => ({
  fontFamily: styles?.fontFamily === "default" ? undefined : styles?.fontFamily,
  fontSize: styles?.fontSize === "default" ? undefined : styles?.fontSize,
  fontWeight: styles?.fontWeight === "default" ? undefined : styles?.fontWeight,
  fontStyle: styles?.fontStyle === "default" ? undefined : styles?.fontStyle,
  textTransform:
    styles?.textTransform === "default" ? undefined : styles?.textTransform,
});

export const getBodyStyleOverrides = (
  styles?: TypographyOverrides,
): CSSProperties => {
  const normalized = resolveTextStyles(styles);
  const result: Record<string, string | number | undefined> = {};
  for (const [property, value] of Object.entries(normalized)) {
    if (value !== undefined) {
      result[property] = value;
      result[`--ybc-body-${property}`] = value;
      result[`--${property}-body-${property}`] = value;
    }
  }
  return result;
};

export const getRichTextStyleOverrides = (
  styles?: TypographyOverrides,
  color?: ThemeColor | string,
) => ({
  color: getThemeColorCssValue(color),
  ...resolveTextStyles(styles),
});

/** Only link decoration is section-specific; typography lives in shared CSS. */
export const getScopedTypographyStyles = (
  scope: string,
  linkDecoration: CSSProperties["textDecoration"] = "underline",
): string => `
  [data-scope="${scope}"] a { text-decoration: ${linkDecoration}; }
`;
