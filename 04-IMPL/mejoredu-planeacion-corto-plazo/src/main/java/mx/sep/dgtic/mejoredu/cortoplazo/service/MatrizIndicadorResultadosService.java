package mx.sep.dgtic.mejoredu.cortoplazo.service;

import mx.edu.sep.dgtic.mejoredu.presupuestales.mir.IndicadorResultadoCortoPlazo;
import mx.sep.dgtic.mejoredu.cortoplazo.ProductoMirVO;

import java.util.List;

public interface MatrizIndicadorResultadosService {
  List<IndicadorResultadoCortoPlazo> consultaTablaMirPorAnhio(int idAnhio, String cveUsuario);
  List<ProductoMirVO> consultarProductosPorAnhio(int idAnhio, String cveUsuario);
}
