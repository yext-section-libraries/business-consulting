import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  type ComplexImageType,
  type ImageType,
} from "@yext/pages-components";
import {
  Background,
  ComprehensiveCTA,
  EntityField,
  Image,
  MaybeRTF,
  VisibilityWrapper,
  YextComponentConfig,
  YextEntityField,
  YextFields,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getDefaultRTF,
  getThemeColorCssValue,
  resolveComponentData,
  type ComprehensiveCTAValue,
  type StyledImageValue,
  type ThemeColor,
  type TranslatableAssetImage,
  useDocument,
} from "@yext/visual-editor";
import type {
  StyledRtfProps,
  StyledTextProps,
} from "../shared/sectionHelpers";
import { getRichTextStyleOverrides } from "../shared/sectionHelpers";

type PromoImageField = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  styles?: StyledImageValue;
};

export type BusinessConsultingPromoSectionProps = {
  heading: StyledTextProps;
  body: StyledRtfProps;
  image: PromoImageField;
  cta: ComprehensiveCTAValue;
  panelBackgroundColor: ThemeColor;
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const BusinessConsultingPromoSectionFields: YextFields<BusinessConsultingPromoSectionProps> =
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
    body: {
      label: "Body",
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
    image: {
      label: "Image",
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: "Image",
          filter: { types: ["type.image"] },
        },
        styles: { label: "Image Styles", type: "styledImage" },
      },
    },
    cta: {
      label: "Call to Action",
      type: "comprehensiveCTA",
    },
    panelBackgroundColor: {
      label: "Panel Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
  };

const promoSectionScope = "ybc-promo-section";

const promoSectionScopedTypographyStyles = `
  [data-scope="${promoSectionScope}"] p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${promoSectionScope}"] li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${promoSectionScope}"] h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  [data-scope="${promoSectionScope}"] h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  [data-scope="${promoSectionScope}"] h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  [data-scope="${promoSectionScope}"] h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  [data-scope="${promoSectionScope}"] h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  [data-scope="${promoSectionScope}"] h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  [data-scope="${promoSectionScope}"] a {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: underline;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }

  [data-scope="${promoSectionScope}"] .promo-section__content {
    margin: 0 auto;
    max-width: 1280px;
  }

  [data-scope="${promoSectionScope}"] .promo-section__image {
    border-radius: inherit;
    display: block;
    height: 100%;
    overflow: hidden;
    width: 100%;
  }

  [data-scope="${promoSectionScope}"] .promo-section__panel {
    gap: 0 !important;
    grid-template-columns: minmax(0, 1fr) !important;
    min-height: auto !important;
  }

  [data-scope="${promoSectionScope}"] .promo-section__media {
    min-height: 200px;
  }

  [data-scope="${promoSectionScope}"] .promo-section__copy {
    padding: 30px !important;
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    [data-scope="${promoSectionScope}"].promo-section {
      padding: 30px 32px !important;
    }

    [data-scope="${promoSectionScope}"] .promo-section__media {
      height: 300px !important;
      max-height: 300px;
      min-height: 300px;
    }
  }

  @media (min-width: 1200px) {
    [data-scope="${promoSectionScope}"].promo-section {
      padding: 60px 80px !important;
    }

    [data-scope="${promoSectionScope}"] .promo-section__panel {
      gap: 60px !important;
      grid-template-columns: 400px minmax(0, 1fr) !important;
      max-height: 685px;
      min-height: 473px !important;
      padding-left: 60px;
    }

    [data-scope="${promoSectionScope}"] .promo-section__media {
      max-height: 685px;
      min-height: 473px;
    }

    [data-scope="${promoSectionScope}"] .promo-section__copy {
      padding: 60px 0 !important;
    }
  }

  @media (max-width: 767px) {
    [data-scope="${promoSectionScope}"].promo-section {
      padding: 30px 16px !important;
    }

  }
`;

const BusinessConsultingPromoSectionComponent: PuckComponent<
  BusinessConsultingPromoSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const bodyStyleOverrides = getRichTextStyleOverrides(
    props.body.styles,
    props.body.fontColor ?? props.panelBackgroundColor.contrastingColor,
  );
  const resolvedBody = resolveComponentData(
    props.body.text,
    locale,
    streamDocument,
  );
  const resolvedImage = resolveComponentData(
    props.image.image,
    locale,
    streamDocument,
  ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
  const showImage = Boolean(resolvedImage);
  const imageWrapperStyle: React.CSSProperties = {
    borderRadius:
      props.image.styles?.borderRadius === "default"
        ? undefined
        : props.image.styles?.borderRadius,
    height: "100%",
    overflow: "hidden",
    width: "100%",
  };

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`BusinessConsultingPromoSection${getAnalyticsScopeHash(props.id)}`}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          data-scope={promoSectionScope}
          className="promo-section"
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
            padding: "56px 24px",
          }}
        >
          <style>{promoSectionScopedTypographyStyles}</style>
          <div className="promo-section__content">
            <Background
              background={props.panelBackgroundColor}
              className="promo-section__panel"
              style={{
                ...getSurfaceColorStyle(
                  props.panelBackgroundColor,
                  streamDocument,
                ),
                borderRadius: "24px",
                display: "grid",
                gap: "24px",
                gridTemplateColumns: showImage
                  ? "minmax(0, 1fr) minmax(0, 1.25fr)"
                  : "minmax(0, 1fr)",
                minHeight: "500px",
                overflow: "hidden",
              }}
            >
              <div
                className="promo-section__copy"
                style={{
                  alignSelf: "center",
                  padding: showImage ? "28px 0 28px 28px" : "28px",
                }}
              >
                <EntityField
                  displayName="Heading"
                  fieldId={props.heading.text.field}
                  constantValueEnabled={props.heading.text.constantValueEnabled}
                >
                  <h2
                    style={{
                      color: getThemeColorCssValue(
                        props.heading.fontColor ??
                          props.panelBackgroundColor.contrastingColor,
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
                  displayName="Body"
                  fieldId={props.body.text.field}
                  constantValueEnabled={props.body.text.constantValueEnabled}
                >
                  <div
                    style={{
                      lineHeight: 1.8,
                      marginTop: "18px",
                    }}
                  >
                    {React.isValidElement(resolvedBody) ? (
                      resolvedBody
                    ) : (
                      <MaybeRTF
                        data={
                          typeof resolvedBody === "string" ? resolvedBody : ""
                        }
                        richTextStyleOverrides={bodyStyleOverrides}
                      />
                    )}
                  </div>
                </EntityField>
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
                    eventName="primaryCta"
                    style={{
                      alignItems: "center",
                      borderRadius: "999px",
                      display: "inline-flex",
                      marginTop: "22px",
                      minHeight: "44px",
                      padding: "12px 16px",
                      textDecoration: "none",
                    }}
                  />
                </EntityField>
              </div>
              {showImage && resolvedImage ? (
                <EntityField
                  displayName="Image"
                  fieldId={props.image.image.field}
                  constantValueEnabled={props.image.image.constantValueEnabled}
                >
                  <div
                    className="promo-section__media"
                    style={imageWrapperStyle}
                  >
                    <Image
                      image={resolvedImage}
                      className="promo-section__image"
                      style={{
                        borderRadius: "inherit",
                        display: "block",
                        height: "100%",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </div>
                </EntityField>
              ) : null}
            </Background>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessConsultingPromoSection: YextComponentConfig<BusinessConsultingPromoSectionProps> =
  {
    label: "Promo Section",
    fields: BusinessConsultingPromoSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Join the Clean Pup Club",
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
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Never worry about booking a last-minute appointment again. Save 15% on every visit and lock in a recurring 4, 6, or 8-week schedule. Members receive priority holiday booking and complimentary teeth brushing.",
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
      image: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        styles: { borderRadius: "default" },
      },
      cta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              label: "Join & Save",
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
      panelBackgroundColor: {
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
    render: (props) => (
      <BusinessConsultingPromoSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessConsultingPromoSection",
  displayName: "Promo Section",
  description: "Promo Section",
  pageSetTypes: ["ENTITY"],
};
