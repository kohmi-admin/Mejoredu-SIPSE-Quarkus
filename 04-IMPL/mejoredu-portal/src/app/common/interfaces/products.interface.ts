import { IMessageApi } from './response-api.interface';

export interface IProductPayload {
  cveUsuario: string;
  idActividad: number;
  cveProducto: string;
  nombre: string;
  descripcion: string;
  idCategorizacion: number;
  idTipo: number;
  idIndicadorMIR: number;
  idIndicadorPI: number;
  idNivelEducativo: number;
  vinculacion: string;
  idContinuidadOtros: number;
  porPublicar: string | null;
  idAnhoPublicacion: number;
  cveNombreProyectoPOTIC: string;
  estatus: string;
  calendarizacion: ICalendarizacion[];
}

export interface ICalendarizacion {
  mes: number;
  activo: number;
}

export interface IProductsResponse extends IMessageApi {
  respuesta: IItemProductResponse[];
}

export interface IProductResponse extends IMessageApi {
  respuesta: IItemProductResponse;
}

export interface IItemProductResponse {
  idProyecto: number;
  idProducto: number;
  cveUsuario: string;
  idActividad: number;
  cveProducto: string;
  nombre: string;
  descripcion: string;
  idCategorizacion: number;
  idTipoProducto: number;
  idIndicadorMIR: number;
  indicadorMIR?: string;
  idIndicadorPI: number;
  idNivelEducativo: number;
  vinculacionProducto: string;
  idContinuidad: number;
  porPublicar: string;
  idAnhoPublicacion: number;
  nombrePotic: string;
  estatus: string;
  productoCalendario: ProductoCalendario[];
}

export interface ProductoCalendario {
  idProductoCalendario: number;
  mes: number;
  monto: number;
  idProducto: number;
}

export interface IProductoSecuencialResponse extends IMessageApi {
  respuesta: number;
}
