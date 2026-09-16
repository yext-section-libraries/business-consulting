import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import { useTranslation } from "react-i18next";
import {
  AnalyticsScopeProvider,
  type ComplexImageType,
  type HoursType,
  type ImageType,
} from "@yext/pages-components";
import {
  msg,
  Background,
  ComprehensiveCTA,
  EntityField,
  Image,
  MaybeRTF,
  VisibilityWrapper,
  YextComponentConfig,
  YextEntityField,
  YextFields,
  getAggregateRating,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getDefaultRTF,
  getThemeColorCssValue,
  resolveComponentData,
  type ComprehensiveCTAValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type StyledImageValue,
  useDocument,
} from "@yext/visual-editor";
import {
  aspectRatioOptions,
  getRichTextStyleOverrides,
  getScopedTypographyStyles,
  type StyledRtfProps,
  type StyledTextProps,
} from "../shared/sectionHelpers";
import { LocalizedHoursStatus } from "../shared/components/contentBlocks/HoursStatus";

type HeroImageField = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type HoursStatusStyles = {
  showCurrentStatus: boolean;
  timeFormat: "12h" | "24h";
  dayOfWeekFormat: "short" | "long";
  showDayNames: boolean;
};

export type BusinessConsultingHeroSectionProps = {
  heading: StyledTextProps;
  body: StyledRtfProps;
  heroImage: HeroImageField;
  primaryCta: ComprehensiveCTAValue;
  secondaryCta: ComprehensiveCTAValue;
  hours: YextEntityField<HoursType>;
  hoursStyles: HoursStatusStyles;
  statusIndicatorColor: ThemeColor;
  reviewSummaryColor: ThemeColor;
  starColor: ThemeColor;
  cardBackgroundColor: ThemeColor;
  section: {
    visibleOnLivePage: boolean;
  };
};

const BusinessConsultingHeroSectionFields: YextFields<BusinessConsultingHeroSectionProps> =
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
      },
    },
    heading: {
      label: msg("fields.heading", "Heading"),
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
    body: {
      label: msg("fields.body", "Body"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: {
            types: ["type.rich_text_v2"],
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
    heroImage: {
      label: msg("fields.heroImage", "Hero Image"),
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: msg("fields.image", "Image"),
          filter: {
            types: ["type.image"],
          },
        },
        aspectRatio: {
          label: msg("fields.options.aspectRatio", "Aspect Ratio"),
          type: "basicSelector",
          options: aspectRatioOptions,
          visible: false,
        },
        imageConstrain: {
          label: msg("fields.imageConstrain", "Image Constrain"),
          type: "select",
          options: [
            { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
            { label: msg("fields.options.filled", "Filled"), value: "filled" },
          ],
        },
        styles: {
          label: msg("fields.imageStyles", "Image Styles"),
          type: "styledImage",
          visible: false,
        },
      },
    },
    primaryCta: {
      label: msg("fields.primaryCallToAction", "Primary Call to Action"),
      type: "comprehensiveCTA",
    },
    secondaryCta: {
      label: msg("fields.secondaryCallToAction", "Secondary Call to Action"),
      type: "comprehensiveCTA",
    },
    hoursStyles: {
      label: msg("fields.hoursStyles", "Hours Styles"),
      type: "object",
      objectFields: {
        showCurrentStatus: {
          label: msg("fields.showCurrentStatus", "Show Current Status"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        timeFormat: {
          label: msg("fields.timeFormat", "Time Format"),
          type: "select",
          options: [
            { label: msg("fields.options.hour12Label", "12 Hour"), value: "12h" },
            { label: msg("fields.options.hour24Label", "24 Hour"), value: "24h" },
          ],
        },
        dayOfWeekFormat: {
          label: msg("fields.dayOfWeekFormatLabel", "Day Of Week Format"),
          type: "select",
          options: [
            { label: msg("fields.options.short", "Short"), value: "short" },
            { label: msg("fields.options.long", "Long"), value: "long" },
          ],
        },
        showDayNames: {
          label: msg("fields.showDayNames", "Show Day Names"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
    hours: {
      type: "entityField",
      label: msg("fields.hours", "Hours"),
      filter: {
        types: ["type.hours"],
      },
      disableConstantValueToggle: true,
    },
    statusIndicatorColor: {
      label: msg("fields.statusIndicatorColor", "Status Indicator Color"),
      type: "basicSelector",
      options: "SITE_COLOR",
    },
    reviewSummaryColor: {
      label: msg("fields.reviewSummaryColor", "Review Summary Color"),
      type: "basicSelector",
      options: "SITE_COLOR",
    },
    starColor: {
      label: msg("fields.starColor", "Star Color"),
      type: "basicSelector",
      options: "SITE_COLOR",
    },
    cardBackgroundColor: {
      label: msg("fields.cardBackgroundColor", "Card Background Color"),
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
  };

const buttonBaseStyle: React.CSSProperties = {
  alignItems: "center",
  borderRadius: "999px",
  display: "inline-flex",
  fontSize: "13.1px",
  fontWeight: 600,
  justifyContent: "center",
  minHeight: "53px",
  padding: "15px 17px",
  textDecoration: "none",
};

const defaultStatusIndicatorColor: ThemeColor = {
  selectedColor: "palette-secondary",
  contrastingColor: "palette-secondary-contrast",
};

const defaultStarColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const heroSectionScope = "ybc-hero-section";

const heroSectionScopedTypographyStyles =
  getScopedTypographyStyles(heroSectionScope);

const BusinessConsultingHeroSectionComponent: PuckComponent<BusinessConsultingHeroSectionProps> =
  (props) => {
    const { t } = useTranslation();
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const statusIndicatorColor =
      props.statusIndicatorColor ?? defaultStatusIndicatorColor;
    const cardForegroundColor = getThemeColorCssValue(
      props.cardBackgroundColor.contrastingColor,
    );
    const reviewSummaryColor =
      props.reviewSummaryColor ?? props.cardBackgroundColor.contrastingColor;
    const starColor = props.starColor ?? defaultStarColor;
    const resolvedHeading =
      resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const bodyStyleOverrides = getRichTextStyleOverrides(
      props.body.styles,
      props.body.fontColor ?? props.cardBackgroundColor.contrastingColor,
    );
    const resolvedBody = resolveComponentData(
      props.body.text,
      locale,
      streamDocument,
    );
    const resolvedHeroImage = resolveComponentData(
      props.heroImage.image,
      locale,
      streamDocument,
    ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
    const heroImageUrl =
      resolvedHeroImage && "image" in resolvedHeroImage
        ? resolvedHeroImage.image?.url
        : resolvedHeroImage?.url;
    const showHeroImage =
      typeof heroImageUrl === "string" && heroImageUrl.trim().length > 0;
    const resolvedHours = resolveComponentData(
      props.hours,
      locale,
      streamDocument,
    ) as HoursType | undefined;
    const { averageRating, reviewCount } = getAggregateRating(streamDocument);
    const firstPartyAggregate = (
      streamDocument as {
        ref_reviewsAgg?: Array<{ publisher?: string }>;
      }
    ).ref_reviewsAgg?.find((aggregate) => aggregate.publisher === "FIRSTPARTY");

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`BusinessConsultingHeroSection${getAnalyticsScopeHash(props.id)}`}
        >
          <section
            data-scope={heroSectionScope}
            style={{
              overflow: "hidden",
              position: "relative",
            }}
          >
            <style>{heroSectionScopedTypographyStyles}</style>
            {showHeroImage && resolvedHeroImage ? (
              <EntityField
                displayName="Hero Image"
                fieldId={props.heroImage.image.field}
                constantValueEnabled={props.heroImage.image.constantValueEnabled}
              >
                <div
                  style={{
                    borderRadius:
                      props.heroImage.styles?.borderRadius === "default"
                        ? undefined
                        : props.heroImage.styles?.borderRadius,
                    inset: 0,
                    overflow:
                      props.heroImage.imageConstrain === "filled" ||
                      Boolean(
                        props.heroImage.styles?.borderRadius &&
                          props.heroImage.styles.borderRadius !== "default",
                      )
                        ? "hidden"
                        : undefined,
                    position: "absolute",
                  }}
                >
                  <div
                    style={{
                      aspectRatio:
                        props.heroImage.aspectRatio > 0
                          ? props.heroImage.aspectRatio
                          : undefined,
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <Image
                      image={resolvedHeroImage}
                      className="h-full"
                      style={{
                        display: "block",
                        height: props.heroImage.aspectRatio > 0 ? "100%" : "100%",
                        objectFit:
                          props.heroImage.imageConstrain === "filled"
                            ? "cover"
                            : "contain",
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              </EntityField>
            ) : null}
            <div
              style={{
                margin: "0 auto",
                maxWidth: "1280px",
                padding: "64px 24px 72px",
                position: "relative",
              }}
            >
              <Background
                background={props.cardBackgroundColor}
                style={{
                  ...getSurfaceColorStyle(
                    props.cardBackgroundColor,
                    streamDocument,
                  ),
                  borderRadius: "24px",
                  margin: "0 auto",
                  maxWidth: "760px",
                  padding: "28px 32px",
                  textAlign: "center",
                }}
              >
                <EntityField
                  displayName="Heading"
                  fieldId={props.heading.text.field}
                  constantValueEnabled={props.heading.text.constantValueEnabled}
                >
                  <h1
                    style={{
                      color: getThemeColorCssValue(
                        props.heading.fontColor ??
                          props.cardBackgroundColor.contrastingColor,
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
                  </h1>
                </EntityField>
                {resolvedHours && props.hoursStyles.showCurrentStatus ? (
                  <EntityField
                    displayName={t("hoursStatus", "Hours Status")}
                    fieldId={props.hours.field}
                    constantValueEnabled={props.hours.constantValueEnabled}
                  >
                    <div
                      style={{
                        alignItems: "center",
                        color: cardForegroundColor,
                        display: "inline-flex",
                        gap: "8px",
                        marginTop: "18px",
                        padding: "8px 14px",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: getThemeColorCssValue(statusIndicatorColor),
                          borderRadius: "999px",
                          display: "inline-block",
                          height: "10px",
                          width: "10px",
                        }}
                      />
                      <LocalizedHoursStatus
                        hours={resolvedHours}
                        className=""
                        comingSoon={streamDocument.comingSoon}
                        showCurrentStatus
                        showDayNames={props.hoursStyles.showDayNames}
                        dayOfWeekFormat={props.hoursStyles.dayOfWeekFormat}
                        timeFormat={props.hoursStyles.timeFormat}
                        timezone={
                          (streamDocument as { timezone?: string }).timezone ??
                          "America/New_York"
                        }
                      />
                    </div>
                  </EntityField>
                ) : null}
                {firstPartyAggregate &&
                typeof averageRating === "number" &&
                typeof reviewCount === "number" ? (
                  <div
                    style={{
                      alignItems: "center",
                      color: getThemeColorCssValue(reviewSummaryColor),
                      display: "inline-flex",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: getThemeColorCssValue(starColor),
                        fontSize: "16px",
                      }}
                    >
                      {t("fiveStars", "★★★★★")}
                    </span>
                    <span>
                      {t(
                        "petParentReviewSummary",
                        "{{averageRating}} stars from {{reviewCount}} pet parent reviews",
                        { averageRating, reviewCount },
                      )}
                    </span>
                  </div>
                ) : null}
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
                        data={typeof resolvedBody === "string" ? resolvedBody : ""}
                        richTextStyleOverrides={bodyStyleOverrides}
                      />
                    )}
                  </div>
                </EntityField>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    justifyContent: "center",
                    marginTop: "22px",
                  }}
                >
                  <EntityField
                    displayName="Primary Call to Action"
                    fieldId={props.primaryCta.data.cta.field}
                    constantValueEnabled={
                      props.primaryCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={{
                        data: props.primaryCta.data,
                        styles: props.primaryCta.styles,
                      }}
                      eventName="primaryCta"
                      style={{
                        ...buttonBaseStyle,
                      }}
                    />
                  </EntityField>
                  <EntityField
                    displayName="Secondary Call to Action"
                    fieldId={props.secondaryCta.data.cta.field}
                    constantValueEnabled={
                      props.secondaryCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={{
                        data: props.secondaryCta.data,
                        styles: props.secondaryCta.styles,
                      }}
                      eventName="secondaryCta"
                      style={{
                        ...buttonBaseStyle,
                      }}
                    />
                  </EntityField>
                </div>
              </Background>
            </div>
          </section>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const BusinessConsultingHeroSection: YextComponentConfig<BusinessConsultingHeroSectionProps> =
  {
    label: msg("components.heroSection", "Hero Section"),
    fields: BusinessConsultingHeroSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "name",
          constantValue: {
            defaultValue: "",
          },
          constantValueEnabled: false,
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
              "[[name]] delivers a stress-free, cage-free luxury grooming experience right to your doorstep. Serving Falls Church, VA and surrounding neighborhoods, our certified groomers combine premium organic products with state-of-the-art mobile vans to keep your pup happy, healthy, and pristine.",
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
      heroImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/vQqhmnexQfZueJGyh5M_j5W4EcTkTyZlW93eIoqjjvQ/1900x1267.jpg",
            width: 1900,
            height: 1267,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1.5,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
      primaryCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              label: "Book Online Now",
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
      secondaryCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              label: "View Service Areas & Rates",
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
            selectedColor: "palette-quaternary",
            contrastingColor: "palette-quaternary-contrast",
          },
        },
      },
      hours: {
        field: "hours",
        constantValue: {},
        constantValueEnabled: false,
      },
      hoursStyles: {
        showCurrentStatus: true,
        timeFormat: "12h",
        dayOfWeekFormat: "short",
        showDayNames: false,
      },
      statusIndicatorColor: defaultStatusIndicatorColor,
      reviewSummaryColor: {
        selectedColor: "palette-secondary",
        contrastingColor: "palette-secondary-contrast",
      },
      starColor: defaultStarColor,
      cardBackgroundColor: {
        selectedColor: "white",
        contrastingColor: "black",
      },
      section: {
        visibleOnLivePage: true,
      },
    },
    render: (props) => <BusinessConsultingHeroSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "BusinessConsultingHeroSection",
  displayName: "Hero Section",
  description: "Hero Section",
  pageSetTypes: ["ENTITY"],
};
