package mx.mejoredu.dgtic.servicios;

import mx.sep.dgtic.mejoredu.cortoplazo.PeticionRegistroArchivosSeccion;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.util.List;

public interface ArchivoSeccionService {
  List<ArchivoDTO> consultarArchivos(Integer idAnhio);

  void registrar(PeticionRegistroArchivosSeccion peticion);
}
