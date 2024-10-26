export interface IMessageApi {
  codigo: string;
  mensaje: string;
}

export interface IResponseApi {
  mensaje: IMessageApi;
}
