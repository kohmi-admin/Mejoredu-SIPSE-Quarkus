import { IMessageApi } from '../response-api.interface';

export interface IReportesSeguimientoResponse extends IMessageApi {
  respuesta: IItemReportesSeguimientoResponse;
}

export interface IItemReportesSeguimientoResponse {
  totalProductosCumplidos: number;
  totalProductosCancelados: number;
  primerTrimestre: ITrimestreResponse[];
  segundoTrimestre: ITrimestreResponse[];
  tercerTrimestre: ITrimestreResponse[];
  cuartoTrimestre: ITrimestreResponse[];
}

export interface ITrimestreResponse {
  total: number;
  categoria: string;
}
