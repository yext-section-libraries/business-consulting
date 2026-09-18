import * as React from "react";
import { useTranslation } from "react-i18next";
import { PuckComponent } from "@puckeditor/core";
import {
  HoursStatus as HoursStatusJS,
  type HoursType,
  type StatusParams,
} from "@yext/pages-components";
import type { TFunction } from "i18next";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

export interface LocalizedHoursStatusProps {
  hours: HoursType;
  className?: string;
  comingSoon?: boolean;
  showCurrentStatus?: boolean;
  showDayNames?: boolean;
  timeFormat?: "12h" | "24h";
  dayOfWeekFormat?: "short" | "long";
  timezone?: string;
  boldCurrentStatus?: boolean;
  bodyVariant?: "lg" | "base" | "sm";
}

export const LocalizedHoursStatus = React.memo(
  ({
    hours,
    className,
    comingSoon,
    showCurrentStatus = true,
    showDayNames = true,
    timeFormat,
    dayOfWeekFormat = "long",
    timezone,
    boldCurrentStatus = true,
    bodyVariant = "lg",
  }: LocalizedHoursStatusProps) => {
    const { t, i18n } = useTranslation();
    const classNameResolved = themeManagerCn(
      "components mb-2 font-body-fontFamily font-body-fontWeight",
      bodyVariant === "lg"
        ? "text-body-lg-fontSize"
        : bodyVariant === "sm"
          ? "text-body-sm-fontSize"
          : "text-body-fontSize",
      className,
    );

    return (
      <HoursStatusJS
        hours={hours}
        comingSoon={comingSoon}
        className={classNameResolved}
        statusTemplate={(params: StatusParams) => {
          const isComingSoon = !!params.comingSoon;
          const isFuture = !isOpen24h(params) && !isIndefinitelyClosed(params);
          const interval = params.isOpen
            ? params.currentInterval
            : params.futureInterval;
          const time = params.isOpen
            ? interval?.getEndTime(i18n.language, params.timeOptions) || ""
            : interval?.getStartTime(i18n.language, params.timeOptions) || "";
          const showDayOfWeek = showDayNames && isFuture;
          const intervalDate = params.isOpen ? interval?.end : interval?.start;
          const dayOfWeek =
            intervalDate
              ?.setLocale(i18n.language)
              .toLocaleString(params.dayOptions) || "";

          let statusText = "";
          if (isFuture && params.isOpen) {
            statusText = showDayOfWeek
              ? t(
                  "closesAtTimeWeek",
                  "Closes at {{time}} {{dayOfWeek}}",
                  { time, dayOfWeek },
                )
              : t("closesAtTime", "Closes at {{time}}", { time });
          } else if (isFuture) {
            statusText = showDayOfWeek
              ? t(
                  "opensAtTimeWeek",
                  "Opens at {{time}} {{dayOfWeek}}",
                  { time, dayOfWeek },
                )
              : t("opensAtTime", "Opens at {{time}}", { time });
          }

          return (
            <div className={themeManagerCn("HoursStatus", classNameResolved)}>
              {(showCurrentStatus || isComingSoon) &&
                renderCurrentStatus(params, t, boldCurrentStatus)}
              {!isComingSoon && showCurrentStatus &&
                renderStatusSeparator(params)}
              {!isComingSoon && showCurrentStatus && statusText ? (
                <span className="HoursStatus-future">{statusText}</span>
              ) : null}
            </div>
          );
        }}
        dayOptions={{ weekday: dayOfWeekFormat }}
        timeOptions={timeFormat ? { hour12: timeFormat === "12h" } : undefined}
        timezone={timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone}
      />
    );
  },
);

function renderCurrentStatus(
  params: StatusParams,
  t: TFunction,
  boldCurrentStatus: boolean,
): React.ReactNode {
  const style = boldCurrentStatus ? { fontWeight: "bolder" } : undefined;
  let status = params.isOpen
    ? t("openNow", "Open Now")
    : t("closed", "Closed");

  if (params.comingSoon) {
    status = t("comingSoon", "Coming Soon");
  } else if (isOpen24h(params)) {
    status = t("open24Hours", "Open 24 Hours");
  } else if (isIndefinitelyClosed(params)) {
    status = t("temporarilyClosed", "Temporarily Closed");
  }

  return (
    <span className="HoursStatus-current" style={style}>
      {status}
    </span>
  );
}

function isOpen24h(params: StatusParams): boolean {
  return params.currentInterval?.is24h?.() || false;
}

function isIndefinitelyClosed(params: StatusParams): boolean {
  return !params.futureInterval;
}

function renderStatusSeparator(params: StatusParams): React.ReactNode {
  if (isOpen24h(params) || isIndefinitelyClosed(params)) {
    return null;
  }
  return <span className="HoursStatus-separator"> • </span>;
}

export interface HoursStatusProps {
  data: {
    /** The hours field to display the status for */
    hours: YextEntityField<HoursType>;
  };

  styles: {
    /** Whether to show the open status ("Open Now" or "Closed") */
    showCurrentStatus?: boolean;
    /** The time format to use */
    timeFormat?: "12h" | "24h";
    /** The day of week format ("Mon" vs. "Monday") */
    dayOfWeekFormat?: "short" | "long";
    /** Whether to show day names ("Monday", "Tuesday") */
    showDayNames?: boolean;
    /** Additional class names to apply to the underlying component */
    className?: string;
    /** The body size variant */
    bodyVariant?: "lg" | "base" | "sm";
  };

  /** @internal */
  parentData?: {
    field: string;
    hours?: HoursType;
    comingSoon?: boolean;
    timezone?: string;
  };
}

export const hoursStatusWrapperFields: YextFields<HoursStatusProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      hours: {
        type: "entityField",
        label: msg("fields.hours", "Hours"),
        filter: {
          types: ["type.hours"],
        },
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
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
        type: "radio",
        options: [
          { label: msg("fields.options.hour12", "12-hour"), value: "12h" },
          { label: msg("fields.options.hour24", "24-hour"), value: "24h" },
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
      dayOfWeekFormat: {
        label: msg("fields.dayOfWeekFormat", "Day of Week Format"),
        type: "radio",
        options: [
          { label: msg("fields.options.short", "Short"), value: "short" },
          { label: msg("fields.options.long", "Long"), value: "long" },
        ],
      },
    },
  },
};

const HoursStatusWrapper: PuckComponent<HoursStatusProps> = ({
  data,
  styles,
  puck,
  parentData,
}) => {
  const streamDocument = useDocument();
  const { i18n } = useTranslation();
  const comingSoon = parentData?.comingSoon ?? !!streamDocument.comingSoon;
  const hours =
    parentData?.hours ??
    resolveComponentData(data.hours, i18n.language, streamDocument);
  const timezone = parentData?.timezone ?? streamDocument.timezone;

  return hours || comingSoon ? (
    <EntityField
      displayName={parentData ? parentData.field : pt("hours", "Hours")}
      fieldId={data.hours.field}
      constantValueEnabled={!parentData && data.hours.constantValueEnabled}
    >
      <LocalizedHoursStatus
        hours={hours ?? {}}
        comingSoon={comingSoon}
        timezone={timezone}
        className={styles.className}
        showCurrentStatus={styles.showCurrentStatus}
        showDayNames={styles.showDayNames}
        timeFormat={styles.timeFormat}
        dayOfWeekFormat={styles.dayOfWeekFormat}
        bodyVariant={styles.bodyVariant}
      />
    </EntityField>
  ) : puck.isEditing ? (
    <div className="h-10" />
  ) : (
    <></>
  );
};

export const HoursStatus: YextComponentConfig<HoursStatusProps> = {
  label: msg("components.hoursStatus", "Hours Status"),
  fields: hoursStatusWrapperFields,
  defaultProps: {
    data: {
      hours: {
        field: "hours",
        constantValue: {},
      },
    },
    styles: {
      showCurrentStatus: true,
      timeFormat: "12h",
      showDayNames: true,
      dayOfWeekFormat: "long",
      className: "",
    },
  },
  resolveFields: (data) =>
    resolveDataFromParent(hoursStatusWrapperFields, data),
  render: (props) => <HoursStatusWrapper {...props} />,
};
