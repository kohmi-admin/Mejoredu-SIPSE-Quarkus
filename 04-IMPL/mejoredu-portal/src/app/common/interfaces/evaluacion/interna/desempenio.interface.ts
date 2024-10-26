import { IMessageApi } from '@common/interfaces/response-api.interface';

export interface IDesempenioPayload {
  idEvaluacion?: any;
  cveUsuario: string;
  anhio: number;
  actor: string;
  nombreEvaluacion: string;
  tipoInforme: string;
  observaciones: string;
  atencionObservaciones: string;
  documentoZip: IDocumentoZipPayload;
}

export interface IDocumentoZipPayload {
  idArchivo: number;
  idTipoDocumento: number;
  fechaCarga: string;
  uuid: string;
  nombre: string;
}

export interface IDesempenioResponse extends IMessageApi {
  respuesta: IItemDesempenioResponse[];
}

export interface IItemDesempenioResponse {
  idEvaluacion: number;
  anhio: number;
  actor: string;
  nombreEvaluacion: string;
  tipoInforme: string;
  observaciones: string;
  atencionObservaciones: string;
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
