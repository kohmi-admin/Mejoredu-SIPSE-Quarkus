import { IMessageApi } from '../response-api.interface';

export interface IAccionFollowResponse extends IMessageApi {
  respuesta: IItmeAccionFollowResponse[];
}

export interface IItmeAccionFollowResponse {
  idProducto: number;
  claveAccion: number;
  nombre: string;
  idAdecuacionSolicitud: number;
  idAccionReferencia: number;
  idAccion: number;
  cveUnidad: string;
  csEstatus: string;
}

export interface IAccionFollowPayload {
  idProducto: number;
  claveAccion: number;
  nombre: string;
  idAdecuacionSolicitud: number;
  idAccionReferencia: number | null;
  cveUnidad: string;
  csEstatus: string;
}

export interface IGetAcccionModByIdAdecuacionResponse extends IMessageApi {
  respuesta: IItemGetAcccionModByIdAdecuacionResponse[];
}

export interface IItemGetAcccionModByIdAdecuacionResponse {
  idAccionModificacion: number;
  accionModificacion: IAccionModByIdAdecuacionResponse;
  idAccionReferencia: number;
  accionReferencia: IAccionModByIdAdecuacionResponse;
}

export interface IAccionModByIdAdecuacionResponse {
  idProducto: number;
  claveAccion: number;
  nombre: string;
  idAdecuacionSolicitud: number;
  idAccionReferencia: number;
  cveUnidad: string;
  csEstatus: string;
  idAccion: number;
}

export interface ICreateAccionResponse extends IMessageApi {
  respuesta: {
    idAccion: number;
  };
}

export interface IGetAccionByIdResponse extends IMessageApi {
  respuesta: IItmeAccionFollowResponse;
}
