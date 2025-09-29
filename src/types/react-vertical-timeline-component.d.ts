declare module "react-vertical-timeline-component" {
  import * as React from "react";

  export interface VerticalTimelineProps extends React.HTMLAttributes<HTMLDivElement> {}
  export interface VerticalTimelineElementProps extends React.HTMLAttributes<HTMLDivElement> {
    date?: string;
    icon?: React.ReactNode;
    iconStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    contentArrowStyle?: React.CSSProperties;
  }

  export const VerticalTimeline: React.FC<VerticalTimelineProps>;
  export const VerticalTimelineElement: React.FC<VerticalTimelineElementProps>;
}
