import { IMessageApi } from "../response-api.interface";

export interface IGoalsWellBeingResponse extends IMessageApi {
  respuesta: IItmeGoalsWellBeingResponse[];
}

export interface IItmeGoalsWellBeingResponse {
  idMetas:          number;
  idEstructura:     number;
  cveUsuario:       string;
  estatus:          string;
  ixTipo:           number;
  elemento:         Elemento[];
  aplicacionMetodo: AplicacionMetodo[];
  valorLineaBase:   ValorLineaBase[];
  serieHistorica:   SerieHistorciaMetasIntermedia[];
  metasIntermedias: SerieHistorciaMetasIntermedia[];
}

export interface Elemento {
  idElemento:              number;
  idObjetivo:              number;
  nombre:                  string;
  descripcion:             string;
  nivelDesagregacion:      number;
  periodicidad:            number;
  especificarPeriodicidad:  string;
  tipo:                    number;
  acumulado:               number;
  recoleccion:             number;
  periodoRecoleccion:      number;
  //catalogoUnidadMedida:    number;
  unidadMedida:            number;
  especificarUnidadMedida:  string;
  periodo:                 number;
  especificarPeriodo:       string;
  dimensiones:             number;
  disponibilidad:          number;
  tendencia:               number;
  metodoCalculo:           string;
  observaciones:           string;
  unidadResponsable:       number;
}

export interface AplicacionMetodo {
  idAplicacion:         number;
  nombreVariable:       string;
  valorVariableUno:     string;
  fuenteInformacion:    string;
  nombreVariableDos:    string;
  valorVariableDos:     string;
  fuenteInformacionDos: string;
  sustitucion:          string;
}

export interface ValorLineaBase {
  idLinea: number;
  valor:   string;
  anhio:   number;
  notas:   string;
  meta:    string;
  idMeta:  number;
}

export interface SerieHistorciaMetasIntermedia {
  idMeta:      number;
  idSerie:     number;
  tipo:        string;
  anhio:       number;
  descripcion: string;
}
