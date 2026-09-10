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
  type ComprehensiveCTAValue,
  EntityField,
  Image,
  MaybeRTF,
  VisibilityWrapper,
  type CTAVariant,
  type EnhancedTranslatableCTA,
  type PresetImageType,
  type StyledButtonValue,
  YextComponentConfig,
  type YextCTAField,
  YextEntityField,
  YextFields,
  createItemSource,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getDefaultRTF,
  getThemeColorCssValue,
  resolveComponentData,
  type StyledImageValue,
  type StyledLinkValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  useDocument,
} from "@yext/visual-editor";
import {
  aspectRatioOptions,
  getRichTextStyleOverrides,
  type StyledRtfProps,
  type StyledTextProps,
} from "../shared/sectionHelpers";

type ServiceCardImage = YextEntityField<
  ImageType | ComplexImageType | TranslatableAssetImage
>;

type ServiceCardImageStyles = {
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type SharedCardTextStyles = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type SharedCardCtaStyles = {
  variant: CTAVariant;
  presetImage?: PresetImageType;
  color: ThemeColor;
  button: StyledButtonValue;
  link: StyledLinkValue;
};

type ServiceCard = {
  title: Pick<StyledTextProps, "text">;
  body: Pick<StyledRtfProps, "text">;
  cta: YextCTAField;
  image: ServiceCardImage;
};

const serviceCardsSource = createItemSource<ServiceCard>({
  label: "Service Cards",
  mappingFields: {
    title: {
      label: "Title",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
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
      },
    },
    cta: {
      label: "Call to Action",
      type: "entityField",
      filter: { types: ["type.cta"] },
    },
    image: {
      type: "entityField",
      label: "Image",
      filter: { types: ["type.image"] },
    },
  },
  defaultValues: [
    {
      title: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "The Mobile Spa Package",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
      },
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Our signature door-to-door full service. Includes a deep-cleaning hydro-massage bath, blow dry, full haircut/style to breed standard, nail trim & grind, ear cleaning, and gland expression.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
      },
      cta: {
        field: "",
        constantValue: {
          label: { defaultValue: "View Pricing" },
          link: { defaultValue: "#" },
          linkType: "URL",
          openInNewTab: false,
        },
        constantValueEnabled: true,
      },
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
          width: 1267,
          height: 1900,
        },
        constantValueEnabled: true,
      },
    },
    {
      title: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "In-Home Pampering",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
      },
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Perfect for senior dogs or pets with extreme separation anxiety. Our groomers bring portable, sanitized equipment into the comfort of your home to perform baths, deshedding, and nail trims.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
      },
      cta: {
        field: "",
        constantValue: {
          label: { defaultValue: "Check In-Home Availability" },
          link: { defaultValue: "#" },
          linkType: "URL",
          openInNewTab: false,
        },
        constantValueEnabled: true,
      },
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
          width: 1267,
          height: 1900,
        },
        constantValueEnabled: true,
      },
    },
    {
      title: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Pet Spa & Salon (Coming Soon!)",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
      },
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "We are expanding! Soon you'll be able to drop your pup off at our flagship luxury salon for daycare grooming, express nail trims, and premium pet retail shopping.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
      },
      cta: {
        field: "",
        constantValue: {
          label: { defaultValue: "Join Waitlist" },
          link: { defaultValue: "#" },
          linkType: "URL",
          openInNewTab: false,
        },
        constantValueEnabled: true,
      },
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
          width: 1267,
          height: 1900,
        },
        constantValueEnabled: true,
      },
    },
  ],
});

export type BusinessConsultingServicesSectionProps = {
  heading: StyledTextProps;
  intro: StyledRtfProps;
  cards: typeof serviceCardsSource.value;
  cardStyles: {
    title: SharedCardTextStyles;
    body: SharedCardTextStyles;
    cta: SharedCardCtaStyles;
    image: ServiceCardImageStyles;
  };
  cardBackgroundColor: ThemeColor;
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
};

const servicesSectionScope = "ybc-services-section";

const servicesSectionScopedTypographyStyles = `
  [data-scope="${servicesSectionScope}"] .ybc-services-section__grid {
    display: grid;
    gap: 20px;
    grid-template-columns: minmax(0, 1fr);
  }

  @media (min-width: 1200px) {
    [data-scope="${servicesSectionScope}"] .ybc-services-section__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  [data-scope="${servicesSectionScope}"] p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${servicesSectionScope}"] li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${servicesSectionScope}"] h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  [data-scope="${servicesSectionScope}"] h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  [data-scope="${servicesSectionScope}"] h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  [data-scope="${servicesSectionScope}"] h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  [data-scope="${servicesSectionScope}"] h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  [data-scope="${servicesSectionScope}"] h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  [data-scope="${servicesSectionScope}"] a {
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

const defaultCardCtaStyles: SharedCardCtaStyles = {
  variant: "primary",
  presetImage: "app-store",
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
    letterSpacing: "default",
    borderRadius: "default",
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
};

const BusinessConsultingServicesSectionFields: YextFields<BusinessConsultingServicesSectionProps> =
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
    intro: {
      label: "Intro",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.rich_text_v2"],
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
    cards: serviceCardsSource.field,
    cardStyles: {
      label: "Card Styles",
      type: "object",
      objectFields: {
        title: {
          label: "Title",
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
        body: {
          label: "Body",
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
        cta: {
          label: "CTA",
          type: "object",
          objectFields: {
            variant: {
              label: "Variant",
              type: "select",
              options: [
                { label: "Primary", value: "primary" },
                { label: "Secondary", value: "secondary" },
                { label: "Link", value: "link" },
              ],
            },
            presetImage: {
              label: "Preset Image",
              type: "basicSelector",
              options: "PRESET_IMAGE",
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
        image: {
          label: "Image",
          type: "object",
          objectFields: {
            aspectRatio: {
              label: "Aspect Ratio",
              type: "basicSelector",
              options: aspectRatioOptions,
            },
            imageConstrain: {
              label: "Image Constrain",
              type: "select",
              options: [
                { label: "Fixed", value: "fixed" },
                { label: "Filled", value: "filled" },
              ],
            },
            styles: {
              label: "Image Styles",
              type: "styledImage",
            },
          },
        },
      },
    },
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
  };

const BusinessConsultingServicesSectionComponent: PuckComponent<
  BusinessConsultingServicesSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const cards = serviceCardsSource.resolveItems(props.cards, streamDocument);
  const headingText =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const introStyles = getRichTextStyleOverrides(
    props.intro.styles,
    props.intro.fontColor ?? props.section.backgroundColor.contrastingColor,
  );
  const resolvedIntro = resolveComponentData(
    props.intro.text,
    locale,
    streamDocument,
  );

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`BusinessConsultingServicesSection${getAnalyticsScopeHash(props.id)}`}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          data-scope={servicesSectionScope}
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
            padding: "72px 24px",
          }}
        >
          <style>{servicesSectionScopedTypographyStyles}</style>
          <div style={{ margin: "0 auto", maxWidth: "1280px" }}>
            <div
              style={{
                margin: "0 auto 32px",
                maxWidth: "720px",
                textAlign: "center",
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
                  {headingText}
                </h2>
              </EntityField>
              <EntityField
                displayName="Intro"
                fieldId={props.intro.text.field}
                constantValueEnabled={props.intro.text.constantValueEnabled}
              >
                <div
                  style={{
                    lineHeight: 1.8,
                    margin: "14px 0 0",
                  }}
                >
                  {React.isValidElement(resolvedIntro) ? (
                    resolvedIntro
                  ) : (
                    <MaybeRTF
                      data={
                        typeof resolvedIntro === "string" ? resolvedIntro : ""
                      }
                      richTextStyleOverrides={introStyles}
                    />
                  )}
                </div>
              </EntityField>
            </div>
            <EntityField
              displayName="Service Cards"
              fieldId={props.cards.field}
              constantValueEnabled={props.cards.constantValueEnabled}
            >
              <div className="ybc-services-section__grid">
                {cards.map((card, index) => {
                  const resolvedTitle =
                    (card.title?.text
                      ? resolveComponentData(
                          card.title.text,
                          locale,
                          streamDocument,
                        )
                      : "") || "";
                  const cardTitleStyles = props.cardStyles.title;
                  const cardBodyStyles = props.cardStyles.body;
                  const cardCtaStyles = props.cardStyles.cta;
                  const cardImageStyles = props.cardStyles.image;
                  const bodyStyles = getRichTextStyleOverrides(
                    cardBodyStyles.styles,
                    cardBodyStyles.fontColor ??
                      props.cardBackgroundColor.contrastingColor,
                  );
                  const resolvedBody = card.body?.text
                    ? resolveComponentData(
                        card.body.text,
                        locale,
                        streamDocument,
                      )
                    : undefined;
                  const resolvedImage = card.image;
                  const imageUrl =
                    resolvedImage && "image" in resolvedImage
                      ? resolvedImage.image?.url
                      : resolvedImage?.url;
                  const showImage =
                    typeof imageUrl === "string" && imageUrl.trim().length > 0;
                  const resolvedCardCta = card.cta as
                    EnhancedTranslatableCTA | undefined;
                  const ctaLabel =
                    typeof resolvedCardCta?.label === "string"
                      ? resolvedCardCta.label
                      : (resolvedCardCta?.label?.defaultValue ?? "");
                  const ctaLink =
                    typeof resolvedCardCta?.link === "string"
                      ? resolvedCardCta.link
                      : (resolvedCardCta?.link?.defaultValue ?? "");
                  const cardCtaValue: ComprehensiveCTAValue | undefined =
                    ctaLabel && ctaLink
                      ? {
                          data: {
                            actionType: "link",
                            cta: {
                              field: "",
                              constantValue: {
                                label: ctaLabel,
                                link: ctaLink,
                                linkType: resolvedCardCta?.linkType ?? "URL",
                                ctaType:
                                  resolvedCardCta?.ctaType ?? "textAndLink",
                              },
                              constantValueEnabled: true,
                              selectedType:
                                resolvedCardCta?.ctaType ?? "textAndLink",
                            },
                            openInNewTab:
                              resolvedCardCta?.openInNewTab ?? false,
                          },
                          styles: {
                            variant: cardCtaStyles.variant,
                            presetImage:
                              cardCtaStyles.presetImage ?? "app-store",
                            color: cardCtaStyles.color,
                            button: cardCtaStyles.button,
                            link: cardCtaStyles.link,
                          },
                        }
                      : undefined;

                  return (
                    <Background
                      background={props.cardBackgroundColor}
                      key={`${resolvedTitle}-${index}`}
                      style={{
                        backgroundColor: getThemeColorCssValue("white"),
                        borderRadius: "25px",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden",
                        padding: "5px",
                      }}
                    >
                      <div
                        style={{
                          ...getSurfaceColorStyle(
                            props.cardBackgroundColor,
                            streamDocument,
                          ),
                          borderRadius: showImage ? "20px 20px 0 0" : "20px",
                          display: "flex",
                          flex: 1,
                          flexDirection: "column",
                          padding: "20px",
                        }}
                      >
                        <h3
                          style={{
                            color: getThemeColorCssValue(
                              cardTitleStyles.fontColor ??
                                props.cardBackgroundColor.contrastingColor,
                            ),
                            margin: 0,
                            ...(cardTitleStyles.styles.fontFamily !== "default"
                              ? {
                                  fontFamily: cardTitleStyles.styles.fontFamily,
                                }
                              : {}),
                            ...(cardTitleStyles.styles.fontSize !== "default"
                              ? { fontSize: cardTitleStyles.styles.fontSize }
                              : {}),
                            ...(cardTitleStyles.styles.fontStyle !== "default"
                              ? { fontStyle: cardTitleStyles.styles.fontStyle }
                              : {}),
                            ...(cardTitleStyles.styles.fontWeight !== "default"
                              ? {
                                  fontWeight: cardTitleStyles.styles.fontWeight,
                                }
                              : {}),
                            ...(cardTitleStyles.styles.textTransform !==
                            "default"
                              ? {
                                  textTransform:
                                    cardTitleStyles.styles.textTransform,
                                }
                              : {}),
                          }}
                        >
                          {resolvedTitle}
                        </h3>
                        <div
                          style={{
                            lineHeight: 1.8,
                            margin: "12px 0 18px",
                          }}
                        >
                          {React.isValidElement(resolvedBody) ? (
                            resolvedBody
                          ) : (
                            <MaybeRTF
                              data={
                                typeof resolvedBody === "string"
                                  ? resolvedBody
                                  : ""
                              }
                              richTextStyleOverrides={bodyStyles}
                            />
                          )}
                        </div>
                        {cardCtaValue ? (
                          <ComprehensiveCTA
                            value={cardCtaValue}
                            eventName={`cta${index}`}
                            style={{
                              borderRadius: "999px",
                              minHeight: "44px",
                              padding: "12px 16px",
                              textDecoration: "none",
                            }}
                          />
                        ) : null}
                      </div>
                      {showImage && resolvedImage ? (
                        <div
                          style={{
                            aspectRatio:
                              cardImageStyles.aspectRatio > 0
                                ? cardImageStyles.aspectRatio
                                : undefined,
                            ...getSurfaceColorStyle(
                              props.cardBackgroundColor,
                              streamDocument,
                            ),
                            borderRadius:
                              cardImageStyles.styles?.borderRadius === "default"
                                ? "0 0 20px 20px"
                                : cardImageStyles.styles?.borderRadius,
                            marginTop: "-1px",
                            minHeight: "200px",
                            overflow: "hidden",
                            position: "relative",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              inset: 0,
                              position: "absolute",
                            }}
                          >
                            <Image
                              image={resolvedImage}
                              className="h-full"
                              style={{
                                display: "block",
                                height: "100%",
                                objectFit:
                                  cardImageStyles.imageConstrain === "filled"
                                    ? "cover"
                                    : "contain",
                                width: "100%",
                              }}
                            />
                          </div>
                          <div
                            aria-hidden="true"
                            style={{
                              background: `linear-gradient(to bottom, ${getThemeColorCssValue(
                                props.cardBackgroundColor,
                              )}, transparent)`,
                              height: "131px",
                              left: 0,
                              pointerEvents: "none",
                              position: "absolute",
                              right: 0,
                              top: 0,
                            }}
                          />
                        </div>
                      ) : null}
                    </Background>
                  );
                })}
              </div>
            </EntityField>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessConsultingServicesSection: YextComponentConfig<BusinessConsultingServicesSectionProps> =
  {
    label: "Services Section",
    fields: BusinessConsultingServicesSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Our Grooming Services",
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
              "Skip the stressful car rides and chaotic salons. Choose the perfect, personalized care package for your furry family member.",
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
      cards: serviceCardsSource.defaultValue,
      cardStyles: {
        title: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
        },
        body: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
        },
        cta: defaultCardCtaStyles,
        image: {
          aspectRatio: 2,
          imageConstrain: "filled",
          styles: {
            borderRadius: "default",
          },
        },
      },
      cardBackgroundColor: {
        selectedColor: "palette-quaternary",
        contrastingColor: "palette-quaternary-contrast",
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
      <BusinessConsultingServicesSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessConsultingServicesSection",
  displayName: "Services Section",
  description: "Services Section",
  pageSetTypes: ["ENTITY"],
};
