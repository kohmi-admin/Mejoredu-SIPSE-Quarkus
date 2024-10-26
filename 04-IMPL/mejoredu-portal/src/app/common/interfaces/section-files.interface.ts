import { IMessageApi } from './response-api.interface';

export interface ISectionFilesPayload {
  archivos: IArchivoPayload[];
  idAnhio: number;
  subseccion: number;
  usuario: string;
}

export interface IArchivoPayload {
  idArchivo: number;
  idTipoDocumento: number;
  fechaCarga: string;
  uuid: string;
  nombre: string;
}

export interface ISectionFilesResponse extends IMessageApi {
  respuesta: IItemSectionFilesResponse[];
}

export interface IItemSectionFilesResponse {
  idArchivo: number;
  idTipoDocumento: number;
  cxNombre: string;
  cxUuid: string;
  dfFechaCarga: Date;
  dfHoraCarga: string;
  csEstatus: string;
  cveUsuario: string;
  cxUuidToPdf: string;
}
