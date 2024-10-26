import { IMessageApi } from '../response-api.interface';

export interface IGestorPorAnhioResponse extends IMessageApi {
  respuesta: IGestorResponse;
}

export interface IGestorResponse {
  idPrograma: number;
  nombrePrograma: string;
  alineacionPND: number;
  analisis: string;
  programasPublicos: string;
  estatus: string;
  estatusPlaneacion: string;
  estatusSupervisor: string;
  anhioPlaneacion: number;
  fhRegistro: null;
  fhActualizacion: null;
}

export interface IGestorEstructuraResponse extends IMessageApi {
  respuesta: IItemGestorEstructuraResponse[];
}

export interface IItemGestorEstructuraResponse {
  idPrograma: number;
  nombrePrograma: string;
  alineacionPND: number;
  analisis: string;
  programasPublicos: string;
  estatus: string;
}

export interface IGestorPayload {
  nombre: string;
  alineacion: number;
  analisis: string;
  problemas: string;
  usuario: string;
  estatus: string;
  anhioPlaneacion: number;
}
