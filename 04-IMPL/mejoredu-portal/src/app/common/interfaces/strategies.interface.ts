import { IMessageApi } from './response-api.interface';

export interface IStrategiePayload {
  idEstrategia: number | null;
  cdEstrategia: string;
  cveEstrategia: string;
  usuario: string;
  cveObjetivo: string;
  idEstructura: number;
}

export interface IStrategiesResponse extends IMessageApi {
  respuesta: IItemStrategieResponse[];
}

export interface IItemStrategieResponse {
  idEstrategia: number;
  cdEstrategia: string;
  cveEstrategia: string;
  usuario: string;
  cveObjetivo: string;
}

export interface IStrategieDeletePayload {
  idEstrategia: number | null;
  usuario: string;
}
