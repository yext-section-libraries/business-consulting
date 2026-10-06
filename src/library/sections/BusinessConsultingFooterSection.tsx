import { resolveTextStyles } from "../shared/sectionHelpers";
import "../shared/typography.css";
import { useTranslation } from "react-i18next";
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
  msg,
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
    brandText: {
      label: msg("fields.brandText", "Brand Text"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: {
            types: ["type.string"],
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
    links: {
      label: msg("fields.links", "Links"),
      type: "array",
      arrayFields: {
        label: {
          label: msg("fields.label", "Label"),
          type: "entityField",
          filter: {
            types: ["type.string"],
          },
        },
        link: {
          label: msg("fields.link", "Link"),
          type: "entityField",
          filter: {
            types: ["type.string"],
          },
        },
        linkType: {
          label: msg("fields.linkType", "Link Type"),
          type: "select",
          options: [
            { label: msg("fields.options.url", "URL"), value: "URL" },
            { label: msg("fields.options.email", "Email"), value: "EMAIL" },
            { label: msg("fields.options.phone", "Phone"), value: "PHONE" },
          ],
        },
        openInNewTab: {
          label: msg("fields.openInNewTabLabel", "Open in New Tab"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
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
      label: msg("fields.address", "Address"),
      filter: {
        types: ["type.address"],
      },
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
    phone: {
      label: msg("fields.phone", "Phone"),
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
            {
              label: msg("fields.options.domestic", "Domestic"),
              value: "domestic",
            },
            {
              label: msg("fields.options.international", "International"),
              value: "international",
            },
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
    websiteLink: {
      label: msg("fields.websiteLink", "Website Link"),
      type: "object",
      objectFields: {
        label: {
          label: msg("fields.label", "Label"),
          type: "entityField",
          filter: { types: ["type.string"] },
        },
        link: {
          label: msg("fields.link", "Link"),
          type: "entityField",
          filter: { types: ["type.string"] },
        },
        linkType: {
          label: msg("fields.linkType", "Link Type"),
          type: "select",
          options: [
            { label: msg("fields.options.url", "URL"), value: "URL" },
            { label: msg("fields.options.email", "Email"), value: "EMAIL" },
            { label: msg("fields.options.phone", "Phone"), value: "PHONE" },
          ],
        },
        openInNewTab: {
          label: msg("fields.openInNewTabLabel", "Open in New Tab"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
  };

const footerSectionScope = "ybc-footer-section";

const footerSectionScopedTypographyStyles = `
  [data-scope="${footerSectionScope}"] p {

    line-height: 1.5;

  }

  [data-scope="${footerSectionScope}"] li {

    line-height: 1.5;

  }

  [data-scope="${footerSectionScope}"] h1 {

    line-height: 1.2;

  }

  [data-scope="${footerSectionScope}"] h2 {

    line-height: 1.2;

  }

  [data-scope="${footerSectionScope}"] h3 {

    line-height: 1.2;

  }

  [data-scope="${footerSectionScope}"] h4 {

    line-height: 1.2;

  }

  [data-scope="${footerSectionScope}"] h5 {

    line-height: 1.2;

  }

  [data-scope="${footerSectionScope}"] h6 {

    line-height: 1.2;

  }

  [data-scope="${footerSectionScope}"] a {

    line-height: 1.5;
    text-decoration: underline;

    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
`;

const BusinessConsultingFooterSectionComponent: PuckComponent<
  BusinessConsultingFooterSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const { i18n } = useTranslation();
  const locale = i18n.language;
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
                    ...resolveTextStyles(props.brandText.styles),
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
                      rel={
                        link.openInNewTab ? "noopener noreferrer" : undefined
                      }
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
                  <React.Fragment key={`${item.label}-${item.originalNumber}`}>
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
    label: msg("components.footerLabel", "Footer"),
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
    render: (props) => <BusinessConsultingFooterSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "BusinessConsultingFooterSection",
  displayName: "Footer",
  description: "Footer Section",
  pageSetTypes: ["ENTITY", "DIRECTORY", "LOCATOR"],
};
