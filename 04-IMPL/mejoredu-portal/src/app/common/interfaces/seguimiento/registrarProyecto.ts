export interface IRegistrarProyectoPayload {
  idProyecto?: number;
  idAnhio: number;
  claveUnidad: string;
  nombreUnidad: string;
  objetivo: string;
  fundamentacion: string;
  alcance: string;
  contribucionObjetivo: IContribucionPayload[];
  contribucionProgramaEspecial: number;
  contribucionPNCCIMGP: IContribucionPayload[];
  archivos: Archivo[];
  cveUsuario: string;
  cveProyecto: number;
  nombreProyecto: string;
  // objetivoPriori: string;
  csEstatus: string;
  idAccion?: number;
  idAdecuacionSolicitud: number;
  idProyectoReferencia?: number | null;
}

export interface Archivo {
  idArchivo: number;
  uuid: string;
  uuidToPdf: string;
  nombre: string;
  estatus: string;
  usuario: string;
}

export interface IContribucionPayload {
  idCatalogo: number;
  idProyecto: number;
  tipoContribucion: number;
  idSecContribucion: number;
}
