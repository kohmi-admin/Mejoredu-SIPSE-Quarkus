import { IMessageApi } from '../response-api.interface';
import { IItemConsultarPRoyectosResponse } from './consultarProyectos.interface';

export interface ICreateProjectSeguimientoResponse extends IMessageApi {
  respuesta: {
    idProyecto: number;
  };
}

export interface IGetProModByIdAdecuacionResponse extends IMessageApi {
  respuesta: IItemGetProModByIdAdecuacionResponse[];
}

export interface IItemGetProModByIdAdecuacionResponse {
  idProyectoModificacion: number;
  idProyectoReferencia: number;
  proyectoModificacion: IItemConsultarPRoyectosResponse;
  proyectoReferencia: IItemConsultarPRoyectosResponse;
}

export interface IConsultaProyectoPorIdResponse extends IMessageApi {
  respuesta: IItemConsultaProyectoPorIdResponse;
}

export interface IItemConsultaProyectoPorIdResponse {
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
  ixAccion: null;
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
