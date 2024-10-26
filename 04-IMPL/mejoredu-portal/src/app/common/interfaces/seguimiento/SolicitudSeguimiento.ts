import { IMessageApi } from '../response-api.interface';

export interface ISolSeguimientoResponse extends IMessageApi {
  respuesta: IItemSolSeguimientoResponse[];
}
export interface IItemSolSeguimientoResponse {
  idSolicitud: number;
  anhioId: number;
  anhio: string;
  cambiaIndicadores: boolean;
  folioSolicitud: string;
  folioSIF: null;
  fechaSolicitud: null;
  unidadId: number;
  unidad: string;
  direccionId: number;
  adecuacionId: number;
  tipoAdecuacion: string;
  modificacionId: null;
  tipoModificacion: null;
  justificacion: string;
  objetivo: string;
  estatusId: number;
  estatus: string;
  estatusIdPlaneacion: number | null;
  estatusPlaneacion: string | null;
  fechaAutorizacion: null;
  montoAplicacion: number;
  usuario: string;
  adecuaciones: IAdecuacionesSeguimientoResponse[];
}

export interface IAdecuacionesSeguimientoResponse {
  idTipoApartado: number;
  tipoApartado: string;
  tiposModificaciones: ITiposModificacionesResponse[];
}

export interface ITiposModificacionesResponse {
  idAdecuacionSolicitud: number;
  idTipoModificacion: number;
  tipoModificacion: string;
}
