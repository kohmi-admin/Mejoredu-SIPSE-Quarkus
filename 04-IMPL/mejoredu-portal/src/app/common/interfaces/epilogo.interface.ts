import { IMessageApi } from './response-api.interface';

export interface IEpilogoPayload {
  idEstructura: number;
  descripcion: string;
  cveUsuario: string;
  estatus: string;
  archivosPI: IFiles[];
  actas: IFiles[];
}

export interface IFiles {
  uuid: string;
  tipoArchivo: string;
  nombre: string;
}

export interface IEpilogoResponsePorIdEstructura extends IMessageApi {
  respuesta: IEpilogoResponse;
}

export interface IEpilogoResponse {
  idEpilogo: number;
  idEstructura: number;
  descripcion: string;
  estatus: string;
  archivosPI: IArrFilesResponse[];
  actas: IArrFilesResponse[];
}

export interface IArrFilesResponse {
  idCarga: number;
  estatus: string;
  tipoDocumento: number;
  archivo: IArchivoResponse;
}

export interface IArchivoResponse {
  idArchivo: number;
  cxNombre: string;
  cxUuid: string;
  dfFechaCarga: string;
  dfHoraCarga: string;
  csEstatus: string;
  cveUsuario: string;
  cxUuidToPdf: string;
}
