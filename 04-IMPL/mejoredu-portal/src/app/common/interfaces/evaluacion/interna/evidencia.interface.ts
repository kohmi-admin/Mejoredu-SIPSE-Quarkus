import { IMessageApi } from '@common/interfaces/response-api.interface';

export interface IEvidenciaPayload {
  idEvidencia?: number | null;
  anhio: number;
  periodo: number;
  idApartado: number;
  cveUsuario: string;
  documentos: IDocumentoPayload[];
}

export interface IDocumentoPayload {
  idArchivo?: number;
  idTipoDocumento: number;
  fechaCarga: string;
  uuid: string;
  nombre: string;
}

export interface IEvidenciaResponse extends IMessageApi {
  respuesta: IItemEvidenciaResponse[];
}

export interface IItemEvidenciaResponse {
  idEvidencia: number;
  anhio: number;
  periodo: number;
  cveUsuario: string;
  apartado: string;
  idApartado: number;
  unidadAdministrativa: string;
  fechaRegistro: string;
  documentos: IDocumentoResponse[];
}

export interface IDocumentoResponse {
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
