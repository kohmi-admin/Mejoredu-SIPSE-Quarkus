package mx.mejoredu.dgtic.servicios;

import mx.edu.sep.dgtic.mejoredu.seguimiento.ProyectoBaseVO;

import java.util.List;

public interface ProyectosService {
  List<ProyectoBaseVO> consultaPAA(int idAnhio, String cveUsuario, Integer trimestre);
  List<ProyectoBaseVO> consultaPaaIdUnidad(int idAnhio, int idUnidad);
  void enviarRevision(Integer idProyecto, Integer trimestre);
}
