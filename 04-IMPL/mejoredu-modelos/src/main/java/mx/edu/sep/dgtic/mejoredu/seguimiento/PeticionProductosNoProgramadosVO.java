package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;

@Data
public class PeticionProductosNoProgramadosVO {
  private Integer idActividad;
  private String cveUsuario;
  private Integer mes;
  private EvidenciaMensualVO evidencia;
  private EvidenciaComplementariaVO evidenciaComplementaria;
}
