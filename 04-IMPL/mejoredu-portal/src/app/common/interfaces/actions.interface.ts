import { IMessageApi } from './response-api.interface';

export interface IActionPayload {
  idEstrategia: number;
  idAccion: number;
  cdAccion: string;
  cveEstrategia: string;
  cveAccion: string;
  usuario: string;
  idEstructura: number;
}

export interface IActionsResponse extends IMessageApi {
  respuesta: IItemActionPayload[];
}

export interface IItemActionPayload {
  idEstrategia: number;
  idAccion: number;
  cdAccion: string;
  cveEstrategia: string;
  cveAccion: string;
  usuario: string;
}

export interface IActionDeletePayload {
  idAccion: number;
  usuario: string;
}
