package mx.sep.dgtic.mejoredu.cortoplazo.service;

import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.MetasBienestarDTO;
import mx.sep.dgtic.mejoredu.cortoplazo.ProductoDTO;

import java.util.List;

public interface MetasBienestarService {
  List<MetasBienestarDTO> consultarPorAnhio(Integer anhio, String cveUsuario);

  ProductoVO consultarPorId(Integer id);

  List<ProductoVO> consultarPorIdCatalogoIndicadorPI(Integer anhio, String cveUsuario);
}
