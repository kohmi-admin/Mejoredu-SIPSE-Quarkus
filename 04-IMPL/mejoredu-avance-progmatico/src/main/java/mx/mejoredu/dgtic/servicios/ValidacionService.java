package mx.mejoredu.dgtic.servicios;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.seguimiento.ValidacionDTO;

public interface ValidacionService {
  void guardar(ValidacionDTO peticion);
  ValidacionDTO consultarRevision(String apartado, Integer id, Integer trimestre, String rol);
}
