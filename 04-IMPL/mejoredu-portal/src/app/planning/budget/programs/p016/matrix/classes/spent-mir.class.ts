import { IItemP016MIRMatriz, P016NivelMIR } from "@common/interfaces/budget/p016/mir.interface";

export class SpentMIR {
  nivel:              P016NivelMIR;
  clave:              string;
  resumenNarrativo:   string;
  nombreIndicador:    string;
  supuestos:          string;
  idIndicador?:        number;
  mediosVerificacion: string;

  constructor(
    nivel:              P016NivelMIR,
    clave:              string,
    resumenNarrativo:   string,
    nombreIndicador:    string,
    supuestos:          string,
    mediosVerificacion: string,
    idIndicador?:        number,
  ) {
    this.nivel = nivel;
    this.clave = clave;
    this.resumenNarrativo = resumenNarrativo;
    this.nombreIndicador = nombreIndicador;
    this.supuestos = supuestos;
    this.idIndicador = idIndicador;
    this.mediosVerificacion = mediosVerificacion;
  }

  toJSON(): IItemP016MIRMatriz {
    return {
      nivel: this.nivel,
      clave: this.clave,
      resumenNarrativo: this.resumenNarrativo,
      nombreIndicador: this.nombreIndicador,
      supuestos: this.supuestos,
      idIndicador: this.idIndicador,
      mediosVerificacion: this.mediosVerificacion,
    };
  }

}
