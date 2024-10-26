import { IMessageApi } from '../response-api.interface';

export interface IGestionReportesPayload {
  archivos: IArchivoPayload[];
  idAnhio: number;
  usuario: string;
}

export interface IArchivoPayload {
  idArchivo: number;
  idTipoDocumento: number;
  fechaCarga: string;
  uuid: string;
  nombre: string;
}

export interface IGestionReportesResponse extends IMessageApi {
  respuesta: IItemGestionReportesResponse[];
}

export interface IItemGestionReportesResponse {
  idArchivo: number;
  idTipoDocumento: number;
  cxNombre: string;
  cxUuid: string;
  dfFechaCarga: string;
  dfHoraCarga: string;
  csEstatus: string;
  cveUsuario: string;
  cxUuidToPdf: string;
}
