import { IMessageApi } from '@common/interfaces/response-api.interface';

export interface IInformeAutoPayload {
  idInforme?: any;
  anhio: number;
  periodo: number;
  cveUsuario: string;
  nombreInforme: string;
  documentoZip: IDocumentoZipPayload;
}

export interface IDocumentoZipPayload {
  idArchivo: number;
  fechaCarga: string;
  uuid: string;
  nombre: string;
}

export interface IInformeAutoResponse extends IMessageApi {
  respuesta: IItemInformeAutoResponse[];
}

export interface IItemInformeAutoResponse {
  idInforme: number;
  anhio: number;
  periodo: number;
  cveUsuario: string;
  nombreInforme: string;
  documentoZip: IDocumentoZipResponse;
}

export interface IDocumentoZipResponse {
  idArchivo: number;
  idTipoDocumento: number;
  cxNombre: string;
  cxUuid: string;
  dfFechaCarga: Date;
  dfHoraCarga: string;
  csEstatus: string;
  cveUsuario: string;
  cxUuidToPdf: null;
}
