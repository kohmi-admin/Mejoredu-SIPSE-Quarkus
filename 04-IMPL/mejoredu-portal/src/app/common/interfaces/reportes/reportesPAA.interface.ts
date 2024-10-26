import { IMessageApi } from '../response-api.interface';

export interface IReportesPAAResponse extends IMessageApi {
  respuesta: IItemReportesPAAResponse;
}

export interface IItemReportesPAAResponse {
  totalProyectos: number;
  totalActividades: number;
  totalProductos: number;
  totalEntregables: number;
  productosCategoria: IProductosCategoriaResponse[];
  proyectosUnidad: IProyectosUnidadResponse[];
  productosTipo: IProductosTipoResponse[];
}

export interface IProductosCategoriaResponse {
  totalProductos: number;
  categoria: string;
}

export interface IProductosTipoResponse {
  tipo: string;
  cantidad: number;
}

export interface IProyectosUnidadResponse {
  unidad: string;
  clave: string;
  nombreProyecto: string;
}
