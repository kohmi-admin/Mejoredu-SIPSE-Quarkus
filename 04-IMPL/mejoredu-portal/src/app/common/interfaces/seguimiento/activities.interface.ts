import { IMessageApi } from '../response-api.interface';

export interface IConsultaActividadPorIdResponse extends IMessageApi {
  respuesta: IItemConsultaActividadPorIdResponse;
}

export interface IItemConsultaActividadPorIdResponse {
  idActividad: number;
  cveActividad: number;
  cxNombreActividad: string;
  cxDescripcion: string;
  cxArticulacionActividad: string;
  cveUsuario: string;
  dfActividad: string;
  dhActividad: string;
  idProyecto: number;
  objetivo: IAccionResponse[];
  estrategia: IAccionResponse[];
  accion: IAccionResponse[];
  icActividadTransversal: number;
  ixReunion: number;
  cxTema: null;
  idAlcance: null;
  cxLugar: null;
  cxActores: null;
  csEstatus: string;
  fechaTentativa: any[];
  itSemantica: null;
}

export interface IAccionResponse {
  idEstaci: number;
  ixTipo: number;
  masterCatalogo: IMasterCatalogoResponse;
}

export interface IMasterCatalogoResponse {
  idCatalogo: number;
  cdOpcion: null;
  cxExterna: null;
  csEstatus: null;
  cveUsuario: null;
  idCatalogoPadre: null;
  cxDescripcionDos: null;
  cxExternaDos: null;
  ixDependencia: null;
}

export interface IGetActiModByIdAdecuacionResponse extends IMessageApi {
  respuesta: IItemGetActiModByIdAdecuacionResponse[];
}

export interface IItemGetActiModByIdAdecuacionResponse {
  idActividadModificacion: number;
  actividadModificacion: IActividadModByIdAdecuacionResponse;
  idActividadReferencia: number;
  actividadReferencia: IActividadModByIdAdecuacionResponse;
}

export interface IActividadModByIdAdecuacionResponse {
  idActividad: number;
  cveActividad: number;
  cxNombreActividad: string;
  cxDescripcion: string;
  cxArticulacionActividad: string;
  cveUsuario: string;
  dfActividad: string;
  dhActividad: string;
  idProyecto: number;
  objetivo: IAccionModByIdAdecuacionResponse[];
  estrategia: IAccionModByIdAdecuacionResponse[];
  accion: IAccionModByIdAdecuacionResponse[];
  icActividadTransversal: number;
  ixReunion: number;
  cxTema: string;
  idAlcance: number;
  cxLugar: string;
  cxActores: string;
  csEstatus: string;
  fechaTentativa: IFechaTentativaModByIdAdecuacionResponse[];
  itSemantica: number;
}

export interface IAccionModByIdAdecuacionResponse {
  idEstaci: number;
  ixTipo: number;
  masterCatalogo: IMasterCatalogoModByIdAdecuacionResponse;
}

export interface IMasterCatalogoModByIdAdecuacionResponse {
  idCatalogo: number;
  cdOpcion: string;
  cxExterna: string;
  csEstatus: string;
  cveUsuario: string;
  idCatalogoPadre: string;
  cxDescripcionDos: string;
  cxExternaDos: string;
  ixDependencia: number;
}

export interface IFechaTentativaModByIdAdecuacionResponse {
  idFechaTentativa: number;
  idActividad: number;
  idMes: number;
}
