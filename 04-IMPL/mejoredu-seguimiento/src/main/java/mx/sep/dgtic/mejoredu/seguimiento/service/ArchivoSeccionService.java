package mx.sep.dgtic.mejoredu.seguimiento.service;

import mx.sep.dgtic.mejoredu.cortoplazo.PeticionRegistroArchivosSeccion;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.util.List;

public interface ArchivoSeccionService {
  List<ArchivoDTO> consultarArchivos(Integer idAnhio);

  void registrar(PeticionRegistroArchivosSeccion peticion);
}
