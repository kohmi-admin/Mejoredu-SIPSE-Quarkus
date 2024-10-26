import { IMessageApi } from "../response-api.interface";

export interface IDireccionResponse extends IMessageApi {
  respuesta: IDireccionPayload;
}

export interface IDireccionesResponse extends IMessageApi {
  respuesta: IItemDireccion[];
}

export interface IDireccionPayload {
  cdOpcion:     string;
  cveUsuario:   string;
  ccExterna:    string | null;
  ccExternaDos: string;
}

export interface IItemDireccion {
  idCatalogo:       number;
  cdOpcion:         string;
  ccExterna:        string;
  dfBaja:           string;
  cveUsuario:       string;
  idCatalogoPadre:  number;
  cdDescripciondos: string;
  ccExternados:     string;
}
