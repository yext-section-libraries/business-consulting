import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  EntityField,
  VisibilityWrapper,
  YextComponentConfig,
  YextEntityField,
  YextFields,
  getAggregateRating,
  getAnalyticsScopeHash,
  getThemeColorCssValue,
  resolveComponentData,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  useDocument,
} from "@yext/visual-editor";

type ReviewRecord = {
  authorName?: string;
  rating?: number;
  content?: string;
  reviewDate?: string;
  comments?: Array<{
    content?: string;
    commentDate?: string;
  }>;
};

type ReviewAggregateRecord = {
  publisher?: string;
  topReviews?: ReviewRecord[];
};

type ReviewDocument = {
  ref_reviewsAgg?: ReviewAggregateRecord[];
  locale?: string;
};

type StyledHeadingProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

export type BusinessConsultingReviewsSectionProps = {
  heading: StyledHeadingProps;
  responseLabel: StyledHeadingProps;
  summaryTextColor?: ThemeColor;
  reviewTextColor?: ThemeColor;
  starColor: ThemeColor;
  cardBackgroundColor: ThemeColor;
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const reviewsSectionScope = "ybc-reviews-section";

const reviewsSectionScopedTypographyStyles = `
  [data-scope="${reviewsSectionScope}"] p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${reviewsSectionScope}"] li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${reviewsSectionScope}"] h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  [data-scope="${reviewsSectionScope}"] h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  [data-scope="${reviewsSectionScope}"] h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  [data-scope="${reviewsSectionScope}"] h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  [data-scope="${reviewsSectionScope}"] h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  [data-scope="${reviewsSectionScope}"] h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  [data-scope="${reviewsSectionScope}"] a {
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

const BusinessConsultingReviewsSectionFields: YextFields<BusinessConsultingReviewsSectionProps> =
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
    responseLabel: {
      label: "Response Label",
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
    summaryTextColor: {
      label: "Summary Text Color",
      type: "basicSelector",
      options: "SITE_COLOR",
    },
    reviewTextColor: {
      label: "Review Text Color",
      type: "basicSelector",
      options: "SITE_COLOR",
    },
    starColor: {
      label: "Star Color",
      type: "basicSelector",
      options: "SITE_COLOR",
    },
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
  };

const renderStars = (rating: number) => {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));

  return "★★★★★".slice(0, rounded);
};

const defaultResponseLabel: StyledHeadingProps = {
  text: {
    field: "",
    constantValue: {
      defaultValue: "Business response",
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
  styles: {
    fontFamily: "default",
    fontSize: "default",
    fontWeight: "600",
    fontStyle: "default",
    textTransform: "default",
  },
  fontColor: undefined,
};

const defaultStarColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const editorFallbackReviews: ReviewRecord[] = [
  {
    authorName: "Maya T.",
    rating: 5,
    reviewDate: "2026-01-18",
    content:
      "This is a placeholder review because this location doesn’t have any reviews yet.",
  },
  {
    authorName: "Jordan R.",
    rating: 5,
    reviewDate: "2026-02-07",
    content:
      "This is a placeholder review because this location doesn’t have any reviews yet.",
  },
  {
    authorName: "Alex P.",
    rating: 4,
    reviewDate: "2026-03-11",
    content:
      "This is a placeholder review because this location doesn’t have any reviews yet.",
  },
];

const BusinessConsultingReviewsSectionComponent: PuckComponent<BusinessConsultingReviewsSectionProps> =
  (props) => {
    const streamDocument = useDocument<ReviewDocument>();
    const locale = streamDocument.locale ?? "en";
    const { averageRating, reviewCount } = getAggregateRating(streamDocument);
    const firstPartyAggregate = streamDocument.ref_reviewsAgg?.find(
      (aggregate) => aggregate.publisher === "FIRSTPARTY",
    );
    const reviews = firstPartyAggregate?.topReviews?.slice(0, 3) ?? [];
    const displayedReviews =
      reviews.length > 0
        ? reviews
        : props.puck.isEditing
          ? editorFallbackReviews
          : [];
    const responseLabel = props.responseLabel ?? defaultResponseLabel;
    const resolvedHeading =
      resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const resolvedResponseLabel =
      resolveComponentData(responseLabel.text, locale, streamDocument) || "";
    const headingColor = getThemeColorCssValue(
      props.heading.fontColor ?? props.section.backgroundColor.contrastingColor,
    );
    const summaryTextColor = getThemeColorCssValue(
      props.summaryTextColor ?? props.section.backgroundColor.contrastingColor,
    );
    const reviewTextColor = getThemeColorCssValue(
      props.reviewTextColor ?? props.cardBackgroundColor.contrastingColor,
    );
    const starColor = getThemeColorCssValue(props.starColor ?? defaultStarColor);
    const responseLabelColor = getThemeColorCssValue(
      responseLabel.fontColor ?? props.cardBackgroundColor.contrastingColor,
    );
    const responseLabelStyle: React.CSSProperties = {
      color: responseLabelColor,
      fontWeight: 600,
      margin: 0,
      ...(responseLabel.styles.fontFamily !== "default"
        ? { fontFamily: responseLabel.styles.fontFamily }
        : {}),
      ...(responseLabel.styles.fontSize !== "default"
        ? { fontSize: responseLabel.styles.fontSize }
        : {}),
      ...(responseLabel.styles.fontStyle !== "default"
        ? { fontStyle: responseLabel.styles.fontStyle }
        : {}),
      ...(responseLabel.styles.fontWeight !== "default"
        ? { fontWeight: responseLabel.styles.fontWeight }
        : {}),
      ...(responseLabel.styles.textTransform !== "default"
        ? { textTransform: responseLabel.styles.textTransform }
        : {}),
    };

    if (!displayedReviews.length) {
      if (!props.puck.isEditing) {
        return <></>;
      }
    }

    const formattedReviewDate = (reviewDate?: string) => {
      if (!reviewDate) {
        return "";
      }

      const parsedDate = new Date(reviewDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return reviewDate;
      }

      return new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(parsedDate);
    };

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`BusinessConsultingReviewsSection${getAnalyticsScopeHash(props.id)}`}
        >
          <section
            data-scope={reviewsSectionScope}
            style={{
              backgroundColor: getThemeColorCssValue(props.section.backgroundColor),
              padding: "72px 24px",
            }}
          >
            <style>{reviewsSectionScopedTypographyStyles}</style>
            <div style={{ margin: "0 auto", maxWidth: "1280px" }}>
              <div style={{ textAlign: "center" }}>
                <EntityField
                  displayName="Heading"
                  fieldId={props.heading.text.field}
                  constantValueEnabled={props.heading.text.constantValueEnabled}
                >
                  <h2
                    style={{
                      color: headingColor,
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
                {reviews.length > 0 &&
                typeof averageRating === "number" &&
                typeof reviewCount === "number" ? (
                  <p style={{ color: summaryTextColor, marginTop: "12px" }}>
                    <span style={{ color: starColor }}>{renderStars(averageRating)}</span>{" "}
                    {`${averageRating} stars from ${reviewCount} pet parent reviews`}
                  </p>
                ) : null}
              </div>
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  marginTop: "28px",
                }}
              >
                {displayedReviews.map((review, index) => (
                    <article
                      key={`${review.authorName ?? "review"}-${index}`}
                      style={{
                        backgroundColor: getThemeColorCssValue(props.cardBackgroundColor),
                        borderRadius: "20px",
                        padding: "22px",
                      }}
                    >
                      <p style={{ color: reviewTextColor, margin: 0 }}>
                        <span style={{ color: starColor }}>{renderStars(review.rating ?? 5)}</span>{" "}
                        {`${review.rating ?? 5}/5 stars`}
                      </p>
                      <p style={{ color: reviewTextColor, fontWeight: 600, margin: "14px 0 10px" }}>{review.authorName}</p>
                      {review.reviewDate ? (
                        <p
                          style={{
                            color: reviewTextColor,
                            fontSize: "14px",
                            margin: "0 0 12px",
                          }}
                        >
                          {formattedReviewDate(review.reviewDate)}
                        </p>
                      ) : null}
                      <p style={{ color: reviewTextColor, lineHeight: 1.8, margin: 0 }}>
                        {review.content}
                      </p>
                      {review.comments?.[0]?.content ? (
                        <div
                          style={{
                            borderTopColor: reviewTextColor,
                            borderTopStyle: "solid",
                            borderTopWidth: "1px",
                            marginTop: "16px",
                            paddingTop: "16px",
                          }}
                        >
                          <EntityField
                            displayName="Response Label"
                            fieldId={responseLabel.text.field}
                            constantValueEnabled={
                              responseLabel.text.constantValueEnabled
                            }
                          >
                            <p style={responseLabelStyle}>{resolvedResponseLabel}</p>
                          </EntityField>
                          <p
                            style={{
                              color: reviewTextColor,
                              lineHeight: 1.8,
                              margin: "10px 0 0",
                            }}
                          >
                            {review.comments[0].content}
                          </p>
                        </div>
                      ) : null}
                    </article>
                  ))}
              </div>
            </div>
          </section>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const BusinessConsultingReviewsSection: YextComponentConfig<BusinessConsultingReviewsSectionProps> =
  {
    label: "Reviews Section",
    fields: BusinessConsultingReviewsSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "What Local Pet Parents Are Saying",
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
      responseLabel: defaultResponseLabel,
      summaryTextColor: undefined,
      reviewTextColor: undefined,
      starColor: defaultStarColor,
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
    render: (props) => <BusinessConsultingReviewsSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "BusinessConsultingReviewsSection",
  displayName: "Reviews Section",
  description: "Reviews Section",
  pageSetTypes: ["ENTITY"],
};
