import { IMessageApi } from '@common/interfaces/response-api.interface';

export interface I001FichaResponse extends IMessageApi {
  respuesta: IItem001FichaResponse;
}

export interface IItem001FichaResponse {
  datosGenerales: DatosGenerales;
  lineaBase: LineaBase;
  metaAnual: MetaAnual;
  caracteristicasVariables: CaracteristicasVariables;
  idProgramaPresupuestal: number;
  idTipoPrograma: number;
  archivos: Archivo[];
  idRamoSector: number;
  idUnidadResponsable: number;
  nombrePrograma: string;
  idVinculacionODS: number;
  cveUsuario: string;
  idAnhio: number;
  estatusGeneral: string;
  estatusPlaneacion: string;
  estatusPresupuestal: string;
  estatusSupervisor: string;
}

export interface I001FichaPayload {
  datosGenerales: DatosGenerales;
  lineaBase: LineaBase;
  metaAnual: MetaAnual;
  caracteristicasVariables: CaracteristicasVariables;
  archivos: ArchivoPayload[];
  nombrePrograma: string;
  idVinculacionODS: number;
  cveUsuario: string;
  idAnhio: number;
}

export interface DatosGenerales {
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

export interface LineaBase {
  valorBase: string;
  idAnhio: number;
  periodo: string;
}

export interface MetaAnual {
  valorAnual: string;
  idAnhio: number;
  periodoCumplimiento: string;
  medioVerificacion: string;
}

export interface CaracteristicasVariables {
  nombreVariable: string;
  descipcionVariable: string;
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

export interface Archivo {
  idArchivo: number;
  cxNombre: string;
  cxUuid: string;
  dfFechaCarga: string;
  dfHoraCarga: string;
  csEstatus: string;
  cveUsuario: string;
  cxUuidToPdf: null;
}

export interface ArchivoPayload {
  uuid: string;
  tipoArchivo: number;
  nombre: string;
}
