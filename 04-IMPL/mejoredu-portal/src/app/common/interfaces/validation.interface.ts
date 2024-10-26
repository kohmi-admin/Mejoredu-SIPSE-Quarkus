import { IArchivoProjectsResponse } from './projects.interface';
import { IMessageApi } from './response-api.interface';

export interface IConsultaRevisionResponse extends IMessageApi {
  respuesta: IValidationPayload;
}

export interface IValidationPayload {
  apartado: string;
  id: number;
  estatus: string;
  revision: IRevisionPayload[];
  cveUsuario: string;
  archivos?: IArchivoPayload[] | null;
  rubrica?: IRubricaPayload[];
}

export interface IArchivoPayload {
  idArchivo: number;
  cxNombre: string;
  cxUuid: string;
  dfFechaCarga: string;
  dfHoraCarga: string;
  csEstatus: string;
  cveUsuario: string;
  cxUuidToPdf: string;
}

export interface IRevisionPayload {
  idElemento: number;
  check: 0 | 1;
  comentarios: string | null;
}

export interface IRubricaPayload {
  idRubro: number;
  cxObservaciones: string | null;
  ixPuntuacion: number;
}

export interface IRubricaComponent {
  listRubrics?: IRubricaPayload[];
  docAnalitico?: IArchivoProjectsResponse;
  totalRubric?: string;
  selectedActividad?: any;
  selectedProducto?: any;
  disable?: boolean;
}
