import { IMessageApi } from "../response-api.interface";

export interface IRegistrarComentarioPayload {
  idComentario: number | null;
  comentario: string;
  usuario: string;
  idSolicitud: number;
}

export interface IRegistrarComentarioResponse extends IMessageApi {
  respuesta: IItemRegistrarComentariosPayload[];
}

export interface IItemRegistrarComentariosPayload {
  idComentario: number;
  comentario: string;
  usuario: string;
  idSolicitud: number;
  dfSeguimiento: string;
  dhSeguimiento: string;
}
