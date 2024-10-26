package mx.sep.dgtic.mejoredu.seguimiento.service;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.MetasBienestarDTO;

public interface MetasBienestarService {
  List<MetasBienestarDTO> consultarPorAnhio(Integer anhio, String cveUsuario);

  ProductoVO consultarPorId(Integer id);

  List<ProductoVO> consultarPorIdCatalogoIndicadorPI(Integer anhio, String cveUsuario);
}
