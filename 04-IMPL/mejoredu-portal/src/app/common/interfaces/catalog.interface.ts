import { IResponseApi } from "./response-api.interface";

export interface ICatalogPayload {
  cdOpcion: string;
  ccExterna: string;
  cveUsuario: string;
  idCatalogoPadre?: number;
}

export interface ICatalogResponse extends IResponseApi {
  catalogo: IItemCatalogoResponse[];
}

export interface IItemCatalogoResponse {
  idCatalogo: number;
  cdOpcion: string;
  ccExterna: string;
  ccExternaDos?: string;
  cdDescripcionDos?: string;
  idCatalgoPadre?: number;
  registros?: IItemCatalogoResponse[];
}
