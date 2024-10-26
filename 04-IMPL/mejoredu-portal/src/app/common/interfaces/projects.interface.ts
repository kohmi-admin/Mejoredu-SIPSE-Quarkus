import { IMessageApi, IResponseApi } from './response-api.interface';

export interface IProjectsResponse extends IResponseApi {
  proyecto: IItemProjectsResponse[];
  // respuesta: IItemProjectsResponse[]; //REVIEW: Response truena cuando se usa proyecto
}

export interface IItemProjectsResponse {
  idProyecto: number;
  claveNombreUnidad?: string;
  clave: string;
  claveProyecto?: string;
  nombre: string;
  claveUnidad: string;
  nombreUnidad: string;
  objetivo: string;
  fundamentacion: string;
  alcance: string;
  contribucionObjetivoPrioritarioPI: IContribucionProjectsResponse[];
  contribucionProgramaEspecial: number;
  contribucionPNCCIMGP: IContribucionProjectsResponse[];
  archivos: IArchivoProjectsResponse[];
  cveUsuario: string;
  estatus: string;
  cveUsuarioActualiza: any;
  dfActualizacion: any;
  dhActualizacion: any;
  estatusPlaneacion: string;
  estatusPresupuesto: string;
  estatusSupervisor: string;
  ixCicloValidacion: number;
  semantica: number;
}

export interface IArchivoProjectsResponse {
  idArchivo: number;
  uuid: string;
  uuidToPdf: string | null;
  nombre: string;
  estatus: string;
  usuario: string;
}

export interface IContribucionProjectsResponse {
  idCatalogo: number;
  idProyecto: number;
  tipoContribucion: number;
  idSecContribucion: number;
}

export interface IProyectoPayloadDelete {
  id: number;
  usuario: string;
}

export interface IVistaGeneralResponse extends IResponseApi {
  proyecto: IItemVistaGeneralResponse[];
}

export interface IItemVistaGeneralResponse {
  idProyecto: number;
  cveProyecto: number;
  nombreProyecto: string;
  objetivo: string;
  estatus: string;
  anhio: number;
  cveUnidad: string;
  cveProgramaInstitucional: ICveProgramaInstitucionalResponse[];
}

export interface ICveProgramaInstitucionalResponse {
  clave: string;
  actividad: IActividadResponse[];
}

export interface IActividadResponse {
  cveActividad: number;
  idActividad: number;
  cxNombreActividad: string;
  csEstatus: string;
  agenda: null;
  productos: IProductoResponse[];
}

export interface IProductoResponse {
  idProducto: number;
  cveProducto: string;
  secuenciaProducto: string;
  cveCategorizacionProducto: number;
  cveTipoProducto: number;
  POTIC: null;
  cxNombreProducto: string;
  categoria: string;
  tipo: string;
  cxEstatus: string;
  indicadorMIR: string;
  cveIndicadorMIR: string;
  calendario: ICalendarioResponse[];
  presupuestos: IPresupuestoResponse[];
  potic: null;
}

export interface ICalendarioResponse {
  idProductoCalendario: number;
  mes: number;
  monto: number;
  idProducto: number;
}

export interface IPresupuestoResponse {
  idPresupuesto: number;
  cveAccion: number;
  cxNombrePresupuesto: string;
  cxPartidaGasto: ICxPartidaGastoResponse;
  csEstatus: string;
}

export interface ICxPartidaGastoResponse {
  idCatalogoPartidaGasto: number;
  calendarizacion: ICalendarizacionResponse[];
  anual: string;
}

export interface ICalendarizacionResponse {
  mes: number;
  monto: number;
  activo: number;
  nombrePartida: string;
}

export interface IGetProjectsAnhioStatus extends IResponseApi {
  proyecto: IItemProjectsResponse[];
}

export interface IGetProjectComplete extends IMessageApi {
  respuesta: IItemGetProjectComplete[];
}

export interface IItemGetProjectComplete {
  id: number;
  idProyecto: number;
  apartado: string;
  estatus: string;
}
