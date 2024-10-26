import { CHART_TYPE } from "../enums/chart.enum";
import { ChartDataI } from "./chart.interface";

export interface ChartParamsI {
  id?: string,
  title?: string;
  title2?: string;
  title3?: string;
  type: CHART_TYPE,
  data: ChartDataI[];
  isDataset?: boolean;
  datasets?: any[];
  labels?: any[];
  data2?: ChartDataI[];
  data3?: ChartDataI[];
  height?: number;
  isPercent?: boolean;
  isCurrency?: boolean;
  calculatePercent?: boolean;
  suffix?: string;
}
