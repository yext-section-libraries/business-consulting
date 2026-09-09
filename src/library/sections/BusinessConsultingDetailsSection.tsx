import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import {
  AnalyticsScopeProvider,
  Address,
  HoursTable,
  Link,
  type AddressType,
  type HoursType,
} from "@yext/pages-components";
import {
  Background,
  ComprehensiveCTA,
  EntityField,
  MaybeRTF,
  VisibilityWrapper,
  YextComponentConfig,
  YextEntityField,
  YextFields,
  getDefaultRTF,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  type ComprehensiveCTAValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  useDocument,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type PhoneItemProps = {
  number: YextEntityField<string>;
  label?: YextEntityField<TranslatableString>;
};

type PhoneFieldProps = {
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

type HoursStyles = {
  startOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | "today";
  collapseDays: boolean;
  showAdditionalHoursText: boolean;
  alignment: "items-start" | "items-center" | "items-end";
};

type StyledTextListProps = {
  text: YextEntityField<TranslatableString[]>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type DetailsLabels = {
  locationInformation: {
    text: YextEntityField<TranslatableString>;
  };
  baseHub: StyledTextProps;
  serviceRadius: StyledTextProps;
  serviceHours: {
    text: YextEntityField<TranslatableString>;
  };
  complimentaryServices: {
    text: YextEntityField<TranslatableString>;
  };
};

export type BusinessConsultingDetailsSectionProps = {
  heading: StyledTextProps;
  detailsLabels: DetailsLabels;
  cardHeaderStyles: {
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  address: YextEntityField<AddressType>;
  showRegion: boolean;
  showCountry: boolean;
  bookingPhone: PhoneFieldProps;
  detailsNote: StyledRtfProps;
  hours: YextEntityField<HoursType>;
  hoursStyles: HoursStyles;
  complimentaryServices: StyledTextListProps;
  cta: ComprehensiveCTAValue;
  cardBackgroundColor: ThemeColor;
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const BusinessConsultingDetailsSectionFields: YextFields<BusinessConsultingDetailsSectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
    heading: {
      label: "Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    detailsLabels: {
      label: "Details Labels",
      type: "object",
      objectFields: {
        locationInformation: {
          label: "Location Information",
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: "Text",
              filter: { types: ["type.string"] },
            },
          },
        },
        baseHub: {
          label: "Base Hub Label",
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: "Text",
              filter: { types: ["type.string"] },
            },
            styles: { label: "Text Styles", type: "styledText" },
            fontColor: {
              label: "Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        serviceRadius: {
          label: "Service Radius Note",
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: "Text",
              filter: { types: ["type.string"] },
            },
            styles: { label: "Text Styles", type: "styledText" },
            fontColor: {
              label: "Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        serviceHours: {
          label: "Service Hours Heading",
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: "Text",
              filter: { types: ["type.string"] },
            },
          },
        },
        complimentaryServices: {
          label: "Complimentary Services Heading",
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: "Text",
              filter: { types: ["type.string"] },
            },
          },
        },
      },
    },
    cardHeaderStyles: {
      label: "Card Header Styles",
      type: "object",
      objectFields: {
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    address: {
      type: "entityField",
      label: "Address",
      filter: { types: ["type.address"] },
    },
    showRegion: {
      label: "Show Region",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showCountry: {
      label: "Show Country",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    bookingPhone: {
      label: "Booking Phone",
      type: "object",
      objectFields: {
        items: {
          label: "Items",
          type: "array",
          arrayFields: {
            number: {
              type: "entityField",
              label: "Number",
              filter: {
                types: ["type.phone"],
              },
            },
            label: {
              label: "Label",
              type: "entityField",
              filter: {
                types: ["type.string"],
              },
            },
          },
          defaultItemProps: {
            number: {
              field: "",
              constantValue: "",
              constantValueEnabled: true,
            } as YextEntityField<string>,
            label: {
              field: "",
              constantValue: {
                defaultValue: "",
                hasLocalizedValue: "true",
              },
              constantValueEnabled: true,
            },
          },
          getItemSummary: (item: PhoneItemProps) =>
            (typeof item.label?.constantValue === "string"
              ? item.label.constantValue
              : item.label?.constantValue?.defaultValue) ||
            item.number.constantValue ||
            item.number.field ||
            "Phone",
        },
        phoneFormat: {
          label: "Phone Format",
          type: "radio",
          options: [
            { label: "Domestic", value: "domestic" },
            { label: "International", value: "international" },
          ],
        },
        includeHyperlink: {
          label: "Include Hyperlink",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    detailsNote: {
      label: "Details Note",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.rich_text_v2"] },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    hours: {
      type: "entityField",
      label: "Hours",
      filter: { types: ["type.hours"] },
      disableConstantValueToggle: true,
    },
    hoursStyles: {
      label: "Hours Styles",
      type: "object",
      objectFields: {
        startOfWeek: {
          label: "Start Of Week",
          type: "select",
          options: [
            { label: "Monday", value: "monday" },
            { label: "Tuesday", value: "tuesday" },
            { label: "Wednesday", value: "wednesday" },
            { label: "Thursday", value: "thursday" },
            { label: "Friday", value: "friday" },
            { label: "Saturday", value: "saturday" },
            { label: "Sunday", value: "sunday" },
            { label: "Today", value: "today" },
          ],
        },
        collapseDays: {
          label: "Collapse Days",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        showAdditionalHoursText: {
          label: "Show Additional Hours Text",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        alignment: {
          label: "Alignment",
          type: "select",
          options: [
            { label: "Start", value: "items-start" },
            { label: "Center", value: "items-center" },
            { label: "End", value: "items-end" },
          ],
        },
      },
    },
    complimentaryServices: {
      label: "Complimentary Services",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text List",
          filter: {
            types: ["type.string"],
            includeListsOnly: true,
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    cta: {
      label: "Call to Action",
      type: "comprehensiveCTA",
    },
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
  };

const formatPhone = (
  value: string,
  format: "international" | "domestic" = "domestic",
) => {
  const parsed = parsePhoneNumber(
    value.replace(/(?!^\+)\+|[^\d+]/g, ""),
  );
  if (!parsed.valid || parsed.number === undefined) {
    return value;
  }

  return format === "international"
    ? parsed.number.international
    : parsed.number.national;
};

const cardStyle = (backgroundColor: ThemeColor): React.CSSProperties => ({
  ...getSurfaceColorStyle(backgroundColor),
  borderRadius: "20px",
  padding: "24px",
});

const defaultDetailsLabelStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const defaultDetailsLabels: DetailsLabels = {
  locationInformation: {
    text: {
      field: "",
      constantValue: {
        defaultValue: "Location Information",
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
  },
  baseHub: {
    text: {
      field: "",
      constantValue: {
        defaultValue: "Base Hub",
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
    styles: {
      ...defaultDetailsLabelStyles,
      fontSize: "13px",
      fontWeight: "600",
    },
  },
  serviceRadius: {
    text: {
      field: "",
      constantValue: {
        defaultValue: "(Serving a 20-mile radius)",
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
    styles: defaultDetailsLabelStyles,
  },
  serviceHours: {
    text: {
      field: "",
      constantValue: {
        defaultValue: "Dispatch & Service Hours",
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
  },
  complimentaryServices: {
    text: {
      field: "",
      constantValue: {
        defaultValue: "Complimentary Services",
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
  },
};

const detailsSectionScope = "ybc-details-section";

const detailsSectionScopedTypographyStyles = `
  [data-scope="${detailsSectionScope}"] {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${detailsSectionScope}"] p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${detailsSectionScope}"] li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${detailsSectionScope}"] h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  [data-scope="${detailsSectionScope}"] h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  [data-scope="${detailsSectionScope}"] h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  [data-scope="${detailsSectionScope}"] h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  [data-scope="${detailsSectionScope}"] h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  [data-scope="${detailsSectionScope}"] h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  [data-scope="${detailsSectionScope}"] a {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: underline;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
`;

const BusinessConsultingDetailsSectionComponent: PuckComponent<BusinessConsultingDetailsSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const resolvedHeading =
      resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const detailsLabels = props.detailsLabels ?? defaultDetailsLabels;
    const cardForeground = props.cardBackgroundColor.contrastingColor;
    const locationInformation =
      resolveComponentData(
        detailsLabels.locationInformation.text,
        locale,
        streamDocument,
      ) || "";
    const baseHub =
      resolveComponentData(detailsLabels.baseHub.text, locale, streamDocument) || "";
    const serviceRadius =
      resolveComponentData(
        detailsLabels.serviceRadius.text,
        locale,
        streamDocument,
      ) || "";
    const serviceHours =
      resolveComponentData(
        detailsLabels.serviceHours.text,
        locale,
        streamDocument,
      ) || "";
    const complimentaryServices =
      resolveComponentData(
        detailsLabels.complimentaryServices.text,
        locale,
        streamDocument,
      ) || "";
    const cardHeaderStyle: React.CSSProperties = {
      color: getThemeColorCssValue(
        props.cardHeaderStyles.fontColor ?? cardForeground,
      ),
      margin: 0,
      ...(props.cardHeaderStyles.styles.fontFamily !== "default"
        ? { fontFamily: props.cardHeaderStyles.styles.fontFamily }
        : {}),
      ...(props.cardHeaderStyles.styles.fontSize !== "default"
        ? { fontSize: props.cardHeaderStyles.styles.fontSize }
        : {}),
      ...(props.cardHeaderStyles.styles.fontStyle !== "default"
        ? { fontStyle: props.cardHeaderStyles.styles.fontStyle }
        : {}),
      ...(props.cardHeaderStyles.styles.fontWeight !== "default"
        ? { fontWeight: props.cardHeaderStyles.styles.fontWeight }
        : {}),
      ...(props.cardHeaderStyles.styles.textTransform !== "default"
        ? { textTransform: props.cardHeaderStyles.styles.textTransform }
        : {}),
    };
    const baseHubStyle: React.CSSProperties = {
      color: getThemeColorCssValue(detailsLabels.baseHub.fontColor ?? cardForeground),
      margin: 0,
      ...(detailsLabels.baseHub.styles.fontFamily !== "default"
        ? { fontFamily: detailsLabels.baseHub.styles.fontFamily }
        : {}),
      ...(detailsLabels.baseHub.styles.fontSize !== "default"
        ? { fontSize: detailsLabels.baseHub.styles.fontSize }
        : {}),
      ...(detailsLabels.baseHub.styles.fontStyle !== "default"
        ? { fontStyle: detailsLabels.baseHub.styles.fontStyle }
        : {}),
      ...(detailsLabels.baseHub.styles.fontWeight !== "default"
        ? { fontWeight: detailsLabels.baseHub.styles.fontWeight }
        : {}),
      ...(detailsLabels.baseHub.styles.textTransform !== "default"
        ? { textTransform: detailsLabels.baseHub.styles.textTransform }
        : {}),
    };
    const serviceRadiusStyle: React.CSSProperties = {
      color: getThemeColorCssValue(
        detailsLabels.serviceRadius.fontColor ?? cardForeground,
      ),
      margin: "8px 0 0",
      ...(detailsLabels.serviceRadius.styles.fontFamily !== "default"
        ? { fontFamily: detailsLabels.serviceRadius.styles.fontFamily }
        : {}),
      ...(detailsLabels.serviceRadius.styles.fontSize !== "default"
        ? { fontSize: detailsLabels.serviceRadius.styles.fontSize }
        : {}),
      ...(detailsLabels.serviceRadius.styles.fontStyle !== "default"
        ? { fontStyle: detailsLabels.serviceRadius.styles.fontStyle }
        : {}),
      ...(detailsLabels.serviceRadius.styles.fontWeight !== "default"
        ? { fontWeight: detailsLabels.serviceRadius.styles.fontWeight }
        : {}),
      ...(detailsLabels.serviceRadius.styles.textTransform !== "default"
        ? { textTransform: detailsLabels.serviceRadius.styles.textTransform }
        : {}),
    };
    const resolvedAddress = resolveComponentData(props.address, locale, streamDocument);
    const resolvedPhoneItems = (props.bookingPhone.items ?? [])
      .map((item) => {
        const resolvedNumber = resolveComponentData(
          item.number,
          locale,
          streamDocument,
        );
        const normalizedNumber =
          typeof resolvedNumber === "string" ? resolvedNumber.trim() : "";
        const resolvedLabel = item.label
          ? resolveComponentData(item.label, locale, streamDocument)
          : "";
        const normalizedLabel =
          typeof resolvedLabel === "string" ? resolvedLabel.trim() : "";

        if (!normalizedNumber) {
          return null;
        }

        return {
          label: normalizedLabel,
          originalNumber: normalizedNumber,
          formattedNumber: formatPhone(
            normalizedNumber,
            props.bookingPhone.phoneFormat,
          ),
          telDigits: normalizedNumber.replace(/\D/g, ""),
          labelField: item.label,
          numberField: item.number,
        };
      })
      .filter(
        (
          item,
        ): item is {
          label: string;
          originalNumber: string;
          formattedNumber: string;
          telDigits: string;
          labelField: YextEntityField<TranslatableString> | undefined;
          numberField: YextEntityField<string>;
        } => item !== null,
      );
    const noteStyleOverrides = {
      color: getThemeColorCssValue(
        props.detailsNote.fontColor ?? props.cardBackgroundColor.contrastingColor,
      ),
      ...(props.detailsNote.styles.fontFamily !== "default"
        ? { fontFamily: props.detailsNote.styles.fontFamily }
        : {}),
      ...(props.detailsNote.styles.fontSize !== "default"
        ? { fontSize: props.detailsNote.styles.fontSize }
        : {}),
      ...(props.detailsNote.styles.fontStyle !== "default"
        ? { fontStyle: props.detailsNote.styles.fontStyle }
        : {}),
      ...(props.detailsNote.styles.fontWeight !== "default"
        ? { fontWeight: props.detailsNote.styles.fontWeight }
        : {}),
      ...(props.detailsNote.styles.textTransform !== "default"
        ? { textTransform: props.detailsNote.styles.textTransform }
        : {}),
    };
    const resolvedNote = resolveComponentData(
      props.detailsNote.text,
      locale,
      streamDocument,
      {
        richTextStyleOverrides: noteStyleOverrides,
      },
    );
    const resolvedHours = resolveComponentData(
      props.hours,
      locale,
      streamDocument,
    ) as HoursType | undefined;
    const additionalHoursText =
      typeof streamDocument.additionalHoursText === "string"
        ? streamDocument.additionalHoursText.trim()
        : "";
    const resolvedServiceItems =
      resolveComponentData(
        props.complimentaryServices.text,
        locale,
        streamDocument,
      ) || [];
    const serviceItems = resolvedServiceItems
      .map((item) =>
        typeof item === "string" ? item : item.defaultValue ?? "",
      )
      .filter((item) => item.length > 0);
    const complimentaryServiceItemStyle: React.CSSProperties = {
      ...(props.complimentaryServices.styles.fontFamily !== "default"
        ? { fontFamily: props.complimentaryServices.styles.fontFamily }
        : {}),
      ...(props.complimentaryServices.styles.fontSize !== "default"
        ? { fontSize: props.complimentaryServices.styles.fontSize }
        : {}),
      ...(props.complimentaryServices.styles.fontStyle !== "default"
        ? { fontStyle: props.complimentaryServices.styles.fontStyle }
        : {}),
      ...(props.complimentaryServices.styles.fontWeight !== "default"
        ? { fontWeight: props.complimentaryServices.styles.fontWeight }
        : {}),
      ...(props.complimentaryServices.styles.textTransform !== "default"
        ? { textTransform: props.complimentaryServices.styles.textTransform }
        : {}),
    };
    const alignItemsMap: Record<HoursStyles["alignment"], React.CSSProperties["alignItems"]> = {
      "items-start": "flex-start",
      "items-center": "center",
      "items-end": "flex-end",
    };

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`BusinessConsultingDetailsSection${getAnalyticsScopeHash(props.id)}`}
        >
          <Background
            as="section"
            background={props.section.backgroundColor}
            data-scope={detailsSectionScope}
            style={{
              ...getSurfaceColorStyle(
                props.section.backgroundColor,
                streamDocument,
              ),
              padding: "72px 24px",
            }}
          >
            <style>{detailsSectionScopedTypographyStyles}</style>
            <div style={{ margin: "0 auto", maxWidth: "1280px" }}>
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  style={{
                    color: getThemeColorCssValue(
                      props.heading.fontColor ??
                        props.section.backgroundColor.contrastingColor,
                    ),
                    margin: "0 0 28px",
                    textAlign: "center",
                    ...(props.heading.styles.fontFamily !== "default"
                      ? { fontFamily: props.heading.styles.fontFamily }
                      : {}),
                    ...(props.heading.styles.fontSize !== "default"
                      ? { fontSize: props.heading.styles.fontSize }
                      : {}),
                    ...(props.heading.styles.fontStyle !== "default"
                      ? { fontStyle: props.heading.styles.fontStyle }
                      : {}),
                    ...(props.heading.styles.fontWeight !== "default"
                      ? { fontWeight: props.heading.styles.fontWeight }
                      : {}),
                    ...(props.heading.styles.textTransform !== "default"
                      ? { textTransform: props.heading.styles.textTransform }
                      : {}),
                  }}
                >
                  {resolvedHeading}
                </h2>
              </EntityField>
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                }}
              >
                <Background
                  background={props.cardBackgroundColor}
                  style={cardStyle(props.cardBackgroundColor)}
                >
                  <EntityField
                    displayName="Location Information"
                    fieldId={detailsLabels.locationInformation.text.field}
                    constantValueEnabled={
                      detailsLabels.locationInformation.text.constantValueEnabled
                    }
                  >
                    <h3 style={cardHeaderStyle}>{locationInformation}</h3>
                  </EntityField>
                  <div style={{ marginTop: "18px" }}>
                    <EntityField
                      displayName="Base Hub Label"
                      fieldId={detailsLabels.baseHub.text.field}
                      constantValueEnabled={
                        detailsLabels.baseHub.text.constantValueEnabled
                      }
                    >
                      <p style={baseHubStyle}>{baseHub}</p>
                    </EntityField>
                    {resolvedAddress ? (
                      <EntityField
                        displayName="Address"
                        fieldId={props.address.field}
                        constantValueEnabled={props.address.constantValueEnabled}
                      >
                        <div style={{ marginTop: "8px" }}>
                          <Address
                            address={resolvedAddress}
                            showRegion={props.showRegion}
                            showCountry={props.showCountry}
                          />
                        </div>
                      </EntityField>
                    ) : null}
                    <EntityField
                      displayName="Service Radius Note"
                      fieldId={detailsLabels.serviceRadius.text.field}
                      constantValueEnabled={
                        detailsLabels.serviceRadius.text.constantValueEnabled
                      }
                    >
                      <p style={serviceRadiusStyle}>{serviceRadius}</p>
                    </EntityField>
                  </div>
                  <div style={{ marginTop: "22px" }}>
                    {resolvedPhoneItems.map((item) => {
                      const content = (
                        <>
                          {item.label && item.labelField ? (
                            <>
                              <EntityField
                                displayName="Booking Phone Label"
                                fieldId={item.labelField.field}
                                constantValueEnabled={
                                  item.labelField.constantValueEnabled
                                }
                              >
                                <span>{item.label}</span>
                              </EntityField>{" "}
                            </>
                          ) : null}
                          <EntityField
                            displayName="Booking Phone Number"
                            fieldId={item.numberField.field}
                            constantValueEnabled={
                              item.numberField.constantValueEnabled
                            }
                          >
                            <span>{item.formattedNumber}</span>
                          </EntityField>
                        </>
                      );

                      return (
                        <React.Fragment
                          key={`${item.label}-${item.originalNumber}`}
                        >
                          {!props.bookingPhone.includeHyperlink || !item.telDigits ? (
                            <p
                              style={{
                                color: getThemeColorCssValue(cardForeground),
                                display: "inline-block",
                                margin: "8px 0 0",
                              }}
                            >
                              {content}
                            </p>
                          ) : (
                            <p
                              style={{
                                display: "inline-block",
                                margin: "8px 0 0",
                              }}
                            >
                              <Link
                                cta={{ link: item.telDigits, linkType: "PHONE" }}
                                eventName="cta"
                                style={{
                                  color: getThemeColorCssValue(cardForeground),
                                  display: "inline-block",
                                }}
                              >
                                {content}
                              </Link>
                            </p>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: "22px" }}>
                    <EntityField
                      displayName="Call to Action"
                      fieldId={props.cta.data.cta.field}
                      constantValueEnabled={
                        props.cta.data.cta.constantValueEnabled
                      }
                    >
                      <ComprehensiveCTA
                        value={{
                          data: props.cta.data,
                          styles: props.cta.styles,
                        }}
                        eventName="cta"
                        style={{
                          alignItems: "center",
                          borderRadius: "999px",
                          display: "inline-flex",
                          minHeight: "44px",
                          padding: "12px 16px",
                          textDecoration: "none",
                        }}
                      />
                    </EntityField>
                  </div>
                </Background>
                <article style={cardStyle(props.cardBackgroundColor)}>
                  <EntityField
                    displayName="Service Hours Heading"
                    fieldId={detailsLabels.serviceHours.text.field}
                    constantValueEnabled={
                      detailsLabels.serviceHours.text.constantValueEnabled
                    }
                  >
                    <h3 style={cardHeaderStyle}>{serviceHours}</h3>
                  </EntityField>
                  {resolvedHours ? (
                    <EntityField
                      displayName="Hours"
                      fieldId={props.hours.field}
                      constantValueEnabled={props.hours.constantValueEnabled}
                    >
                      <div
                        style={{
                          alignItems: alignItemsMap[props.hoursStyles.alignment],
                          display: "flex",
                          flexDirection: "column",
                          marginTop: "18px",
                        }}
                      >
                        <HoursTable
                          hours={resolvedHours}
                          startOfWeek={props.hoursStyles.startOfWeek}
                          collapseDays={props.hoursStyles.collapseDays}
                          className=""
                          comingSoon={streamDocument.comingSoon}
                        />
                        {props.hoursStyles.showAdditionalHoursText && additionalHoursText ? (
                          <p style={{ margin: "12px 0 0" }}>
                            {additionalHoursText}
                          </p>
                        ) : null}
                      </div>
                    </EntityField>
                  ) : null}
                  <EntityField
                    displayName="Details Note"
                    fieldId={props.detailsNote.text.field}
                    constantValueEnabled={props.detailsNote.text.constantValueEnabled}
                  >
                    <div style={{ marginTop: "18px" }}>
                      {React.isValidElement(resolvedNote) ? (
                        resolvedNote
                      ) : (
                        <MaybeRTF
                          data={typeof resolvedNote === "string" ? resolvedNote : ""}
                          richTextStyleOverrides={noteStyleOverrides}
                        />
                      )}
                    </div>
                  </EntityField>
                </article>
                <article style={cardStyle(props.cardBackgroundColor)}>
                  <EntityField
                    displayName="Complimentary Services Heading"
                    fieldId={detailsLabels.complimentaryServices.text.field}
                    constantValueEnabled={
                      detailsLabels.complimentaryServices.text.constantValueEnabled
                    }
                  >
                    <h3 style={cardHeaderStyle}>
                      {complimentaryServices}
                    </h3>
                  </EntityField>
                  <EntityField
                    displayName="Text List"
                    fieldId={props.complimentaryServices.text.field}
                    constantValueEnabled={
                      props.complimentaryServices.text.constantValueEnabled
                    }
                  >
                    <ul
                      style={{
                        color: getThemeColorCssValue(
                          props.complimentaryServices.fontColor ??
                            props.cardBackgroundColor.contrastingColor,
                        ),
                        margin: "18px 0 0",
                        paddingLeft: "18px",
                      }}
                    >
                      {serviceItems.map((item, index) => (
                        <li key={`${item}-${index}`} style={complimentaryServiceItemStyle}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </EntityField>
                </article>
              </div>
            </div>
          </Background>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const BusinessConsultingDetailsSection: YextComponentConfig<BusinessConsultingDetailsSectionProps> =
  {
    label: "Details Section",
    fields: BusinessConsultingDetailsSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Location Details",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
      },
      detailsLabels: defaultDetailsLabels,
      cardHeaderStyles: {
        styles: defaultDetailsLabelStyles,
      },
      address: {
        field: "address",
        constantValue: {
          line1: "",
          city: "",
          postalCode: "",
          countryCode: "",
          region: "",
        },
        constantValueEnabled: false,
      },
      showRegion: true,
      showCountry: false,
      bookingPhone: {
        items: [
          {
            number: {
              field: "mainPhone",
              constantValue: "",
              constantValueEnabled: false,
            },
            label: {
              field: "",
              constantValue: {
                defaultValue: "Booking Desk",
                hasLocalizedValue: "true",
              },
              constantValueEnabled: true,
            },
          },
        ],
        phoneFormat: "domestic",
        includeHyperlink: true,
      },
      detailsNote: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Emergency De-Matting/Skunk Baths: Priority scheduling for existing members",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
      },
      hours: {
        field: "hours",
        constantValue: {},
        constantValueEnabled: false,
      },
      hoursStyles: {
        startOfWeek: "monday",
        collapseDays: false,
        showAdditionalHoursText: false,
        alignment: "items-start",
      },
      complimentaryServices: {
        text: {
          field: "",
          constantValue: [
            "Hydro-Massage Bath",
            "Premium Tearless Blueberry Facial",
            "Blow Dry (No Cage Drying, Ever)",
            "Custom Bandana or Bow",
            "De-Shedding Consultation & Coat Health Check",
            "Free cancellation up to 24 hours prior to scheduled arrival",
            "Fully self-powered and climate-controlled mobile grooming vans (No hookups required), accommodating dogs up to 75 lbs.",
          ],
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
      },
      cta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              label: "Check Your Zip Code",
              link: "#",
              linkType: "URL",
              ctaType: "textAndLink",
            },
            constantValueEnabled: true,
            selectedType: "textAndLink",
          },
          openInNewTab: false,
        },
        styles: {
          variant: "primary",
          color: {
            selectedColor: "palette-primary",
            contrastingColor: "palette-primary-contrast",
          },
        },
      },
      cardBackgroundColor: {
        selectedColor: "white",
        contrastingColor: "black",
      },
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
      },
    },
    render: (props) => <BusinessConsultingDetailsSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "BusinessConsultingDetailsSection",
  displayName: "Details Section",
  description: "Details Section",
  pageSetTypes: ["ENTITY"],
};
