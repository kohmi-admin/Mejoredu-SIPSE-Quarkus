import { IMessageApi } from '../response-api.interface';

export interface IConsultaSolicitudResponse extends IMessageApi {
  respuesta: IItemConsultaSolicitudResponse;
}

export interface IItemConsultaSolicitudResponse {
  idSolicitud?: number;
  cambiaIndicadores: boolean;
  folioSolicitud: string;
  fechaSolicitud: string;
  justificacion: string;
  objetivo: string;
  ixFolioSecuencia: number;
  adecuacionId: number;
  direccionId: number;
  unidadId: number;
  anhioId: number;
  ibExisteInfo: number;
  fechaAutorizacion: string;
  montoAplicacion: number;
  modificacionId: number;
  estatusId: number;
  estatusIdPlaneacion: number;
  estatusPlaneacion: string;
  estatus: string;
  usuario: string;
  adecuaciones: IAdecuacionesResponse[];
  cxUUID?: string;
  historicoSolicitud: IHistoricoSolicitudResponse[];
}

export interface IAdecuacionesResponse {
  idTipoApartado: number;
  tipoApartado: string;
  tiposModificaciones: ITiposModificacionesResponse[];
}

export interface ITiposModificacionesResponse {
  idAdecuacionSolicitud: number;
  idTipoModificacion: number;
  tipoModificacion: string;
}

export interface IHistoricoSolicitudResponse {
  idHistorico: number;
  dfSolicitud: string;
  dhSolicitud: string;
  usuario: string;
  idSolicitud: number;
  idEstatus: number;
}
