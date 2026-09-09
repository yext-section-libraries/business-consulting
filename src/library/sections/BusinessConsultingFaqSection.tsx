import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, useAnalytics } from "@yext/pages-components";
import {
  Background,
  EntityField,
  MaybeRTF,
  VisibilityWrapper,
  YextComponentConfig,
  YextEntityField,
  YextFields,
  createItemSource,
  getDefaultRTF,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
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

type FaqItem = {
  question: YextEntityField<TranslatableString>;
  answer: YextEntityField<TranslatableRichText>;
};

const faqItemsSource = createItemSource<FaqItem>({
  label: "FAQs",
  mappingFields: {
    question: {
      type: "entityField",
      label: "Question",
      filter: { types: ["type.string"] },
    },
    answer: {
      type: "entityField",
      label: "Answer",
      filter: { types: ["type.rich_text_v2"] },
    },
  },
  defaultValues: [
    {
      question: {
        field: "",
        constantValue: {
          defaultValue:
            "Do you need to plug into my electricity or water supply?",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Not at all! Our luxury mobile grooming vans are completely self-sufficient. They are equipped with their own quiet generators, fresh warm water tanks, and gray-water filtration systems.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue:
            "What is your policy for aggressive or highly anxious dogs?",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Safety is our top priority. We require a brief meet-and-greet for reactive or highly anxious pets so we can tailor handling techniques, session length, and staffing. We never force a dog through a service they cannot tolerate safely.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue: "How long does a mobile grooming session take?",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Most full grooming sessions take between 90 and 150 minutes depending on breed, coat condition, and temperament. We schedule one dog per van at a time so your pet never waits in a kennel.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue: "What weight limits do you have for mobile grooming?",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Our mobile vans safely accommodate dogs up to 75 lbs. For larger breeds, ask about our in-home pampering options or salon waitlist for when our flagship location opens.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue: "What is your cancellation and rescheduling policy?",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "You may cancel or reschedule free of charge up to 24 hours before your appointment. Late cancellations may incur a fee so we can hold the time slot for another pet parent.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
    },
  ],
});

type FaqItemStyles = {
  question: Omit<StyledTextProps, "text">;
  answer: Omit<StyledRtfProps, "text">;
};

export type BusinessConsultingFaqSectionProps = {
  heading: StyledTextProps;
  items: typeof faqItemsSource.value;
  itemStyles?: FaqItemStyles;
  rowBackgroundColor: ThemeColor;
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
};

const faqSectionScope = "ybc-faq-section";

const defaultFaqItemStyles: FaqItemStyles = {
  question: {
    styles: {
      fontFamily: "default",
      fontSize: "16px",
      fontWeight: "600",
      fontStyle: "default",
      textTransform: "default",
    },
  },
  answer: {
    styles: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
    },
  },
};

const faqSectionScopedTypographyStyles = `
  [data-scope="${faqSectionScope}"] p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${faqSectionScope}"] li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${faqSectionScope}"] h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  [data-scope="${faqSectionScope}"] h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  [data-scope="${faqSectionScope}"] h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  [data-scope="${faqSectionScope}"] h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  [data-scope="${faqSectionScope}"] h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  [data-scope="${faqSectionScope}"] h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  [data-scope="${faqSectionScope}"] a {
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

const BusinessConsultingFaqSectionFields: YextFields<BusinessConsultingFaqSectionProps> =
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
    items: faqItemsSource.field,
    itemStyles: {
      label: "Item Styles",
      type: "object",
      objectFields: {
        question: {
          label: "Question",
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
        answer: {
          label: "Answer",
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
      },
    },
    rowBackgroundColor: {
      label: "Row Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
  };

const BusinessConsultingFaqSectionComponent: PuckComponent<
  BusinessConsultingFaqSectionProps
> = (props) => {
  const analytics = useAnalytics();
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const items = faqItemsSource.resolveItems(props.items, streamDocument);
  const defaultOpenIndex = items.length > 0 ? 0 : -1;
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const [openIndex, setOpenIndex] = React.useState(defaultOpenIndex);

  React.useEffect(() => {
    setOpenIndex(defaultOpenIndex);
  }, [defaultOpenIndex]);

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`BusinessConsultingFaqSection${getAnalyticsScopeHash(props.id)}`}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          data-scope={faqSectionScope}
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
            padding: "72px 24px",
          }}
        >
          <style>{faqSectionScopedTypographyStyles}</style>
          <div style={{ margin: "0 auto", maxWidth: "800px" }}>
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
              displayName="FAQs"
              fieldId={props.items.field}
              constantValueEnabled={props.items.constantValueEnabled}
            >
              <div style={{ display: "grid", gap: "14px" }}>
                {items.map((item, index) => {
                  const isOpen = openIndex === index;
                  const resolvedQuestion = item.question
                    ? resolveComponentData(
                        item.question,
                        locale,
                        streamDocument,
                      )
                    : "";
                  const questionStyles =
                    props.itemStyles?.question ?? defaultFaqItemStyles.question;
                  const answerStyles =
                    props.itemStyles?.answer ?? defaultFaqItemStyles.answer;
                  const answerStyleOverrides = {
                    color: getThemeColorCssValue(
                      answerStyles.fontColor ??
                        props.rowBackgroundColor.contrastingColor,
                    ),
                    ...(answerStyles.styles.fontFamily !== "default"
                      ? { fontFamily: answerStyles.styles.fontFamily }
                      : {}),
                    ...(answerStyles.styles.fontSize !== "default"
                      ? { fontSize: answerStyles.styles.fontSize }
                      : {}),
                    ...(answerStyles.styles.fontStyle !== "default"
                      ? { fontStyle: answerStyles.styles.fontStyle }
                      : {}),
                    ...(answerStyles.styles.fontWeight !== "default"
                      ? { fontWeight: answerStyles.styles.fontWeight }
                      : {}),
                    ...(answerStyles.styles.textTransform !== "default"
                      ? { textTransform: answerStyles.styles.textTransform }
                      : {}),
                  };
                  const resolvedAnswer = item.answer
                    ? resolveComponentData(
                        item.answer,
                        locale,
                        streamDocument,
                        {
                          richTextStyleOverrides: answerStyleOverrides,
                        },
                      )
                    : undefined;

                  return (
                    <article
                      key={`${resolvedQuestion || "faq"}-${index}`}
                      style={{
                        ...getSurfaceColorStyle(
                          props.rowBackgroundColor,
                          streamDocument,
                        ),
                        borderRadius: "18px",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const nextValue = isOpen ? -1 : index;
                          setOpenIndex(nextValue);
                          analytics?.track({
                            action: nextValue === index ? "EXPAND" : "COLLAPSE",
                            eventName: `toggle${index}`,
                          });
                        }}
                        style={{
                          alignItems: "center",
                          background: "transparent",
                          border: "none",
                          color: getThemeColorCssValue(
                            questionStyles.fontColor ??
                              props.rowBackgroundColor.contrastingColor,
                          ),
                          cursor: "pointer",
                          display: "flex",
                          fontFamily:
                            questionStyles.styles.fontFamily === "default"
                              ? undefined
                              : questionStyles.styles.fontFamily,
                          fontSize:
                            questionStyles.styles.fontSize === "default"
                              ? undefined
                              : questionStyles.styles.fontSize,
                          fontStyle:
                            questionStyles.styles.fontStyle === "default"
                              ? undefined
                              : questionStyles.styles.fontStyle,
                          fontWeight:
                            questionStyles.styles.fontWeight === "default"
                              ? undefined
                              : questionStyles.styles.fontWeight,
                          justifyContent: "space-between",
                          padding: "20px",
                          textAlign: "left",
                          textTransform:
                            questionStyles.styles.textTransform === "default"
                              ? undefined
                              : questionStyles.styles.textTransform,
                          width: "100%",
                        }}
                      >
                        <span>{resolvedQuestion}</span>
                        <span>{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen ? (
                        <div
                          style={{
                            padding: "0 20px 20px",
                          }}
                        >
                          {React.isValidElement(resolvedAnswer) ? (
                            resolvedAnswer
                          ) : (
                            <MaybeRTF
                              data={
                                typeof resolvedAnswer === "string"
                                  ? resolvedAnswer
                                  : ""
                              }
                              richTextStyleOverrides={answerStyleOverrides}
                            />
                          )}
                        </div>
                      ) : null}
                    </article>
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

export const BusinessConsultingFaqSection: YextComponentConfig<BusinessConsultingFaqSectionProps> =
  {
    label: "Faq Section",
    fields: BusinessConsultingFaqSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "FAQ",
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
      items: faqItemsSource.defaultValue,
      itemStyles: defaultFaqItemStyles,
      rowBackgroundColor: {
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
    render: (props) => <BusinessConsultingFaqSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "BusinessConsultingFaqSection",
  displayName: "Faq Section",
  description: "Faq Section",
  pageSetTypes: ["ENTITY"],
};
