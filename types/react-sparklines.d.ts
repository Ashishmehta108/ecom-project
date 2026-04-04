declare module "react-sparklines" {
  import { ComponentType, ReactNode } from "react";

  interface SparklinesProps {
    data: number[];
    limit?: number;
    width?: number;
    height?: number;
    svgWidth?: number;
    svgHeight?: number;
    margin?: number;
    preserveAspectRatio?: string;
    min?: number;
    max?: number;
    children?: ReactNode;
  }

  interface SparklinesLineProps {
    color?: string;
    style?: {
      fill?: string;
      strokeWidth?: number;
      strokeLinejoin?: string;
      strokeLinecap?: string;
    };
  }

  interface SparklinesBarsProps {
    fillColor?: string;
    style?: {
      fill?: string;
      strokeWidth?: number;
    };
  }

  interface SparklinesReferenceLineProps {
    type?: "mean" | "median" | "custom";
    value?: number;
    style?: {
      stroke?: string;
      strokeDasharray?: string;
      strokeWidth?: number;
    };
  }

  interface SparklinesNormalBandProps {
    border?: number;
    style?: {
      fill?: string;
      opacity?: number;
    };
  }

  export const Sparklines: ComponentType<SparklinesProps>;
  export const SparklinesLine: ComponentType<SparklinesLineProps>;
  export const SparklinesBars: ComponentType<SparklinesBarsProps>;
  export const SparklinesReferenceLine: ComponentType<SparklinesReferenceLineProps>;
  export const SparklinesNormalBand: ComponentType<SparklinesNormalBandProps>;
}
