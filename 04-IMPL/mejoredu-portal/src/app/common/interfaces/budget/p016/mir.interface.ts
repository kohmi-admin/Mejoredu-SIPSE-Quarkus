import { IMessageApi } from '@common/interfaces/response-api.interface';

export enum P016NivelMIR {
  ACTIVIDAD = 'Actividad',
  COMPONENTE = 'Componente',
  FIN = 'Fin',
  PROPOSITO = 'Propósito',
}

export interface IP016MIRResponse extends IMessageApi {
  respuesta: IItemP016MIRResponse;
}

export interface IIndicatorResponse extends IMessageApi {
  respuesta: IIndicador;
}

export interface IItemP016MIRResponse {
  idMir: number;
  idAnhio: number;
  matriz: IItemP016MIRMatriz[];
  fechaCreacion: string;
}

export interface IItemP016MIRMatriz {
  nivel: P016NivelMIR;
  clave: string;
  resumenNarrativo: string;
  nombreIndicador: string;
  supuestos: string;
  idIndicador?: number | null;
  mediosVerificacion: string;
  idFichaIndicador?: number | null;
}

export interface IRegisterMIR {
  idAnhio: number;
  matriz: IItemP016MIRMatriz[];
}

export interface IDatosGenerales {
  nombreIndicador: string;
  idDimensionMedicion: number;
  idTipoIndicador: number;
  definicionIndicador: string;
  metodoCalculo: string;
  idUnidadMedida: number;
  unidadMedidaDescubrir: string;
  unidadAbsoluta: string;
  idTipoMedicion: number;
  tipoMedicionDescubrir: string;
  idFrecuenciaMedicion: number;
  frecuenciaMedicionDescubrir: string;
  numerador: string;
  denominador: string;
  meta: string;
}

export interface ILineaBase {
  valorBase: string;
  idAnhio: number;
  periodo: string;
}

export interface IMetaAnual {
  valorAnual: string;
  idAnhio: number;
  periodoCumplimiento: string;
  medioVerificacion: string;
}

export interface ICaracteristicasVariables {
  nombreVariable: string;
  descripcionVariable: string;
  fuenteInformacion: string;
  unidadMedida: string;
  frecuenciaMedicion: string;
  metodoRecoleccion: string;
  idComportamientoIndicador: number;
  idComportamientoMedicion: number;
  idTipoValor: number;
  idDesagregacion: number;
  descripcionVinculacion: string;
}

export interface IIndicador {
  datosGenerales: IDatosGenerales;
  lineaBase: ILineaBase;
  metaAnual: IMetaAnual;
  caracteristicasVariables: ICaracteristicasVariables;
}
