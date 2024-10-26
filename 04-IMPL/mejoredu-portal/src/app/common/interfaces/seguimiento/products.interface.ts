import { IMessageApi } from '../response-api.interface';

export interface IProductsPayload {
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
  calendarizacion: ICalendarizacionPayload[];
  estatus: string;
  idAdecuacionSolicitud: number;
  idProductoReferencia: number | null;
  adecuacionMir: IAdecuacionMirPiPayload | null;
  adecuacionPi: IAdecuacionMirPiPayload | null;
}

export interface ICalendarizacionPayload {
  mes: number;
  monto: number;
  activo: number;
}

export interface ICreateProductResponse extends IMessageApi {
  respuesta: {
    idProducto: number;
  };
}

export interface IAdecuacionMirPiPayload {
  causas: string;
  efectos: string;
  otrosMotivos: string;
}

export interface IGetProdModByIdAdecuacionResponse extends IMessageApi {
  respuesta: IItemGetProdModByIdAdecuacionResponse[];
}

export interface IItemGetProdModByIdAdecuacionResponse {
  idProductoModificacion: number;
  productoModificacion: IProductoModByIdAdecuacionResponse;
  idProductoReferencia: number;
  productoReferencia: IProductoModByIdAdecuacionResponse;
}

export interface IProductoModByIdAdecuacionResponse {
  idProducto: number;
  cveUsuario: string;
  idProyecto: number;
  idActividad: number;
  cveProducto: string;
  nombre: string;
  descripcion: string;
  idCategorizacion: number;
  idTipoProducto: number;
  idIndicadorMIR: null;
  idIndicadorPI: number;
  idNivelEducativo: number;
  vinculacionProducto: string;
  idContinuidad: number;
  porPublicar: null;
  idAnhoPublicacion: null;
  nombrePotic: null;
  productoCalendario: ProductoCalendario[];
  estatus: string;
  adecuacionMir: IAdecuacionMirPiPayload | null;
  adecuacionPi: IAdecuacionMirPiPayload | null;
}

export interface ProductoCalendario {
  idProductoCalendario: number;
  mes: number;
  monto: number;
  idProducto: number;
}
