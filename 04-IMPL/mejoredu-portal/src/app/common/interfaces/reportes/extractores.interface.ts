import { IMessageApi } from '../response-api.interface';

export interface IExtractorPayload {
  idAnhio: number;
  cveUsuario: string;
  dataReporte: string[];
}

export interface IExtractorResponse extends IMessageApi {
  respuesta: IItemExtractorResponse[];
}

export interface IItemExtractorResponse {
  id: number;
  idAnhio: number;
  cxOrigen: string;
  cveUnidad: string;
  cveProyecto: string;
  nombreProyecto: string;
  cveActividad: string;
  nombreActividad: string;
  cveProducto: string;
  nombreProducto: string;
  nombreCategoria: string;
  nombreTipo: string;
  mes: string;
  entregable: string;
}
