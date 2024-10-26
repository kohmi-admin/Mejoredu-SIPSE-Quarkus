import { IEvidencia, IEvidenciaComplementaria } from "./avances.interface";

export interface IRegistrarMetaVAItem {
  cveUsuario: string;
  ixTipoMeta: number;
  idProducto: number;
  mesProgramado: number;
  mesEntregado: number;
  montoEntregado: number;
  evidencia: IEvidencia;
  evidenciaComplementaria: IEvidenciaComplementaria;
}
