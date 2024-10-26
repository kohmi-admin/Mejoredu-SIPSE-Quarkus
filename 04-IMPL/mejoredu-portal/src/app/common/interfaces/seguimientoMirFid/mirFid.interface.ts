import { IMessageApi } from '../response-api.interface';

export interface IConsultaMirPorAnhioResponse extends IMessageApi {
  respuesta: IItemConsultaMirPorAnhioResponse[];
}

export interface IItemConsultaMirPorAnhioResponse {
  nivel: string;
  indicador: string;
  primero: Cuarto;
  segundo: Cuarto;
  tercero: Cuarto;
  cuarto: Cuarto;
  alcanzadoAcumulado: number;
  idCatalogoUnidad: number;
  idIndicadorResultado: number;
  porcentajeAcumulado: string;
  estatus: string;
}

export interface Cuarto {
  unidad: string;
  programado: number;
  porcentajeProgramado: string;
  reportado: number;
  porcentajeReportado: string;
}
