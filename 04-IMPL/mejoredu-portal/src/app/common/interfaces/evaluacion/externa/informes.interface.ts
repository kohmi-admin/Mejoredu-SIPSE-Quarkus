import { IMessageApi } from '@common/interfaces/response-api.interface';

export interface IInformesPayload {
  idInformeExterno?: any;
  cveUsuario: string;
  anhio: number;
  tipoEvaluacion: string;
  nombreEvaluacion: string;
  tipoInforme: string;
  posicionInstitucional: string;
  aspectosSusceptiblesMejora: string;
  documentoZip: IDocumentoZipPayload;
}

export interface IDocumentoZipPayload {
  idArchivo: number;
  idTipoDocumento: number;
  fechaCarga: string;
  uuid: string;
  nombre: string;
}

export interface IInformeResponse extends IMessageApi {
  respuesta: IItemInformeResponse[];
}

export interface IItemInformeResponse {
  idInformeExterno: number;
  anhio: number;
  tipoEvaluacion: string;
  nombreEvaluacion: string;
  tipoInforme: string;
  posicionInstitucional: string;
  aspectosSusceptiblesMejora: string;
  documentoZip: IArchivoResponse;
}

export interface IArchivoResponse {
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
