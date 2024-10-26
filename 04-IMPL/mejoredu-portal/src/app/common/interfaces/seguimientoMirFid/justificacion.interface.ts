import { IMessageApi } from "../response-api.interface";

export interface IJustifiacionActividadPayload {
  idIndicador: number;
  justificaciones: IJustificacionesPayload[];
  cveUsuario: string;
}

export interface IJustificacionesPayload {
  idProducto: number;
  justificacion: string;
  causa: string;
  efecto: string;
  otrosMotivos: string;
}

////////////////////////////////////////////////////////////////

export interface IJustificacionActividadResponse extends IMessageApi {
  resuesta: string
}

////////////////////////////////////////////////////////////////

export interface IJustifiacionIndicadorPayload {
  idIndicador: number;
  indicador: string;
  avance: number;
  archivos: IArchivoPayload[];
  causa: string;
  efecto: string;
  otrosMotivos: string;
  cveUsuario: string;
}

export interface IArchivoPayload {
  idArchivo: number;
  fechaCarga: string;
  uuid: string;
  nombre: string;
}

////////////////////////////////////////////////////////////////

export interface IJustificacionIndicadorResponse extends IMessageApi {
  resuesta: string
}


export interface JustificacionIndicadorResponse extends IMessageApi {
  respuesta: RespuestaJustificacionIndicador;
}

export interface RespuestaJustificacionIndicador {
  idIndicador:  number;
  indicador:    string;
  avance:       number;
  archivos:     Archivo[];
  causa:        string;
  efecto:       string;
  otrosMotivos: string;
  cveUsuario:   null;
}

export interface Archivo {
  idArchivo:       number;
  idTipoDocumento: null;
  fechaCarga:      Date;
  uuid:            string;
  nombre:          string;
}

export interface JustificacionActividadResponse extends IMessageApi {
  respuesta: RespuestaJustificacionActividad;
}

export interface RespuestaJustificacionActividad {
  idIndicador:     number;
  justificaciones: JustificacionesActividad[];
  cveUsuario:      string;
}

export interface JustificacionesActividad {
  idProducto:    number;
  justificacion: string;
  causa:         string;
  efectos:       string;
  otrosMotivos:  string;
}
