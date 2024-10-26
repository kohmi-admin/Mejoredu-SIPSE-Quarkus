import { IMessageApi } from '../response-api.interface';
import { IRegistrarMetaVAItem } from './avances-metasVA.interface';
// Get Methods - - - - - - - - - - - - - - - - - - - - -
// Consulta de Avance
export interface IItemConsultaAvance {
  idProducto: number;
  cveProyecto: string;
  cveActividad: string;
  cveProducto: string;
  productosProgramados: IItemProductoProgramado[];
}

export interface IItemConsultaAvences {
  idAvance: number;
  idEvidenciaMensual: number;
  idEvidenciaTrimestral: number;
  cveProyecto: string;
  nombreProyecto: string;
  cveActividad: string;
  nombreActividad: string;
  cveProducto: string;
  nombreProducto: string;
  mes: number;
  mesStr?: string;
}

export interface IItemProductoProgramado {
  mes: number;
  productosProgramados: number;
  productosEntregados: number;
}

// Evidencia Mensual
export interface IItemConsultaEvidenciaMensual {
  estatus: string;
  justificacion: string;
  descripcionTareas: string;
  descripcionProducto: string;
  especificarDifusion: string;
  archivos: IItemArchivo[];
}

export interface IItemArchivo {
  idArchivo?: number;
  uuid: string;
  nombre: string;
  fechaCarga?: string;
  file?: any;
}

// Evidencia Trimestral
export interface IItemConsultaEvidenciaTrimestral {
  indicadorMIR: string;
  metaSuperada: string;
  dificultad: string;
  revisado: boolean;
  fechaSesion: string;
  aprobado: string;
  fechaAprobacion: string;
  publicacion: boolean;
  tipoPublicacion: string;
  especificarPublicacion: string;
  difusion: boolean;
  tipoDifusion: string;
  especificarDifusion: string;
}

export interface IDTOEvidenciaTrimestral
  extends IItemConsultaEvidenciaTrimestral {
  idProducto: string;
  trimestre: number;
}

// Consultar PAA
export interface IItemPAA extends IMessageApi {
  idProyecto: number;
  idAnhio: number;
  estatus: string;
  nombreProyecto: string;
  cveProyecto: string;
}

// POST Methods - - - - - - - - - - - - - - - - - - - - -
// Registrar Entregables
export interface IDTORegistrarEntregables {
  idProducto: number;
  cveProyecto: string;
  cveActividad: string;
  cveProducto: string;
  productosProgramados: IItemProductoProgramado[];
}

// /api/avance-programatico/registrarMetasVencidasAdelantadas #################

// Registrar Evidecia Mensual
export interface IDTOEvidenciaMensual {
  estatus: string;
  justificacion: string;
  descripcionTareas: string;
  descripcionProducto: string;
  especificarDifusion?: string;
  archivos: IItemArchivo[];
  idProducto: number;
  mes: number;
}

export interface IResponseRegistrarEvidenciaMensual {
  idAvance: number;
  idEvidenciaMensual: number;
}

// Registrar Evidecia Trimestral
export interface IResponseRegistrarEvidenciaTrimestral {
  idAvance: number;
  idEvidenciaTrimestral: number;
}

export interface IArchivoPnP {
  idArchivo?: number;
  fechaCarga?: string;
  uuid: string;
  nombre?: string;
  file?: File;
}

export interface IEvidencia {
  estatus?: string;
  justificacion?: string;
  descripcionTareas: string;
  descripcionProducto: string;
  especificarDifusion?: string;
  archivos: IArchivoPnP[];
}

export interface IEvidenciaComplementaria {
  dificultad: string;
  revisado: boolean;
  fechaSesion: string;
  aprobado: string;
  fechaAprobacion: string;
  publicacion: boolean;
  tipoPublicacion: number;
  especificarPublicacion: string;
  difusion: boolean;
  tipoDifusion: number;
  especificarDifusion: string;
  idArticulacion: number;
}

export interface IDTOProductoNoProgramado {
  idActividad: number;
  cveUsuario: string;
  evidencia: IEvidencia;
  mes: number;
  evidenciaComplementaria: IEvidenciaComplementaria;
}

export interface IResponseProductoNoProgramado {
  idAvance: number;
  idEvidenciaMensual: number;
  idEvidenciaTrimestral: number;
}

export interface IResponseConsultarProductos {
  idProducto: number;
  cveProducto: string;
  cxNombre: string;
  cxDescripcion: string;
  csEstatus: string;
  csEstatusMensual: string;
  dfProducto: string;
  dhProducto: string;
  idActividad: number;
  idIndicadorMIR: number;
  indicadorMIR: string;
  idCategorizacion: number;
  idTipoProducto: number;
}

export interface IResponseConsultarPAA {
  idProyecto: number;
  idAnhio: number;
  estatus: string;
  nombreProyecto: string;
  cveUnidad: string;
  cveProyecto: string;
}

export interface IResponseActividades {
  idActividad: number;
  cveActividad: number;
  cxNombreActividad: string;
  cxDescripcion: string;
  cxArticulacionActividad: string;
  cveUsuario: string;
  dfActividad: string;
  dhActividad: string;
  idProyecto: number;
}

// Interfaces de respuesta - - - - - - - - - - - - - - - -
export interface IConsultaAvance extends IMessageApi {
  respuesta: IItemConsultaAvance;
}

export interface IConsultaAvances extends IMessageApi {
  respuesta: IItemConsultaAvences[];
}

export interface IConsultaEvidenciaMensual extends IMessageApi {
  respuesta: IItemConsultaEvidenciaMensual;
}

export interface IConsultaEvidenciaTrimestral extends IMessageApi {
  respuesta: IItemConsultaEvidenciaTrimestral;
}

export interface IConsultaPAA extends IMessageApi {
  respuesta: IItemPAA;
}

export interface IRegistrarEntregables extends IMessageApi {
  respuesta: IItemConsultaAvance;
}

export interface IRegistrarMetaVA extends IMessageApi {
  respuesta: IRegistrarMetaVAItem;
}

export interface IRegistrarEvidenciaMensual extends IMessageApi {
  respuesta: IResponseRegistrarEvidenciaMensual;
}

export interface IRegistrarEvidenciaTrimestral extends IMessageApi {
  respuesta: IResponseRegistrarEvidenciaTrimestral;
}

export interface IRegistrarProductoNoProgramado extends IMessageApi {
  respuesta: IResponseProductoNoProgramado;
}

export interface IConsultarProductos extends IMessageApi {
  respuesta: IResponseConsultarProductos[];
}

export interface IConsultarPAA extends IMessageApi {
  respuesta: IResponseConsultarPAA[];
}

export interface IConsultarActividades extends IMessageApi {
  respuesta: IResponseActividades[];
}
