import { IMessageApi } from '../response-api.interface';

export interface IRegisterSolicitudResponse extends IMessageApi {
  respuesta: {
    idSolicitud: number;
  };
}

export interface IRegistrarSolicitudPayload {
  anhioId: number;
  folioSolicitud: string;
  fechaSolicitud: string;
  ixFolioSecuencia: number;
  unidadId: number;
  direccionId: number;
  adecuacionId: number;
  modificacionId: number;
  estatusId: number;
  justificacion: string;
  objetivo: string;
  fechaAutorizacion: string;
  montoAplicacion: number;
  usuario: string;
  adecuaciones: IAdecuacionesPayload[];
}

export interface IAdecuacionesPayload {
  idTipoApartado: number;
  tiposModificaciones: ITiposModificacionesPayload[];
}

export interface ITiposModificacionesPayload {
  idTipoModificacion: number;
}
