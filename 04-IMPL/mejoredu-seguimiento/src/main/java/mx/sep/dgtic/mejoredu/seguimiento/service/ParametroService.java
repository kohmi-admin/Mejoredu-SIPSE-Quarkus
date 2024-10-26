package mx.sep.dgtic.mejoredu.seguimiento.service;

import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ElementoDTO;

import java.util.List;

public interface ParametroService {
  List<ElementoDTO> consultarPorIdProyecto(Integer idProyecto);
}
