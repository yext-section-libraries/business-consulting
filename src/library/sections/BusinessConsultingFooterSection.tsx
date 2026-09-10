import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import {
  Address,
  AnalyticsScopeProvider,
  Link,
  type AddressType,
} from "@yext/pages-components";
import {
  Background,
  EntityField,
  VisibilityWrapper,
  YextComponentConfig,
  YextEntityField,
  YextFields,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  type ThemeColor,
  type TranslatableString,
  useDocument,
} from "@yext/visual-editor";
import { formatPhoneNumber } from "@yext/visual-editor/section-library-support";
import type {
  PhoneFieldProps,
  PhoneItemProps,
  StyledTextProps,
} from "../shared/sectionHelpers";

type FooterLink = {
  label: YextEntityField<TranslatableString>;
  link: YextEntityField<string>;
  linkType: "URL" | "EMAIL" | "PHONE";
  openInNewTab: boolean;
};

export type BusinessConsultingFooterSectionProps = {
  brandText: StyledTextProps;
  links: FooterLink[];
  address: YextEntityField<AddressType>;
  showRegion: boolean;
  showCountry: boolean;
  phone: PhoneFieldProps;
  websiteLink: FooterLink;
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const BusinessConsultingFooterSectionFields: YextFields<BusinessConsultingFooterSectionProps> =
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
    brandText: {
      label: "Brand Text",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
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
    links: {
      label: "Links",
      type: "array",
      arrayFields: {
        label: {
          label: "Label",
          type: "entityField",
          filter: {
            types: ["type.string"],
          },
        },
        link: {
          label: "Link",
          type: "entityField",
          filter: {
            types: ["type.string"],
          },
        },
        linkType: {
          label: "Link Type",
          type: "select",
          options: [
            { label: "URL", value: "URL" },
            { label: "Email", value: "EMAIL" },
            { label: "Phone", value: "PHONE" },
          ],
        },
        openInNewTab: {
          label: "Open in New Tab",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
      defaultItemProps: {
        label: {
          field: "",
          constantValue: {
            defaultValue: "Footer Link",
          },
          constantValueEnabled: true,
        },
        link: {
          field: "",
          constantValue: "#",
          constantValueEnabled: true,
        },
        linkType: "URL",
        openInNewTab: false,
      },
      getItemSummary: (item: FooterLink) =>
        (typeof item.label.constantValue === "string"
          ? item.label.constantValue
          : item.label.constantValue?.defaultValue) ||
        item.label.field ||
        "Footer Link",
    },
    address: {
      type: "entityField",
      label: "Address",
      filter: {
        types: ["type.address"],
      },
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
    phone: {
      label: "Phone",
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
    websiteLink: {
      label: "Website Link",
      type: "object",
      objectFields: {
        label: {
          label: "Label",
          type: "entityField",
          filter: { types: ["type.string"] },
        },
        link: {
          label: "Link",
          type: "entityField",
          filter: { types: ["type.string"] },
        },
        linkType: {
          label: "Link Type",
          type: "select",
          options: [
            { label: "URL", value: "URL" },
            { label: "Email", value: "EMAIL" },
            { label: "Phone", value: "PHONE" },
          ],
        },
        openInNewTab: {
          label: "Open in New Tab",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
  };

const footerSectionScope = "ybc-footer-section";

const footerSectionScopedTypographyStyles = `
  [data-scope="${footerSectionScope}"] p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${footerSectionScope}"] li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${footerSectionScope}"] h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  [data-scope="${footerSectionScope}"] h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  [data-scope="${footerSectionScope}"] h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  [data-scope="${footerSectionScope}"] h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  [data-scope="${footerSectionScope}"] h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  [data-scope="${footerSectionScope}"] h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  [data-scope="${footerSectionScope}"] a {
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

const BusinessConsultingFooterSectionComponent: PuckComponent<
  BusinessConsultingFooterSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const resolvedBrandText =
    resolveComponentData(props.brandText.text, locale, streamDocument) || "";
  const resolvedAddress = resolveComponentData(
    props.address,
    locale,
    streamDocument,
  ) as AddressType | undefined;
  const resolvedPhoneItems = (props.phone.items ?? [])
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
          props.phone.phoneFormat,
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
  const resolvedLinks = (props.links ?? [])
    .map((item, index) => {
      const resolvedLabel = resolveComponentData(
        item.label,
        locale,
        streamDocument,
      );
      const resolvedLink = resolveComponentData(
        item.link,
        locale,
        streamDocument,
      );
      const label =
        typeof resolvedLabel === "string" ? resolvedLabel.trim() : "";
      const link = typeof resolvedLink === "string" ? resolvedLink.trim() : "";

      if (!label || !link) {
        return null;
      }

      return {
        key: `${label}-${index}`,
        label,
        link,
        linkType: item.linkType,
        openInNewTab: item.openInNewTab,
        labelField: item.label,
        linkField: item.link,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const resolvedWebsiteLabel = resolveComponentData(
    props.websiteLink.label,
    locale,
    streamDocument,
  );
  const resolvedWebsiteHref = resolveComponentData(
    props.websiteLink.link,
    locale,
    streamDocument,
  );
  const websiteLabel =
    typeof resolvedWebsiteLabel === "string" ? resolvedWebsiteLabel.trim() : "";
  const websiteHref =
    typeof resolvedWebsiteHref === "string" ? resolvedWebsiteHref.trim() : "";
  const websiteLinkType = props.websiteLink.linkType;
  const websiteOpenInNewTab = props.websiteLink.openInNewTab;
  const footerForegroundColor = getThemeColorCssValue(
    props.section.backgroundColor.contrastingColor,
  );

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`BusinessConsultingFooterSection${getAnalyticsScopeHash(props.id)}`}
      >
        <Background
          as="footer"
          background={props.section.backgroundColor}
          data-scope={footerSectionScope}
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
            padding: "40px 24px",
          }}
        >
          <style>{footerSectionScopedTypographyStyles}</style>
          <div style={{ margin: "0 auto", maxWidth: "1280px" }}>
            <div
              style={{
                alignItems: "flex-start",
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "space-between",
              }}
            >
              <EntityField
                displayName="Brand Text"
                fieldId={props.brandText.text.field}
                constantValueEnabled={props.brandText.text.constantValueEnabled}
              >
                <p
                  style={{
                    color: getThemeColorCssValue(
                      props.brandText.fontColor ??
                        props.section.backgroundColor.contrastingColor,
                    ),
                    margin: 0,
                    ...(props.brandText.styles.fontFamily !== "default"
                      ? { fontFamily: props.brandText.styles.fontFamily }
                      : {}),
                    ...(props.brandText.styles.fontSize !== "default"
                      ? { fontSize: props.brandText.styles.fontSize }
                      : {}),
                    ...(props.brandText.styles.fontStyle !== "default"
                      ? { fontStyle: props.brandText.styles.fontStyle }
                      : {}),
                    ...(props.brandText.styles.fontWeight !== "default"
                      ? { fontWeight: props.brandText.styles.fontWeight }
                      : {}),
                    ...(props.brandText.styles.textTransform !== "default"
                      ? { textTransform: props.brandText.styles.textTransform }
                      : {}),
                  }}
                >
                  {resolvedBrandText}
                </p>
              </EntityField>
              <nav style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {resolvedLinks.map((link, index) => (
                  <EntityField
                    key={link.key}
                    displayName="Footer Link"
                    fieldId={link.linkField.field}
                    constantValueEnabled={link.linkField.constantValueEnabled}
                  >
                    <Link
                      cta={{ link: link.link, linkType: link.linkType }}
                      eventName={`footerLink${index}`}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                      style={{
                        color: footerForegroundColor,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <EntityField
                        displayName="Footer Link Label"
                        fieldId={link.labelField.field}
                        constantValueEnabled={
                          link.labelField.constantValueEnabled
                        }
                      >
                        <span>{link.label}</span>
                      </EntityField>
                    </Link>
                  </EntityField>
                ))}
              </nav>
            </div>
            <div
              style={{
                color: footerForegroundColor,
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                marginTop: "18px",
              }}
            >
              {resolvedAddress ? (
                <EntityField
                  displayName="Address"
                  fieldId={props.address.field}
                  constantValueEnabled={props.address.constantValueEnabled}
                >
                  <div>
                    <Address
                      address={resolvedAddress}
                      showRegion={props.showRegion}
                      showCountry={props.showCountry}
                    />
                  </div>
                </EntityField>
              ) : null}
              {resolvedPhoneItems.map((item) => {
                const content = (
                  <>
                    {item.label && item.labelField ? (
                      <>
                        <EntityField
                          displayName="Phone Label"
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
                      displayName="Phone Number"
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
                    {!props.phone.includeHyperlink || !item.telDigits ? (
                      <span>{content}</span>
                    ) : (
                      <Link
                        cta={{
                          link: item.telDigits,
                          linkType: "PHONE",
                        }}
                        eventName="phoneCta"
                        style={{
                          color: footerForegroundColor,
                        }}
                      >
                        {content}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
              {websiteLabel && websiteHref ? (
                <EntityField
                  displayName="Website Link"
                  fieldId={props.websiteLink.link.field}
                  constantValueEnabled={
                    props.websiteLink.link.constantValueEnabled
                  }
                >
                  <Link
                    cta={{ link: websiteHref, linkType: websiteLinkType }}
                    eventName="websiteCta"
                    target={websiteOpenInNewTab ? "_blank" : undefined}
                    rel={
                      websiteOpenInNewTab ? "noopener noreferrer" : undefined
                    }
                    style={{
                      color: footerForegroundColor,
                      overflowWrap: "anywhere",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    <EntityField
                      displayName="Website Link Label"
                      fieldId={props.websiteLink.label.field}
                      constantValueEnabled={
                        props.websiteLink.label.constantValueEnabled
                      }
                    >
                      <span>{websiteLabel}</span>
                    </EntityField>
                  </Link>
                </EntityField>
              ) : null}
            </div>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessConsultingFooterSection: YextComponentConfig<BusinessConsultingFooterSectionProps> =
  {
    label: "Footer Section",
    fields: BusinessConsultingFooterSectionFields,
    defaultProps: {
      brandText: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "[[name]]",
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
        fontColor: undefined,
      },
      links: [
        {
          label: {
            field: "",
            constantValue: {
              defaultValue: "Packages & Pricing",
            },
            constantValueEnabled: true,
          },
          link: { field: "", constantValue: "#", constantValueEnabled: true },
          linkType: "URL",
          openInNewTab: false,
        },
        {
          label: {
            field: "",
            constantValue: {
              defaultValue: "Clean Pup Club",
            },
            constantValueEnabled: true,
          },
          link: { field: "", constantValue: "#", constantValueEnabled: true },
          linkType: "URL",
          openInNewTab: false,
        },
        {
          label: {
            field: "",
            constantValue: {
              defaultValue: "Care Tips",
            },
            constantValueEnabled: true,
          },
          link: { field: "", constantValue: "#", constantValueEnabled: true },
          linkType: "URL",
          openInNewTab: false,
        },
        {
          label: {
            field: "",
            constantValue: {
              defaultValue: "Careers",
            },
            constantValueEnabled: true,
          },
          link: { field: "", constantValue: "#", constantValueEnabled: true },
          linkType: "URL",
          openInNewTab: false,
        },
        {
          label: {
            field: "",
            constantValue: {
              defaultValue: "Contact Us",
            },
            constantValueEnabled: true,
          },
          link: { field: "", constantValue: "#", constantValueEnabled: true },
          linkType: "URL",
          openInNewTab: false,
        },
      ],
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
      phone: {
        items: [
          {
            number: {
              field: "",
              constantValue: "+1 (555) 019-9274",
              constantValueEnabled: true,
            },
            label: {
              field: "",
              constantValue: {
                defaultValue: "",
                hasLocalizedValue: "true",
              },
              constantValueEnabled: true,
            },
          },
        ],
        phoneFormat: "domestic",
        includeHyperlink: true,
      },
      websiteLink: {
        label: {
          field: "",
          constantValue: {
            defaultValue:
              "https://www.luckydogmobilespa.com/locations/main-hub",
          },
          constantValueEnabled: true,
        },
        link: {
          field: "",
          constantValue: "https://www.luckydogmobilespa.com/locations/main-hub",
          constantValueEnabled: true,
        },
        linkType: "URL",
        openInNewTab: false,
      },
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
      },
    },
    render: (props) => (
      <BusinessConsultingFooterSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessConsultingFooterSection",
  displayName: "Footer Section",
  description: "Footer Section",
  pageSetTypes: ["ENTITY"],
};
