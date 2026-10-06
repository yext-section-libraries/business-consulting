import { resolveTextStyles } from "../shared/sectionHelpers";
import { ResolvedRichText } from "../shared/ResolvedRichText";
import "../shared/typography.css";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  Address,
  HoursTable,
  Link,
  type AddressType,
  type HoursTableIntervalTranslations,
  type HoursType,
} from "@yext/pages-components";
import { useTranslation } from "react-i18next";
import {
  msg,
  Background,
  ComprehensiveCTA,
  EntityField,
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
  type TranslatableString,
  useDocument,
} from "@yext/visual-editor";
import { formatPhoneNumber } from "@yext/visual-editor/section-library-support";
import {
  getCardStyle,
  getRichTextStyleOverrides,
  type PhoneFieldProps,
  type PhoneItemProps,
  type StyledRtfProps,
  type StyledTextProps,
} from "../shared/sectionHelpers";

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
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
    heading: {
      label: msg("fields.heading", "Heading"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: { types: ["type.string"] },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    detailsLabels: {
      label: msg("fields.detailsLabels", "Details Labels"),
      type: "object",
      objectFields: {
        locationInformation: {
          label: msg("fields.locationInformation", "Location Information"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.text", "Text"),
              filter: { types: ["type.string"] },
            },
          },
        },
        baseHub: {
          label: msg("fields.baseHubLabel", "Base Hub Label"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.text", "Text"),
              filter: { types: ["type.string"] },
            },
            styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        serviceRadius: {
          label: msg("fields.serviceRadiusNote", "Service Radius Note"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.text", "Text"),
              filter: { types: ["type.string"] },
            },
            styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        serviceHours: {
          label: msg("fields.serviceHoursHeading", "Service Hours Heading"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.text", "Text"),
              filter: { types: ["type.string"] },
            },
          },
        },
        complimentaryServices: {
          label: msg("fields.complimentaryServicesHeading", "Complimentary Services Heading"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.text", "Text"),
              filter: { types: ["type.string"] },
            },
          },
        },
      },
    },
    cardHeaderStyles: {
      label: msg("fields.cardHeaderStyles", "Card Header Styles"),
      type: "object",
      objectFields: {
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    address: {
      type: "entityField",
      label: msg("fields.address", "Address"),
      filter: { types: ["type.address"] },
    },
    showRegion: {
      label: msg("fields.showRegion", "Show Region"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
    },
    showCountry: {
      label: msg("fields.showCountry", "Show Country"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
    },
    bookingPhone: {
      label: msg("fields.bookingPhone", "Booking Phone"),
      type: "object",
      objectFields: {
        items: {
          label: msg("fields.items", "Items"),
          type: "array",
          arrayFields: {
            number: {
              type: "entityField",
              label: msg("fields.number", "Number"),
              filter: {
                types: ["type.phone"],
              },
            },
            label: {
              label: msg("fields.label", "Label"),
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
          label: msg("fields.phoneFormat", "Phone Format"),
          type: "radio",
          options: [
            { label: msg("fields.options.domestic", "Domestic"), value: "domestic" },
            { label: msg("fields.options.international", "International"), value: "international" },
          ],
        },
        includeHyperlink: {
          label: msg("fields.includeHyperlink", "Include Hyperlink"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
    detailsNote: {
      label: msg("fields.detailsNote", "Details Note"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: { types: ["type.rich_text_v2"] },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    hours: {
      type: "entityField",
      label: msg("fields.hours", "Hours"),
      filter: { types: ["type.hours"] },
      disableConstantValueToggle: true,
    },
    hoursStyles: {
      label: msg("fields.hoursStyles", "Hours Styles"),
      type: "object",
      objectFields: {
        startOfWeek: {
          label: msg("fields.startOfWeek", "Start Of Week"),
          type: "select",
          options: [
            { label: msg("fields.options.monday", "Monday"), value: "monday" },
            { label: msg("fields.options.tuesday", "Tuesday"), value: "tuesday" },
            { label: msg("fields.options.wednesday", "Wednesday"), value: "wednesday" },
            { label: msg("fields.options.thursday", "Thursday"), value: "thursday" },
            { label: msg("fields.options.friday", "Friday"), value: "friday" },
            { label: msg("fields.options.saturday", "Saturday"), value: "saturday" },
            { label: msg("fields.options.sunday", "Sunday"), value: "sunday" },
            { label: msg("fields.options.today", "Today"), value: "today" },
          ],
        },
        collapseDays: {
          label: msg("fields.collapseDays", "Collapse Days"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        showAdditionalHoursText: {
          label: msg("fields.options.showAdditionalHoursText", "Show Additional Hours Text"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        alignment: {
          label: msg("fields.alignment", "Alignment"),
          type: "select",
          options: [
            { label: msg("fields.options.start", "Start"), value: "items-start" },
            { label: msg("fields.options.center", "Center"), value: "items-center" },
            { label: msg("fields.options.end", "End"), value: "items-end" },
          ],
        },
      },
    },
    complimentaryServices: {
      label: msg("fields.complimentaryServices", "Complimentary Services"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.textList", "Text List"),
          filter: {
            types: ["type.string"],
            includeListsOnly: true,
          },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    cta: {
      label: msg("fields.callToAction", "Call to Action"),
      type: "comprehensiveCTA",
    },
    cardBackgroundColor: {
      label: msg("fields.cardBackgroundColor", "Card Background Color"),
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
  };

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
      fontSize: "default",
      fontWeight: "default",
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

    line-height: 1.5;

  }

  [data-scope="${detailsSectionScope}"] p {

    line-height: 1.5;

  }

  [data-scope="${detailsSectionScope}"] li {

    line-height: 1.5;

  }

  [data-scope="${detailsSectionScope}"] h1 {

    line-height: 1.2;

  }

  [data-scope="${detailsSectionScope}"] h2 {

    line-height: 1.2;

  }

  [data-scope="${detailsSectionScope}"] h3 {

    line-height: 1.2;

  }

  [data-scope="${detailsSectionScope}"] h4 {

    line-height: 1.2;

  }

  [data-scope="${detailsSectionScope}"] h5 {

    line-height: 1.2;

  }

  [data-scope="${detailsSectionScope}"] h6 {

    line-height: 1.2;

  }

  [data-scope="${detailsSectionScope}"] a {

    line-height: 1.5;
    text-decoration: underline;

    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
`;

const BusinessConsultingDetailsSectionComponent: PuckComponent<BusinessConsultingDetailsSectionProps> =
  (props) => {
    const { t, i18n } = useTranslation();
    const streamDocument = useDocument();
    const locale = i18n.language;
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
      ...resolveTextStyles(props.cardHeaderStyles.styles),
    };
    const baseHubStyle: React.CSSProperties = {
      color: getThemeColorCssValue(detailsLabels.baseHub.fontColor ?? cardForeground),
      margin: 0,
      ...resolveTextStyles(detailsLabels.baseHub.styles),
    };
    const serviceRadiusStyle: React.CSSProperties = {
      color: getThemeColorCssValue(
        detailsLabels.serviceRadius.fontColor ?? cardForeground,
      ),
      margin: "8px 0 0",
      ...resolveTextStyles(detailsLabels.serviceRadius.styles),
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
          formattedNumber: formatPhoneNumber(
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
    const noteStyleOverrides = getRichTextStyleOverrides(
      props.detailsNote.styles,
      props.detailsNote.fontColor ?? props.cardBackgroundColor.contrastingColor,
    );
    const resolvedNote = resolveComponentData(
      props.detailsNote.text,
      locale,
      streamDocument,
    );
    const resolvedHours = resolveComponentData(
      props.hours,
      locale,
      streamDocument,
    ) as HoursType | undefined;
    const intervalTranslations: HoursTableIntervalTranslations = {
      isClosed: t("closed", "Closed"),
      open24Hours: t("open24Hours", "Open 24 Hours"),
      reopenDate: t("reopenDate", "Reopen Date"),
      timeFormatLocale: i18n.language,
    };
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
      ...resolveTextStyles(props.complimentaryServices.styles),
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
                    ...resolveTextStyles(props.heading.styles),
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
                  style={getCardStyle(props.cardBackgroundColor, "24px")}
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
                <article style={getCardStyle(props.cardBackgroundColor, "24px")}>
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
                          intervalTranslations={intervalTranslations}
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
                      <ResolvedRichText content={resolvedNote} overrides={noteStyleOverrides} />
                    </div>
                  </EntityField>
                </article>
                <article style={getCardStyle(props.cardBackgroundColor, "24px")}>
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
    label: msg("components.detailsLabel", "Details"),
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
  displayName: "Details",
  description: "Details Section",
  pageSetTypes: ["ENTITY"],
};
