import { IMessageApi } from '@common/interfaces/response-api.interface';

export interface IP016ObjetiveTreeResponse extends IMessageApi {
  respuesta: IItemP016ObjetiveTreeRespuesta;
}

export interface IItemP016ObjetiveTreeRespuesta {
  idArbol: number;
  idAnhio: number;
  problemaCentral: string;
  medios: FineResponse[];
  fines: FineResponse[];
  fechaCreacion: string;
  esquema: any;
}

export interface FineResponse {
  idNodo: number;
  nivel: number;
  clave: string;
  descripcion: string;
  idTipo: null;
  hijos: FineResponse[];
}

export interface IP016ObjetiveTreePayload {
  idAnhio: number;
  problemaCentral: string;
  medios: FinePayload[];
  fines: FinePayload[];
  esquema: IEsquemaPayload;
}

export interface FinePayload {
  clave: string;
  descripcion: string;
  idTipo: number;
  hijos: string[];
}

export interface IEsquemaPayload {
  uuid: string;
  tipoArchivo: number;
  nombre: string;
}
