import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";
import {
  Background,
  EntityField,
  VisibilityWrapper,
  YextComponentConfig,
  YextFields,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveBreadcrumbs,
  resolveComponentData,
  type StyledTextValue,
  type ThemeColor,
  useDocument,
  useTemplateProps,
} from "@yext/visual-editor";
import type { StyledTextProps } from "../shared/sectionHelpers";

type BreadcrumbDocument = {
  locale?: string;
  name?: string;
  address?: {
    line1?: string;
  };
};

type BreadcrumbItem = {
  name?: string;
  slug?: string;
};

export type BusinessConsultingBreadcrumbsSectionProps = {
  rootLabel: StyledTextProps;
  includeCurrentLocation: boolean;
  separator: string;
  linkColor?: ThemeColor;
  panelBackgroundColor: ThemeColor;
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const breadcrumbsSectionScope = "ybc-breadcrumbs-section";

const breadcrumbsSectionScopedTypographyStyles = `
  [data-scope="${breadcrumbsSectionScope}"] p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  [data-scope="${breadcrumbsSectionScope}"] a {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }

  [data-scope="${breadcrumbsSectionScope}"] .breadcrumbs-section__content {
    margin: 0 auto;
    max-width: 1280px;
  }

  [data-scope="${breadcrumbsSectionScope}"] .breadcrumbs-section__panel {
    align-items: center;
    border-radius: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px 10px;
    padding: 18px 24px;
  }

  [data-scope="${breadcrumbsSectionScope}"] .breadcrumbs-section__list {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 12px 10px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  [data-scope="${breadcrumbsSectionScope}"] .breadcrumbs-section__item {
    align-items: center;
    display: inline-flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  [data-scope="${breadcrumbsSectionScope}"] .breadcrumbs-section__separator {
    font-size: 14px;
    opacity: 0.55;
  }

  @media (max-width: 767px) {
    [data-scope="${breadcrumbsSectionScope}"] .breadcrumbs-section {
      padding: 20px 16px !important;
    }

    [data-scope="${breadcrumbsSectionScope}"] .breadcrumbs-section__panel {
      border-radius: 18px;
      padding: 16px 18px;
    }
  }
`;

const BusinessConsultingBreadcrumbsSectionFields: YextFields<BusinessConsultingBreadcrumbsSectionProps> =
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
    rootLabel: {
      label: "Root Label",
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
    includeCurrentLocation: {
      label: "Include Current Location",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    separator: {
      label: "Separator",
      type: "text",
    },
    linkColor: {
      label: "Link Color",
      type: "basicSelector",
      options: "SITE_COLOR",
    },
    panelBackgroundColor: {
      label: "Panel Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
  };

const defaultRootLabel: StyledTextProps = {
  text: {
    field: "",
    constantValue: {
      defaultValue: "All Locations",
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

const getStyledTextOverrides = (
  styles: StyledTextValue,
  color?: ThemeColor | string,
): React.CSSProperties => ({
  color: getThemeColorCssValue(color),
  ...(styles.fontFamily !== "default" ? { fontFamily: styles.fontFamily } : {}),
  ...(styles.fontSize !== "default" ? { fontSize: styles.fontSize } : {}),
  ...(styles.fontStyle !== "default" ? { fontStyle: styles.fontStyle } : {}),
  ...(styles.fontWeight !== "default" ? { fontWeight: styles.fontWeight } : {}),
  ...(styles.textTransform !== "default"
    ? { textTransform: styles.textTransform }
    : {}),
});

const BusinessConsultingBreadcrumbsSectionComponent: PuckComponent<
  BusinessConsultingBreadcrumbsSectionProps
> = (props) => {
  const streamDocument = useDocument<BreadcrumbDocument>();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const locale = streamDocument.locale ?? "en";
  const breadcrumbs = (resolveBreadcrumbs(streamDocument) ??
    []) as BreadcrumbItem[];
  const rootLabel =
    resolveComponentData(props.rootLabel.text, locale, streamDocument) || "";
  const currentPageLabel =
    streamDocument.name?.trim() || streamDocument.address?.line1?.trim() || "";
  const displayedBreadcrumbs = breadcrumbs.filter((item, index) => {
    if (props.includeCurrentLocation || breadcrumbs.length <= 1) {
      return true;
    }

    return index < breadcrumbs.length - 1;
  });
  const currentPageColor =
    props.panelBackgroundColor.contrastingColor ||
    props.section.backgroundColor.contrastingColor;
  const linkColor =
    !props.linkColor || props.linkColor.selectedColor === "default"
      ? currentPageColor
      : props.linkColor;

  if (!displayedBreadcrumbs.length) {
    if (!props.puck.isEditing) {
      return <></>;
    }

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`BusinessConsultingBreadcrumbsSection${getAnalyticsScopeHash(props.id)}`}
        >
          <Background
            as="section"
            background={props.section.backgroundColor}
            data-scope={breadcrumbsSectionScope}
            className="breadcrumbs-section"
            style={{
              ...getSurfaceColorStyle(
                props.section.backgroundColor,
                streamDocument,
              ),
              padding: "24px",
            }}
          >
            <style>{breadcrumbsSectionScopedTypographyStyles}</style>
            <div className="breadcrumbs-section__content">
              <div
                className="breadcrumbs-section__panel"
                style={{
                  ...getSurfaceColorStyle(
                    props.panelBackgroundColor,
                    streamDocument,
                  ),
                  color: getThemeColorCssValue(currentPageColor),
                  fontFamily: "Arial, Helvetica, sans-serif",
                  padding: "18px 24px",
                }}
              >
                No breadcrumbs available (section will be hidden on live page).
                Create a directory to enable breadcrumbs.
              </div>
            </div>
          </Background>
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
        name={`BusinessConsultingBreadcrumbsSection${getAnalyticsScopeHash(props.id)}`}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          data-scope={breadcrumbsSectionScope}
          className="breadcrumbs-section"
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
            padding: "24px",
          }}
        >
          <style>{breadcrumbsSectionScopedTypographyStyles}</style>
          <div className="breadcrumbs-section__content">
            <div
              className="breadcrumbs-section__panel"
              style={{
                ...getSurfaceColorStyle(
                  props.panelBackgroundColor,
                  streamDocument,
                ),
              }}
            >
              <ol className="breadcrumbs-section__list">
                {displayedBreadcrumbs.map((item, index) => {
                  const isRoot = index === 0;
                  const isCurrentPage =
                    index === displayedBreadcrumbs.length - 1;
                  const resolvedLabel = isRoot
                    ? rootLabel || item.name || ""
                    : isCurrentPage && props.includeCurrentLocation
                      ? currentPageLabel || item.name || ""
                      : item.name || "";
                  const href = relativePrefixToRoot
                    ? `${relativePrefixToRoot}${item.slug || ""}`
                    : item.slug || "";
                  const linkStyle = getStyledTextOverrides(
                    props.rootLabel.styles,
                    isCurrentPage ? currentPageColor : linkColor,
                  );

                  return (
                    <li
                      className="breadcrumbs-section__item"
                      key={`${item.slug || resolvedLabel || "crumb"}-${index}`}
                    >
                      {index > 0 ? (
                        <span
                          aria-hidden
                          className="breadcrumbs-section__separator"
                          style={{
                            color: getThemeColorCssValue(currentPageColor),
                          }}
                        >
                          {props.separator}
                        </span>
                      ) : null}
                      {isCurrentPage ? (
                        isRoot ? (
                          <EntityField
                            displayName="Root Label"
                            fieldId={props.rootLabel.text.field}
                            constantValueEnabled={
                              props.rootLabel.text.constantValueEnabled
                            }
                          >
                            <span style={linkStyle}>{resolvedLabel}</span>
                          </EntityField>
                        ) : (
                          <span style={linkStyle}>{resolvedLabel}</span>
                        )
                      ) : isRoot ? (
                        <EntityField
                          displayName="Root Label"
                          fieldId={props.rootLabel.text.field}
                          constantValueEnabled={
                            props.rootLabel.text.constantValueEnabled
                          }
                        >
                          <Link
                            cta={{
                              link: href,
                              linkType: "URL",
                            }}
                            eventName={`breadcrumbsLink${index}`}
                            className="transition-opacity hover:opacity-80"
                            style={linkStyle}
                          >
                            {resolvedLabel}
                          </Link>
                        </EntityField>
                      ) : (
                        <Link
                          cta={{
                            link: href,
                            linkType: "URL",
                          }}
                          eventName={`breadcrumbsLink${index}`}
                          className="transition-opacity hover:opacity-80"
                          style={linkStyle}
                        >
                          {resolvedLabel}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessConsultingBreadcrumbsSection: YextComponentConfig<BusinessConsultingBreadcrumbsSectionProps> =
  {
    label: "Breadcrumbs Section",
    fields: BusinessConsultingBreadcrumbsSectionFields,
    defaultProps: {
      rootLabel: defaultRootLabel,
      includeCurrentLocation: true,
      separator: "/",
      linkColor: undefined,
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
      <BusinessConsultingBreadcrumbsSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessConsultingBreadcrumbsSection",
  displayName: "Breadcrumbs Section",
  description: "Breadcrumbs Section",
  pageSetTypes: ["ENTITY"],
};
