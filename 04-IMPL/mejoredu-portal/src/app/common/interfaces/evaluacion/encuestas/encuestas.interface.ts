import { IMessageApi } from '@common/interfaces/response-api.interface';

export interface IEncuestaPayload {
  idEncuesta?: any;
  cveUsuario: string;
  anhio: number;
  areaResponsable: string;
  tipoInstrumento: string;
  nombreInstrumento: string;
  objetivo: string;
  documentoZip: IDocumentoZipPayload;
}

export interface IDocumentoZipPayload {
  idArchivo: number;
  idTipoDocumento: number;
  fechaCarga: string;
  uuid: string;
  nombre: string;
}

export interface IEncuestasResponse extends IMessageApi {
  respuesta: IItemEncuestaResponse[];
}

export interface IItemEncuestaResponse {
  idEncuesta: number;
  anhio: number;
  areaResponsable: string;
  tipoInstrumento: string;
  nombreInstrumento: string;
  objetivo: string;
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
  cxUuidToPdf: string;
}
