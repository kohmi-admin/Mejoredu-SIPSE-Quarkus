import { IMessageApi } from '@common/interfaces/response-api.interface';

export interface IConsultaResponse extends IMessageApi {
  respuesta: IItemConsultaResponse[];
}

export interface IItemConsultaResponse {
  clave: string;
  aprobado: boolean;
  idProgramaPresupuestal: number;
  fechaRegistro: string;
  fechaActualizacion: string;
  fechaAprobacion: string;
  estatusGeneral: string;
  estatusPresupuestal: string;
  estatusPlaneacion: string;
  estatusSupervisor: string;
}
