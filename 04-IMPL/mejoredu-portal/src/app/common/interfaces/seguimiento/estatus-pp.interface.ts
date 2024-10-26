import { IMessageApi } from '../response-api.interface';

// Get Methods - - - - - - - - - - - - - - - - - - - - -
// Consultar PProyectos DTO
export interface IDTOConsultaProyectos {
  trimestre?: number;
  anhio: number;
  idActividad?: number;
  idProyecto?: number;
  idTipoAdecuacion?: number;
  idUnidad?: number;
}

// Consulta Estatus
export interface IItemConsultaProyectos {
  idProyecto: number;
  idUnidad: number;
  unidad: string;
  proyecto: string;
  presupuestoProgramado: number;
  presupuestoModificado: number;
  presupuestoPorcentaje: number;
  totalActividades: number;
  totalProductos: number;
  totalEntregables: number;
  productosPorcentaje: number;
  entregablesPorcentaje: number;
}

// Interfaces de respuesta - - - - - - - - - - - - - - - -
export interface IConsultaProyectosEPP extends IMessageApi {
  respuesta: IItemConsultaProyectos;
}
