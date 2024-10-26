import { IMessageApi } from '../response-api.interface';

export interface IReportesAdecuacionesResponse extends IMessageApi {
  respuesta: IItemReportesAdecuacionesResponse;
}

export interface IItemReportesAdecuacionesResponse {
  totalAdecuados: number;
  adecuacionTipos: IAdecuacionResponse[];
  adecuacionUnidades: IAdecuacionResponse[];
  adecuacionProyectos: IAdecuacionResponse[];
}

export interface IAdecuacionResponse {
  porcentaje: number;
  categoria: string;
}
