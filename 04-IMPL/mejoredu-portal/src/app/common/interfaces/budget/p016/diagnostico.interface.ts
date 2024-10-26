import { IMessageApi } from '@common/interfaces/response-api.interface';

export interface IP016DiagnosticoResponse extends IMessageApi {
  respuesta: IItemP016DiagnosticoResponse;
}

export interface IItemP016DiagnosticoResponse {
  anho:                             null;
  cveUsuario:                       string;
  antecedentes:                     string;
  estadoProblema:                   string;
  evolucionProblema:                string;
  definicionProblema:               string;
  identificacionPoblacionPotencial: string;
  cobertura:                        string;
  identificacionPoblacionObjetivo:  string;
  cuantificacionPoblacionObjetivo:  string;
  frecuenciaActualizacionPoblacion: string;
  analisisAlternativas:             string;
  idDiagnostico:                    number;
}

export interface IP016DiagnosticoPayload {
  anho:                             number;
  cveUsuario:                       string;
  antecedentes:                     string;
  estadoProblema:                   string;
  evolucionProblema:                string;
  definicionProblema:               string;
  identificacionPoblacionPotencial: string;
  cobertura:                        string;
  identificacionPoblacionObjetivo:  string;
  cuantificacionPoblacionObjetivo:  string;
  frecuenciaActualizacionPoblacion: string;
  analisisAlternativas:             string;
}
