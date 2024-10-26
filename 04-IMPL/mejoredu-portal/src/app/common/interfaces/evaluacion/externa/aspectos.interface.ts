import { IMessageApi } from '@common/interfaces/response-api.interface';

export interface IAspectosPayload {
  idAspectosSusceptibles?: any;
  cveUsuario: string;
  anhio: number;
  no: number;
  cvePrograma: number;
  aspectosSusceptiblesMejora: string;
  actividades: string;
  idAreaResponsable: number;
  fechaTermino: string;
  resultadosEsperados: string;
  productosEvidencias: string;
  porcentajeAvance: string;
  observaciones: string;
  documentoProbatorio: IDocumentoProbatorioPayload;
}

export interface IDocumentoProbatorioPayload {
  idArchivo: number;
  idTipoDocumento: number;
  fechaCarga: string;
  uuid: string;
  nombre: string;
}

export interface IAspectoResponse extends IMessageApi {
  respuesta: IItemAspectoResponse[];
}

export interface IItemAspectoResponse {
  idAspectosSusceptibles: number;
  anhio: number;
  no: number;
  idCvePrograma: number;
  idAreaResponsable: number;
  cvePrograma: string;
  aspectosSusceptiblesMejora: string;
  actividades: string;
  areaResponsable: string;
  fechaTermino: Date;
  resultadosEsperados: string;
  productosEvidencias: string;
  porcentajeAvance: string;
  observaciones: string;
  documentoProbatorio: IDocumentoProbatorioResponse;
}

export interface IDocumentoProbatorioResponse {
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
