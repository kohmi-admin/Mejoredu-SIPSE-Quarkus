package mx.sep.dgtic.sipse.medianoplazo.servicios;

import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO2;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ElementoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.PeticionMetasBienestarDTO;

import java.util.List;

public interface ParametroService {
  List<MasterCatalogoDTO2> consultarCatalogoIndicadoresPI(Integer anhio);
  List<PeticionMetasBienestarDTO> consultarPorIdEstrucura(Integer idEstructura);
  PeticionMetasBienestarDTO consultarPorId(Integer idMetaBienestar);
  RespuestaGenerica registrar(PeticionMetasBienestarDTO peticion);
  RespuestaGenerica modificar(PeticionMetasBienestarDTO peticion);
  RespuestaGenerica eliminar(Integer idMetaBienestar, String cveUsuario);
  List<ElementoDTO> consultarPorIdProyecto(Integer idProyecto);
  List<ElementoDTO> consultarPorIdActividad(Integer idActividad);
}
