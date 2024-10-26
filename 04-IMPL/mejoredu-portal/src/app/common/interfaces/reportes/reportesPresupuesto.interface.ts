import { IMessageApi } from '../response-api.interface';

export interface IReportesPresupuestoResponse extends IMessageApi {
  respuesta: IItemReportesPresupuestoResponse;
}

export interface IItemReportesPresupuestoResponse {
  presupuestoAsignado: number;
  presupuestoUnidad: IPresupuestoUnidadResponse[];
  presupuestoProyectos: IPresupuestoProyectoResponse[];
}

export interface IPresupuestoProyectoResponse {
  idAnhio: number;
  idUnidad: number;
  cveUnidad: number;
  cxNombreProyecto: string;
  totalAnualASignado: number;
  totalCalendarizado: number;
}

export interface IPresupuestoUnidadResponse {
  idAnhio: number;
  idUnidad: number;
  cvUnidad: number;
  totalAnualAsignado: number;
  totalCalendarizado: number;
  ccExternaDos: string;
}
