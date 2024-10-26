export interface IActualizarProyectoPayload {
  cveProyecto: number;
  cxNombreProyecto: string;
  cxObjetivo: string;
  // cxObjetivoPrioritario: string;
  cveUsuario: string;
  idAnhio: number;
  csEstatus: string;
  contribucionObjetivo: IContribucionPayload[];
  contribucionProgramaEspecial: number;
  contribucionPNCCIMGP: IContribucionPayload[];
  archivo: IArchivoPayload;
  cxNombreUnidad: string;
  cveUnidad: string;
  cxAlcance: string;
  cxFundamentacion: string;
  // idAccion?: number;
  idAdecuacionSolicitud?: number;
  idProyectoReferencia?: number | null;
}

export interface IArchivoPayload {
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
