package mx.sep.dgtic.sipse.presupuestal.service;

import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionDiagnosticoVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaDiagnosticoVO;

public interface DiagnosticoService {
  RespuestaDiagnosticoVO consultarPorAnho(int anho);
  RespuestaDiagnosticoVO consultarPorProgramaPresupuestal(int idProgramaPresupuestal);
  RespuestaDiagnosticoVO consultarPorId(int id);
  void registrar(PeticionDiagnosticoVO diagnostico);
}
