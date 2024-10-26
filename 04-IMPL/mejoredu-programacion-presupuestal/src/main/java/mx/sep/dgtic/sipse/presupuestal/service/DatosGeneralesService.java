package mx.sep.dgtic.sipse.presupuestal.service;

import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionDatosGeneralesVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaDatosGeneralesVO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.util.List;

public interface DatosGeneralesService {
  RespuestaDatosGeneralesVO consultarPorAnho(int anho);
  RespuestaDatosGeneralesVO consultarPorProgramaPresupuestal(int idProgramaPresupuestal);
  RespuestaDatosGeneralesVO consultarPorId(int id);
  List<ArchivoDTO> consultarArchivosPorId(int id);
  void registrar(PeticionDatosGeneralesVO datosGenerales);
}
