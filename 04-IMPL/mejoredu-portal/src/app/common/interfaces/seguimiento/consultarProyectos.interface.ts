import { IMessageApi } from '../response-api.interface';

export interface IConsultarPRoyectosResponse extends IMessageApi {
  respuesta: IItemConsultarPRoyectosResponse[];
}

export interface IItemConsultarPRoyectosResponse {
  idProyecto: number;
  clave: string;
  nombre: string;
  claveUnidad: string;
  nombreUnidad: string;
  objetivo: string;
  fundamentacion: string;
  alcance: string;
  contribucionObjetivoPrioritarioPI: IContribucionResponse[];
  contribucionProgramaEspecial: number;
  contribucionPNCCIMGP: IContribucionResponse[];
  archivos: IArchivoResponse[];
  cveUsuario: string;
  estatus: string;
  dfActualizacion: null;
  dhActualizacion: null;
  dfRegistro: null;
  dhRegistro: null;
  cveUsuarioActualiza: null;
  idValidacion: null;
  idValidacionPlaneacion: null;
  idValidacionSupervisor: null;
  estatusPresupuesto: null;
  estatusPlaneacion: null;
  estatusSupervisor: null;
  ixCicloValidacion: null;
  ixAccion: number | null;
  semantica?: string;
}

export interface IArchivoResponse {
  idArchivo: number;
  uuid: string;
  uuidToPdf: string;
  nombre: string;
  estatus: string;
  usuario: string;
}

export interface IContribucionResponse {
  idCatalogo: number;
  idProyecto: number;
  tipoContribucion: number;
  idSecContribucion: number;
}
