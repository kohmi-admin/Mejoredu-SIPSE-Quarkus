import { IMessageApi } from '@common/interfaces/response-api.interface';

export interface IP016DataGeneralResponse extends IMessageApi {
  respuesta: IItemP016DataGeneralResponse;
}

export interface IItemP016DataGeneralResponse {
  cveUsuario: string;
  archivos: IArchivosResponse[];
  idRamo: number;
  idUnidadResponsable: number;
  anho: number;
  finalidad: string;
  funcion: string;
  subfuncion: string;
  actividadInstitucional: string;
  idVinculacionODS: number;
  idDatosGenerales: number;
  estatusGeneral: string;
  estatusPlaneacion: string;
  estatusPresupuestal: string;
  estatusSupervisor: string;
}

export interface IP016DataGeneralPayload {
  cveUsuario: string;
  nombreProgramaPresupuestal: string;
  archivos: IArchivoPayload[];
  idRamo: number;
  idUnidadResponsable: number;
  anho: number;
  finalidad: string;
  funcion: string;
  subfuncion: string;
  actividadInstitucional: string;
  idVinculacionODS: number;
}

export interface IArchivoPayload {
  uuid: string;
  tipoArchivo?: number;
  nombre?: string;
}

export interface IArchivosResponse {
  idArchivo: number;
  cxNombre: string;
  cxUuid: string;
  dfFechaCarga: string;
  dfHoraCarga: string;
  csEstatus: string;
  cveUsuario: string;
  cxUuidToPdf: null;
}
