package mx.mejoredu.dgtic.servicios;

import mx.sep.dgtic.mejoredu.seguimiento.ActividadEstatusProgramaticoVO;
import mx.sep.dgtic.mejoredu.seguimiento.DetallesProductoEstatusProgramaticoVO;
import mx.sep.dgtic.mejoredu.seguimiento.ProductosEstatusProgramaticoVO;
import mx.sep.dgtic.mejoredu.seguimiento.SeguimientoEstatusProgramaticoVO;

import java.util.List;

/**
 * @author Emmanuel Estrada Gonzalez (emmanuel.estrada)
 * @version 1.0
 */
public interface EstatusProgmaticoService {
  List<SeguimientoEstatusProgramaticoVO> consultaEstatus(
      Integer anhio,
      Integer trimestre,
      Integer idUnidad,
      Integer idProyecto,
      Integer idActividad,
      Integer tipoAdecuacion
  );
  List<ActividadEstatusProgramaticoVO> consultarActividades(Integer idProyecto, Integer trimestre);
  List<ProductosEstatusProgramaticoVO> consultarProductos(Integer idActividad, Integer trimestre);
  DetallesProductoEstatusProgramaticoVO consultarDetallesProducto(Integer idProducto);
}
