package mx.mejoredu.dgtic.servicios;

import mx.edu.sep.dgtic.mejoredu.seguimiento.ActividadBaseVO;

import java.util.List;

public interface ActividadesService {
  List<ActividadBaseVO> consultaActividades(int idProyecto, Integer trimestre);
  // List<ActividadBaseVO> consultaActividades(int idProyecto, int mes);
  List<ActividadBaseVO> consultaActividadesPorAnhio(int anhio);
  List<ActividadBaseVO> consultaActividadesPorAnhio(int anhio, int trimestre, int tipoRegistro);
  List<ActividadBaseVO> consultaActividadesPorAnhioAndUnidad(int anhio, String cveUsuario);
}
