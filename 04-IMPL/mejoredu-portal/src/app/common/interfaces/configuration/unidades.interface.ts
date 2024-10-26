import { IMessageApi, IResponseApi } from "../response-api.interface";

export interface IUnidadesResponse extends IResponseApi {
  catalogo: IItemUnidad[];
  respuesta?: IItemUnidad;
}

export interface IUnidadResponse extends IMessageApi {
  respuesta: IItemUnidad;
}

export interface IItemUnidad {
  idCatalogo:       number;
  cdOpcion:         string;
  ccExterna:        string;
  ccExternaDos:     string;
  cdDescripcionDos: null;
  idCatalgoPadre:   number;
  dfBaja:           null;
  registros:        null;
}

export interface IUnidadPayload {
  idCatalogo?:      number;
  cdOpcion:         string;
  cveUsuario?:       string;
  ccExterna:        string;
}


