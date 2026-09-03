import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import {
  Address,
  AnalyticsScopeProvider,
  Link,
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
  getAnalyticsScopeHash,
  getDefaultRTF,
  getThemeColorCssValue,
  mergeMeta,
  resolveComponentData,
  resolveUrlTemplate,
  type ComprehensiveCTAValue,
  type CTAVariant,
  type StyledButtonValue,
  type StyledLinkValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
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

type CoverageSectionCtaProps = {
  label: YextEntityField<TranslatableString>;
  openInNewTab: boolean;
  variant: CTAVariant;
  color: ThemeColor;
  button: StyledButtonValue;
  link: StyledLinkValue;
};

export type BusinessConsultingCoverageSectionProps = {
  heading: StyledTextProps;
  intro: StyledRtfProps;
  radius: number;
  limit: number;
  showAddress: boolean;
  showPhone: boolean;
  showRegion: boolean;
  showCountry: boolean;
  cta: CoverageSectionCtaProps;
  cardBackgroundColor: ThemeColor;
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const coverageSectionScope = "ybc-coverage-section";

const coverageSectionScopedTypographyStyles = `
  [data-scope="${coverageSectionScope}"] p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${coverageSectionScope}"] li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${coverageSectionScope}"] h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  [data-scope="${coverageSectionScope}"] h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  [data-scope="${coverageSectionScope}"] h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  [data-scope="${coverageSectionScope}"] h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  [data-scope="${coverageSectionScope}"] h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  [data-scope="${coverageSectionScope}"] h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  [data-scope="${coverageSectionScope}"] a {
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

const BusinessConsultingCoverageSectionFields: YextFields<BusinessConsultingCoverageSectionProps> =
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
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    intro: {
      label: "Intro",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.rich_text_v2"] },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    radius: {
      label: "Radius",
      type: "number",
    },
    limit: {
      label: "Limit",
      type: "number",
    },
    showAddress: {
      label: "Show Address",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showPhone: {
      label: "Show Phone",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
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
    cta: {
      label: "Call to Action",
      type: "object",
      objectFields: {
        label: {
          type: "entityField",
          label: "Label",
          filter: { types: ["type.string"] },
        },
        openInNewTab: {
          label: "Open In New Tab",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        variant: {
          label: "Variant",
          type: "select",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Link", value: "link" },
          ],
        },
        color: {
          label: "Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        button: {
          label: "Button Styles",
          type: "styledButton",
        },
        link: {
          label: "Link Styles",
          type: "styledLink",
          showIncludeCaretField: false,
        },
      },
    },
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
  };

const formatPhoneNumber = (
  phoneNumberString: string,
  format: "international" | "domestic" = "domestic",
) => {
  const cleanedPhoneNumberString = phoneNumberString.replace(
    /(?!^\+)\+|[^\d+]/g,
    "",
  );
  const parsedPhoneNumber = parsePhoneNumber(cleanedPhoneNumberString);

  if (!parsedPhoneNumber.valid || parsedPhoneNumber.number === undefined) {
    return phoneNumberString;
  }

  return format === "international"
    ? parsedPhoneNumber.number.international
    : parsedPhoneNumber.number.national;
};

const cardStyle = (backgroundColor: ThemeColor): React.CSSProperties => ({
  backgroundColor: getThemeColorCssValue(backgroundColor),
  borderRadius: "20px",
  padding: "22px",
});

const BusinessConsultingCoverageSectionComponent: PuckComponent<BusinessConsultingCoverageSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const { relativePrefixToRoot } = useTemplateProps<{
      relativePrefixToRoot?: string;
    }>();
    const locale = streamDocument.locale ?? "en";
    const coordinate = streamDocument?.yextDisplayCoordinate;
    const enableNearbyLocations =
      coordinate?.latitude !== undefined &&
      coordinate?.longitude !== undefined &&
      props.radius > 0 &&
      props.limit > 0;

    const { data: nearbyLocationsData, status: nearbyLocationsStatus } =
      useNearbyLocations({
        streamDocument,
        latitude: coordinate?.latitude,
        longitude: coordinate?.longitude,
        radiusMi: props.radius,
        limit: props.limit,
        enabled: enableNearbyLocations,
      });

    const resolvedHeading =
      resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const introStyleOverrides = {
      color: getThemeColorCssValue(
        props.intro.fontColor ?? props.section.backgroundColor.contrastingColor,
      ),
      ...(props.intro.styles.fontFamily !== "default"
        ? { fontFamily: props.intro.styles.fontFamily }
        : {}),
      ...(props.intro.styles.fontSize !== "default"
        ? { fontSize: props.intro.styles.fontSize }
        : {}),
      ...(props.intro.styles.fontStyle !== "default"
        ? { fontStyle: props.intro.styles.fontStyle }
        : {}),
      ...(props.intro.styles.fontWeight !== "default"
        ? { fontWeight: props.intro.styles.fontWeight }
        : {}),
      ...(props.intro.styles.textTransform !== "default"
        ? { textTransform: props.intro.styles.textTransform }
        : {}),
    };
    const resolvedIntro = resolveComponentData(
      props.intro.text,
      locale,
      streamDocument,
      {
        richTextStyleOverrides: introStyleOverrides,
      },
    );
    const resolvedCtaLabel = resolveComponentData(
      props.cta.label,
      locale,
      streamDocument,
    );
    const ctaLabel =
      (typeof resolvedCtaLabel === "string" && resolvedCtaLabel.trim()) ||
      "Book Online Now";
    const nearbyLocationDocs = nearbyLocationsData?.response?.docs ?? [];
    const nearbyLocationCards = nearbyLocationDocs.map((locationData) => ({
      locationData,
      resolvedUrl: resolveUrlTemplate(
        mergeMeta(locationData, streamDocument),
        relativePrefixToRoot ?? "",
      ),
    }));

    const renderSectionContent = (content: React.ReactNode) => (
      <div style={{ margin: "0 auto", maxWidth: "1280px" }}>
        <div style={{ margin: "0 auto 28px", maxWidth: "780px", textAlign: "center" }}>
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
                margin: 0,
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
          <EntityField
            displayName="Intro"
            fieldId={props.intro.text.field}
            constantValueEnabled={props.intro.text.constantValueEnabled}
          >
            <div style={{ lineHeight: 1.8, marginTop: "14px" }}>
              {React.isValidElement(resolvedIntro) ? (
                resolvedIntro
              ) : (
                <MaybeRTF
                  data={typeof resolvedIntro === "string" ? resolvedIntro : ""}
                  richTextStyleOverrides={introStyleOverrides}
                />
              )}
            </div>
          </EntityField>
        </div>
        {content}
      </div>
    );

    if (!enableNearbyLocations) {
      if (!props.puck.isEditing) {
        return <></>;
      }

      return (
        <VisibilityWrapper
          liveVisibility={props.section.visibleOnLivePage}
          isEditing={props.puck.isEditing}
        >
          <AnalyticsScopeProvider
            name={`BusinessConsultingCoverageSection${getAnalyticsScopeHash(props.id)}`}
          >
            <section
              data-scope={coverageSectionScope}
              style={{
                backgroundColor: getThemeColorCssValue(props.section.backgroundColor),
                padding: "72px 24px",
              }}
            >
              <style>{coverageSectionScopedTypographyStyles}</style>
              {renderSectionContent(
                <p>
                  Add entity coordinates and keep Radius and Limit above zero to preview
                  nearby locations here.
                </p>,
              )}
            </section>
          </AnalyticsScopeProvider>
        </VisibilityWrapper>
      );
    }

    if (nearbyLocationsStatus === "pending") {
      return (
        <VisibilityWrapper
          liveVisibility={props.section.visibleOnLivePage}
          isEditing={props.puck.isEditing}
        >
          <AnalyticsScopeProvider
            name={`BusinessConsultingCoverageSection${getAnalyticsScopeHash(props.id)}`}
          >
            <section
              data-scope={coverageSectionScope}
              style={{
                backgroundColor: getThemeColorCssValue(props.section.backgroundColor),
                padding: "72px 24px",
              }}
            >
              <style>{coverageSectionScopedTypographyStyles}</style>
              {renderSectionContent(<p>Loading nearby locations</p>)}
            </section>
          </AnalyticsScopeProvider>
        </VisibilityWrapper>
      );
    }

    if (nearbyLocationsStatus !== "success" || !nearbyLocationCards.length) {
      if (!props.puck.isEditing) {
        return <></>;
      }

      return (
        <VisibilityWrapper
          liveVisibility={props.section.visibleOnLivePage}
          isEditing={props.puck.isEditing}
        >
          <AnalyticsScopeProvider
            name={`BusinessConsultingCoverageSection${getAnalyticsScopeHash(props.id)}`}
          >
            <section
              data-scope={coverageSectionScope}
              style={{
                backgroundColor: getThemeColorCssValue(props.section.backgroundColor),
                padding: "72px 24px",
              }}
            >
              <style>{coverageSectionScopedTypographyStyles}</style>
              {renderSectionContent(
                <p>No nearby locations found for this location</p>,
              )}
            </section>
          </AnalyticsScopeProvider>
        </VisibilityWrapper>
      );
    }

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`BusinessConsultingCoverageSection${getAnalyticsScopeHash(props.id)}`}
        >
          <section
            data-scope={coverageSectionScope}
            style={{
              backgroundColor: getThemeColorCssValue(props.section.backgroundColor),
              padding: "72px 24px",
            }}
          >
            <style>{coverageSectionScopedTypographyStyles}</style>
            {renderSectionContent(
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                }}
              >
                {nearbyLocationCards.map(({ locationData, resolvedUrl }, index) => {
                  const locationName =
                    locationData.name?.trim() || locationData.id || "Nearby location";
                  const phoneNumber = locationData.mainPhone?.trim() ?? "";
                  const formattedPhoneNumber = phoneNumber
                    ? formatPhoneNumber(phoneNumber, "domestic")
                    : "";
                  const telDigits = phoneNumber.replace(/\D/g, "");
                  const nearbyCtaValue: ComprehensiveCTAValue = {
                    data: {
                      actionType: "link",
                      cta: {
                        field: "",
                        constantValue: {
                          label: ctaLabel,
                          link: resolvedUrl,
                          linkType: "URL",
                          ctaType: "textAndLink",
                        },
                        constantValueEnabled: true,
                        selectedType: "textAndLink",
                      },
                      openInNewTab: props.cta.openInNewTab,
                    },
                    styles: {
                      variant: props.cta.variant,
                      color: props.cta.color,
                      button: props.cta.button,
                      link: props.cta.link,
                    },
                  };

                  return (
                    <Background
                      background={props.cardBackgroundColor}
                      key={`${locationData.id || locationName}-${index}`}
                      style={cardStyle(props.cardBackgroundColor)}
                    >
                      <h3
                        style={{
                          color: getThemeColorCssValue(
                            props.cardBackgroundColor.contrastingColor,
                          ),
                          margin: 0,
                        }}
                      >
                        {locationName}
                      </h3>
                      {props.showAddress && locationData.address ? (
                        <div
                          style={{
                            color: getThemeColorCssValue(
                              props.cardBackgroundColor.contrastingColor,
                            ),
                            margin: "14px 0 8px",
                          }}
                        >
                          <Address
                            address={locationData.address}
                            showRegion={props.showRegion}
                            showCountry={props.showCountry}
                          />
                        </div>
                      ) : null}
                      {props.showPhone && formattedPhoneNumber ? (
                        !telDigits ? (
                          <p
                            style={{
                              color: getThemeColorCssValue(
                                props.cardBackgroundColor.contrastingColor,
                              ),
                              margin: props.showAddress && locationData.address ? "0" : "14px 0 0",
                            }}
                          >
                            {formattedPhoneNumber}
                          </p>
                        ) : (
                          <Link
                            cta={{ link: telDigits, linkType: "PHONE" }}
                            eventName={`phone${index}`}
                            style={{
                              color: getThemeColorCssValue(
                                props.cardBackgroundColor.contrastingColor,
                              ),
                              display: "inline-block",
                              marginTop: props.showAddress && locationData.address ? 0 : "14px",
                            }}
                          >
                            {formattedPhoneNumber}
                          </Link>
                        )
                      ) : null}
                      <div style={{ marginTop: "16px" }}>
                        <EntityField
                          displayName="Call to Action Label"
                          fieldId={props.cta.label.field}
                          constantValueEnabled={
                            props.cta.label.constantValueEnabled
                          }
                        >
                          <ComprehensiveCTA
                            value={nearbyCtaValue}
                            eventName={`cta${index}`}
                            style={{
                              alignItems: "center",
                              borderRadius: "999px",
                              display: "inline-flex",
                              minHeight: "40px",
                              padding: "10px 14px",
                              textDecoration: "none",
                            }}
                          />
                        </EntityField>
                      </div>
                    </Background>
                  );
                })}
              </div>,
            )}
          </section>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const BusinessConsultingCoverageSection: YextComponentConfig<BusinessConsultingCoverageSectionProps> =
  {
    label: "Coverage Section",
    fields: BusinessConsultingCoverageSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Our Service Fleet Hubs & Coverage",
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
      intro: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Our service vans routinely visit West Falls Church, Merrifield, Fairview Park, and Holmes Run Acres. Don't see your neighborhood listed? Give us a call. We are continuously expanding our service routes to meet demand.",
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
      radius: 10,
      limit: 3,
      showAddress: true,
      showPhone: true,
      showRegion: true,
      showCountry: false,
      cta: {
        label: {
          field: "",
          constantValue: {
            defaultValue: "Book Online Now",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        openInNewTab: false,
        variant: "primary",
        color: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
        button: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
          borderRadius: "default",
          letterSpacing: "default",
        },
        link: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
          letterSpacing: "default",
          includeCaret: "default",
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
    render: (props) => <BusinessConsultingCoverageSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "BusinessConsultingCoverageSection",
  displayName: "Coverage Section",
  description: "Coverage Section",
  pageSetTypes: ["ENTITY"],
};
