import { IMessageApi } from "../response-api.interface";

export interface IBudgetResponse extends IMessageApi {
  respuesta: IItmeBudgetResponse[];
}

export interface IItmeBudgetResponse {
  idProducto:             number;
  cveUsuario:             string;
  cveAccion:              number;
  nombreAccion:           string;
  cveNivelEducativo:      string;
  idCentroCostos:         number;
  presupuestoAnual:       number;
  idFuenteFinanciamiento: number;
  partidasPresupuestales: PartidasPresupuestale[];
  estatus:                string;
  idPresupuesto:          number;
  dfPresupuesto:          any;
  dhPresupuesto:          any;
}

export interface IBudgetPayload {
  idProducto:             number;
  cveUsuario:             string;
  cveAccion:              number;
  nombreAccion:           string;
  cveNivelEducativo:      string;
  idCentroCostos:         number;
  presupuestoAnual:       number;
  idFuenteFinanciamiento: number;
  partidasPresupuestales: PartidasPresupuestale[];
  estatus:                string;
  idAdecuacionSolicitud?: number;
  idPresupuestoReferencia?: number | null;
}

export interface PartidasPresupuestale {
  idPartidaGasto?:        number;
  idCatalogoPartidaGasto: number;
  calendarizacion:        Calendarizacion[];
  anual:                  number;
  cxNombrePartida?:       string;
}

export interface Calendarizacion {
  mes:      number;
  monto:    number;
  activo?:  number;
}


export interface IGetBudgetModByIdAdecuacionResponse extends IMessageApi {
  respuesta: IItemGetBudgetModByIdAdecuacionResponse[];
}

export interface IItemGetBudgetModByIdAdecuacionResponse {
  idPresupuestoModificacion: number;
  presupuestoModificacion:   Presupuesto;
  idPresupuestoReferencia:   number;
  presupuestoReferencia:     Presupuesto;
}

export interface Presupuesto {
  idProducto:             number;
  cveUsuario:             string;
  cveAccion:              number;
  nombreAccion:           string;
  cveNivelEducativo:      string;
  idCentroCostos:         number;
  presupuestoAnual:       number;
  idFuenteFinanciamiento: number;
  partidasPresupuestales: PartidasPresupuestale[];
  estatus:                string;
  idPresupuesto:          number;
  dfPresupuesto:          string;
  dhPresupuesto:          string;
}

