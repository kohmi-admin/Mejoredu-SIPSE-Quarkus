import { IMessageApi } from '../response-api.interface';

export interface IRegistrarSolicitudFirmaPayload {
  usuario: string;
  idSolicitud: number;
  archivo: IArchivoSolicitudFirmaResponse;
}

export interface IArchivoSolicitudFirmaResponse {
  cxNombre: string;
  cxUuid: string;
  tipoDocumento: ITipoDocumentoSolicitudFirmaResponse;
  anhoPlaneacion: number;
}

export interface ITipoDocumentoSolicitudFirmaResponse {
  idTipoDocumento: number;
}

export interface IRegistrarSolicitudFirmaResponse extends IMessageApi {
  respuesta: number;
}

export interface IConsultarSolicitudFirmaResponse extends IMessageApi {
  respuesta: IItemConsultarSolicitudFirmaResponse;
}

export interface IItemConsultarSolicitudFirmaResponse {
  idFirma: number;
  usuario: string;
  idSolicitud: number;
  archivo: IArchivoConsultarSolicitudFirmaResponse;
}

export interface IArchivoConsultarSolicitudFirmaResponse {
  idArchivo: number;
  cxNombre: string;
  cxUuid: string;
  tipoDocumento: ITipoDocumentoConsultarSolicitudFirmaResponse;
  anhoPlaneacion: null;
  dfFechaCarga: string;
  dfHoraCarga: string;
  csEstatus: string;
  cveUsuario: string;
}

export interface ITipoDocumentoConsultarSolicitudFirmaResponse {
  idTipoDocumento: number;
  cdTipoDocumento: string;
  cxExtension: string;
  cxTipoContenido: string;
}
