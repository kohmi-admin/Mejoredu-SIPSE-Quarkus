package mx.sep.dgtic.mejoredu.cortoplazo.service;

import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.mejoredu.cortoplazo.PeticionRegistroArchivosSeccion;

import java.util.List;

public interface ArchivoSeccionService {
  List<ArchivoDTO> consultarArchivos(Integer idAnhio, Integer subseccion);

  void registrar(PeticionRegistroArchivosSeccion peticion);
}
