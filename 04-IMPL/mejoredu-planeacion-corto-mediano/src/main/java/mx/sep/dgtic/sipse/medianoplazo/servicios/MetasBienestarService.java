package mx.sep.dgtic.sipse.medianoplazo.servicios;

import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.PeticionMetasBienestarDTO;

import java.util.List;

public interface MetasBienestarService {
  List<PeticionMetasBienestarDTO> consultarPorIdEstrucura(Integer idEstructura);
  PeticionMetasBienestarDTO consultarPorId(Integer idMetaBienestar);
  RespuestaGenerica registrar(PeticionMetasBienestarDTO peticion);
  RespuestaGenerica modificar(PeticionMetasBienestarDTO peticion);

  @Transactional
  RespuestaGenerica eliminar(Integer idMetaBienestar, String cveUsuario);
}
