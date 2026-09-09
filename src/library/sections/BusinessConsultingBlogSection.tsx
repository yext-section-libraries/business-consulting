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
  type CTAVariant,
  type EnhancedTranslatableCTA,
  type StyledButtonValue,
  YextComponentConfig,
  type YextCTAField,
  YextEntityField,
  YextFields,
  ThemeOptions,
  createItemSource,
  getDefaultRTF,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  type StyledImageValue,
  type StyledLinkValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
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

type BlogImageField = YextEntityField<
  ImageType | ComplexImageType | TranslatableAssetImage
>;

type BlogImageStyles = {
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
  color: ThemeColor;
  button: StyledButtonValue;
  link: StyledLinkValue;
};

type BlogCard = {
  title: Pick<StyledTextProps, "text">;
  body: Pick<StyledRtfProps, "text">;
  cta: YextCTAField;
  image: BlogImageField;
};

const blogCardsSource = createItemSource<BlogCard>({
  label: "Blog Cards",
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
            defaultValue:
              "Dog Coat Care Between Grooms: 5 Tips for Pet Parents",
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
              "Prevent painful matting and keep your dog's coat looking fresh between professional visits with these easy, 5-minute brushing habits.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
      },
      cta: {
        field: "",
        constantValue: {
          label: { defaultValue: "Read Grooming Guide" },
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
            defaultValue:
              "Understanding the Doodle Coat: How to Pick the Right Trim",
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
              "From kennel cuts to teddy bear trims, we break down the most popular Goldendoodle and Labradoodle styles and how to maintain them.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
      },
      cta: {
        field: "",
        constantValue: {
          label: { defaultValue: "Read Article" },
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

export type BusinessConsultingBlogSectionProps = {
  heading: StyledTextProps;
  cards: typeof blogCardsSource.value;
  cardStyles: {
    title: SharedCardTextStyles;
    body: SharedCardTextStyles;
    cta: SharedCardCtaStyles;
    image: BlogImageStyles;
  };
  cardBackgroundColor: ThemeColor;
  cardOverlayColor: ThemeColor;
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
};

const blogSectionScope = "ybc-blog-section";

const blogSectionScopedTypographyStyles = `
  [data-scope="${blogSectionScope}"] .ybc-blog-section__grid {
    display: grid;
    gap: 20px;
    grid-template-columns: minmax(0, 1fr);
  }

  @media (min-width: 1200px) {
    [data-scope="${blogSectionScope}"] .ybc-blog-section__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  [data-scope="${blogSectionScope}"] p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${blogSectionScope}"] li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${blogSectionScope}"] h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  [data-scope="${blogSectionScope}"] h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  [data-scope="${blogSectionScope}"] h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  [data-scope="${blogSectionScope}"] h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  [data-scope="${blogSectionScope}"] h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  [data-scope="${blogSectionScope}"] h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  [data-scope="${blogSectionScope}"] a {
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

const BusinessConsultingBlogSectionFields: YextFields<BusinessConsultingBlogSectionProps> =
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
    cards: blogCardsSource.field,
    cardStyles: {
      label: "Card Styles",
      type: "object",
      objectFields: {
        title: {
          label: "Title",
          type: "object",
          objectFields: {
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
            styles: { label: "Text Styles", type: "styledText" },
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
              options: ThemeOptions.ASPECT_RATIO,
            },
            imageConstrain: {
              label: "Image Constrain",
              type: "select",
              options: [
                { label: "Fixed", value: "fixed" },
                { label: "Filled", value: "filled" },
              ],
            },
            styles: { label: "Image Styles", type: "styledImage" },
          },
        },
      },
    },
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    cardOverlayColor: {
      label: "Card Overlay Color",
      type: "basicSelector",
      optionGroups: ThemeOptions.SITE_COLOR.map((group) => ({
        ...group,
        options: group.options.filter((option) => option.value !== undefined),
      })).filter((group) => group.options.length > 0),
    },
  };

const BusinessConsultingBlogSectionComponent: PuckComponent<
  BusinessConsultingBlogSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const cards = blogCardsSource.resolveItems(props.cards, streamDocument);
  const cardOverlayColor = props.cardOverlayColor ?? {
    selectedColor: "black",
    contrastingColor: "white",
  };

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`BusinessConsultingBlogSection${getAnalyticsScopeHash(props.id)}`}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          data-scope={blogSectionScope}
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
            padding: "72px 24px",
          }}
        >
          <style>{blogSectionScopedTypographyStyles}</style>
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
            <EntityField
              displayName="Blog Cards"
              fieldId={props.cards.field}
              constantValueEnabled={props.cards.constantValueEnabled}
            >
              <div className="ybc-blog-section__grid">
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
                  const bodyStyleOverrides = {
                    color: getThemeColorCssValue(
                      cardBodyStyles.fontColor ??
                        cardOverlayColor.contrastingColor,
                    ),
                    ...(cardBodyStyles.styles.fontFamily !== "default"
                      ? { fontFamily: cardBodyStyles.styles.fontFamily }
                      : {}),
                    ...(cardBodyStyles.styles.fontSize !== "default"
                      ? { fontSize: cardBodyStyles.styles.fontSize }
                      : {}),
                    ...(cardBodyStyles.styles.fontStyle !== "default"
                      ? { fontStyle: cardBodyStyles.styles.fontStyle }
                      : {}),
                    ...(cardBodyStyles.styles.fontWeight !== "default"
                      ? { fontWeight: cardBodyStyles.styles.fontWeight }
                      : {}),
                    ...(cardBodyStyles.styles.textTransform !== "default"
                      ? { textTransform: cardBodyStyles.styles.textTransform }
                      : {}),
                  };
                  const resolvedBody = card.body?.text
                    ? resolveComponentData(
                        card.body.text,
                        locale,
                        streamDocument,
                        {
                          richTextStyleOverrides: bodyStyleOverrides,
                        },
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
                  const cardCtaValue =
                    ctaLabel && ctaLink
                      ? {
                          data: {
                            actionType: "link" as const,
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
                            color: cardCtaStyles.color,
                            button: cardCtaStyles.button,
                            link: cardCtaStyles.link,
                          },
                        }
                      : undefined;

                  return (
                    <Background
                      background={props.cardBackgroundColor}
                      key={`${resolvedTitle || "article"}-${index}`}
                      style={{
                        ...getSurfaceColorStyle(
                          props.cardBackgroundColor,
                          streamDocument,
                        ),
                        borderRadius: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        minHeight: "510px",
                        minWidth: 0,
                        overflow: "hidden",
                        padding: "5px",
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      {showImage && resolvedImage ? (
                        <div
                          style={{
                            borderRadius:
                              cardImageStyles.styles?.borderRadius === "default"
                                ? "15px"
                                : cardImageStyles.styles?.borderRadius,
                            inset: "5px",
                            overflow: "hidden",
                            position: "absolute",
                          }}
                        >
                          <Image
                            image={resolvedImage}
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
                      ) : null}
                      <div
                        aria-hidden="true"
                        style={{
                          background: showImage
                            ? `linear-gradient(to bottom, transparent, ${getThemeColorCssValue(
                                cardOverlayColor,
                              )})`
                            : getThemeColorCssValue(cardOverlayColor),
                          borderRadius:
                            cardImageStyles.styles?.borderRadius === "default"
                              ? "15px"
                              : cardImageStyles.styles?.borderRadius,
                          inset: "5px",
                          pointerEvents: "none",
                          position: "absolute",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "20px",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <h3
                          style={{
                            color: getThemeColorCssValue(
                              cardTitleStyles.fontColor ??
                                cardOverlayColor.contrastingColor,
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
                        <div style={{ margin: "12px 0 16px" }}>
                          {React.isValidElement(resolvedBody) ? (
                            resolvedBody
                          ) : (
                            <MaybeRTF
                              data={
                                typeof resolvedBody === "string"
                                  ? resolvedBody
                                  : ""
                              }
                              richTextStyleOverrides={bodyStyleOverrides}
                            />
                          )}
                        </div>
                        {cardCtaValue ? (
                          <ComprehensiveCTA
                            value={cardCtaValue}
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
                        ) : null}
                      </div>
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

export const BusinessConsultingBlogSection: YextComponentConfig<BusinessConsultingBlogSectionProps> =
  {
    label: "Blog Section",
    fields: BusinessConsultingBlogSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "From the Blog: The Healthy Pup Guide",
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
      cards: blogCardsSource.defaultValue,
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
          aspectRatio: 1.22,
          imageConstrain: "filled",
          styles: { borderRadius: "default" },
        },
      },
      cardBackgroundColor: {
        selectedColor: "white",
        contrastingColor: "black",
      },
      cardOverlayColor: {
        selectedColor: "black",
        contrastingColor: "white",
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
      <BusinessConsultingBlogSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessConsultingBlogSection",
  displayName: "Blog Section",
  description: "Blog Section",
  pageSetTypes: ["ENTITY"],
};
