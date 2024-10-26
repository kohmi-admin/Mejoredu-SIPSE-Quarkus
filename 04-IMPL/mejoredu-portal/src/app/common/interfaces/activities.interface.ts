import { IResponseApi } from './response-api.interface';

export interface IActivitiesResponse extends IResponseApi {
  actividad: IItemActivitiesResponse;
}

export interface IFechaTentativaActivitiesResponse {
  idActividad: number;
  idFechaTentativa: number;
  idMes: number;
}

export interface IItemActivitiesResponse {
  idActividad:             number;
  cveActividad:            number;
  cxNombreActividad:       string;
  cxDescripcion:           string;
  cxArticulacionActividad: string;
  cveUsuario:              string;
  dfActividad:             string;
  dhActividad:             string;
  idProyecto:              number;
  objetivo:                MasterCatalogsIds[];
  estrategia:              MasterCatalogsIds[];
  accion:                  MasterCatalogsIds[];
  icActividadTransversal:  number;
  ixReunion:               number;
  cxTema:                  string;
  idAlcance:               number;
  cxLugar:                 string;
  cxActores:               string;
  csEstatus:               string;
  fechaTentativa:          IFechaTentativaActivitiesResponse[];
}

export interface MasterCatalogsIds {
  idEstaci?:       number;
  ixTipo?:         number;
  masterCatalogo: MasterCatalogo;
}

export interface MasterCatalogo {
  idCatalogo:       number;
}
