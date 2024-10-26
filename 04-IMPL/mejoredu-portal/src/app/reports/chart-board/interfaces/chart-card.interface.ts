import { ChartParamsI } from "@common/chart/interfaces/chart-params.interface";

export interface ChartCardI {
  title: string;
  class?: string;
  chart: ChartParamsI;
  show?: boolean;
}
