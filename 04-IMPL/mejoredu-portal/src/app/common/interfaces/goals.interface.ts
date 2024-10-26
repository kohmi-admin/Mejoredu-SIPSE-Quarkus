import { IMessageApi } from './response-api.interface';

export interface IGoalsResponse extends IMessageApi {
  respuesta: IItemGoalResponse[];
}

export interface IItemGoalResponse {
  idObjetivo: number;
  ixObjetivo: number;
  cdObjetivo: string;
  relevancia: string;
}

export interface IGoalPayload {
  idObjetivo: number;
  ixObjetivo: number;
  cdObjetivo: string;
  relevancia: string;
  usuario: string;
  idEstructura: number;
}
