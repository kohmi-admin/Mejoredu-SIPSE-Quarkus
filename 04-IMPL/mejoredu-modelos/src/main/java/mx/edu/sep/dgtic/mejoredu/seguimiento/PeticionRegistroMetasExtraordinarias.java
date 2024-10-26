package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;

@Data
public class PeticionRegistroMetasExtraordinarias {
  private String cveUsuario;

  private Integer ixTipoMeta;
  private Integer idProducto;

  private Integer mesProgramado;
  private Integer mesEntregado;
  private Integer montoEntregado;

  private EvidenciaMensualVO evidencia;
  private EvidenciaComplementariaVO evidenciaComplementaria;
}
