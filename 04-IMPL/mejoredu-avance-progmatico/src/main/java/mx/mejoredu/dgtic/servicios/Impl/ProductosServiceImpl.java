package mx.mejoredu.dgtic.servicios.Impl;

import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.seguimiento.ProductoEvidenciaVO;
import mx.mejoredu.dgtic.dao.CortoplazoActividadRepository;
import mx.mejoredu.dgtic.dao.ProductoRepository;
import mx.mejoredu.dgtic.entity.Producto;
import mx.mejoredu.dgtic.entity.ProductoCalendario;
import mx.mejoredu.dgtic.servicios.ProductosService;
import org.springframework.stereotype.Service;

import io.quarkus.logging.Log;

import java.util.List;
import java.util.Objects;

@Service
public class ProductosServiceImpl implements ProductosService {
  @Inject
  private ProductoRepository productoRepository;
  @Inject
  private CortoplazoActividadRepository cortoplazoActividadRepository;

  @Override
  public List<ProductoEvidenciaVO> consultaProductos(int idActividad, Integer trimestre) {
    cortoplazoActividadRepository.findByIdOptional(idActividad).orElseThrow(
        () -> new NotFoundException("La actividad con el id " + idActividad + " no está registrada")
    );
    var productos = productoRepository.findProductos(idActividad, trimestre)
        .stream().filter(p -> {
          var entregables = p.getProductoCalendario();
          if (entregables.isEmpty()) {
            return false;
          }

          var entregablesProgramados = entregables.stream().filter(e -> {
            if (trimestre == null || trimestre == 0) {
              return true;
            }

            if (Math.ceil(e.getCiMes() / 3f) != trimestre) {
              return false;
            }
            return e.getCiMonto() != null && e.getCiMonto() != 0;
          }).toList();

          return !entregablesProgramados.isEmpty();
        }).toList();

    return productos.stream().map(it -> entitiesToVo(it, trimestre)).toList();
  }

  private ProductoEvidenciaVO entitiesToVo(Producto producto, Integer trimestre) {
    var productoVo = new ProductoEvidenciaVO();

    productoVo.setIdProducto(producto.getIdProducto());
    productoVo.setCveProducto(producto.getCveProducto());
    productoVo.setCxNombre(producto.getCxNombre());
    productoVo.setCxDescripcion(producto.getCxDescripcion());
    productoVo.setCsEstatus(producto.getCsEstatus());
    if (producto.getIndicadorMIR().isPresent()) {
      productoVo.setIdIndicadorMIR(producto.getIndicadorMIR().get().getId());
      productoVo.setIndicadorMIR(producto.getIndicadorMIR().get().getCdOpcion());
    }
    if (producto.getDfProducto() != null)
      productoVo.setDfProducto(producto.getDfProducto().toString());
    if (producto.getDhProducto() != null)
      productoVo.setDhProducto(producto.getDhProducto().toString());
    productoVo.setIdActividad(producto.getActividad().getIdActividad());
    if (producto.getCategorizacion().isPresent()) {
      productoVo.setIdCategorizacion(producto.getCategorizacion().get().getId());
      productoVo.setCategorizacion(producto.getCategorizacion().get().getCdOpcion());
    }
    if (producto.getTipoProducto().isPresent()) {
      productoVo.setIdTipoProducto(producto.getTipoProducto().get().getId());
      productoVo.setTipoProducto(producto.getTipoProducto().get().getCdOpcion());
    }

    if (trimestre == null || trimestre == 0) {
      productoVo.setIdEvidenciaTrimestral(null);
    } else {
      producto.getProductoCalendario().stream()
          .filter(it -> Objects.equals(it.getCiMes(), (trimestre * 3) - 1))
          .findFirst()
          .ifPresent(it -> productoVo.setIdEvidenciaTrimestral(it.getAvances().stream()
              .filter(ix -> ix.getEvidenciaTrimestral() != null)
              .findFirst()
              .map(ix -> ix.getEvidenciaTrimestral().getIdEvidenciaTrimestral())
              .orElse(null)
          ));
    }
    /*
     * Verificar estatus de evidencia mensual del 
		4 10-12
		3 7-9
		2 4-6
		1 1-3
     */
    @SuppressWarnings("unused")
	Integer compareTotalProductos =
    producto.getProductoCalendario().stream()
    .filter(it -> ((it.getCiMes() >= (trimestre * 3) - 2) && (it.getCiMes() <= (trimestre * 3)))).toList().stream()
    .filter(prodAvan -> (!prodAvan.getAvances().isEmpty())).toList().stream()
    .filter(ix -> ix.getAvances()!= null).toList().size()
    ;
    Log.info(producto.getProductoCalendario().stream().filter(it->(it.getCiMes() >= (trimestre * 3) - 2)&&it.getCiMes() <= (trimestre * 3)).toList().size());
    productoVo.setCsEstatusMensual(compareTotalProductos!=null?(producto.getProductoCalendario().stream().filter(it->(it.getCiMes() >= (trimestre * 3) - 2)&&it.getCiMes() <= (trimestre * 3)).toList().size()==compareTotalProductos?"C":"I"):"I");

    return productoVo;
  }
}
