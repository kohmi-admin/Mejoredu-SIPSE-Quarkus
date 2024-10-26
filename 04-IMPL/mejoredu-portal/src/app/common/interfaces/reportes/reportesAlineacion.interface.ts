import { IMessageApi } from '../response-api.interface';

export interface IReportesAlineadosResponse extends IMessageApi {
  respuesta: IItemReportesAlineacionResponse;
}

export interface IItemReportesAlineacionResponse {
  productosAlineadosMIR: number;
  porcentajeAlineadosMIR: number;
  productosAlineadosNivelMIR: IProductosAlineadosResponse[];
  productosAlineadosEstatusMIRDTOS: IProductosAlineadosResponse[];
  productosAlineadosPorIndicadorMIRDTOS: IProductosAlineadosResponse[];
}

export interface IProductosAlineadosResponse {
  porcentaje: number;
  categoria: string;
}
