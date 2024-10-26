package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.presupuestales.mir.IndicadorResultadoCortoPlazo;
import mx.sep.dgtic.mejoredu.cortoplazo.ProductoMirVO;
import mx.sep.dgtic.mejoredu.seguimiento.dao.*;
import mx.sep.dgtic.mejoredu.seguimiento.entity.IndicadorMir;
import mx.sep.dgtic.mejoredu.seguimiento.service.MatrizIndicadorResultadosService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class MatrizIndicadorResultadosServiceImpl implements MatrizIndicadorResultadosService {
  @Inject
  private ProductoMirRepository productoMirRepository;
  @Inject
  private IndicadorMirRepository indicadorMirRepository;
  @Inject
  private PerfilLaboralRepository perfilLaboralRepository;
  @Override
  public List<IndicadorResultadoCortoPlazo> consultaTablaMirPorAnhio(int idAnhio, String cveUsuario) {
    var perfilLaboral = perfilLaboralRepository.findByCveUsuario(cveUsuario).orElseThrow(() -> new NotFoundException("No se encontró el perfil laboral del usuario"));
    var idCatalogoUnidad = perfilLaboral.getIdCatalogoUnidad();

    var indicadores = indicadorMirRepository.findByIdAnhioAndIdCatalogoUnidad(idAnhio, idCatalogoUnidad);

    var indicadoresVO = new HashMap<Integer, IndicadorResultadoCortoPlazo>();

    indicadores.forEach(indicador -> {
      var defaultIndicadorVO = getDefaultIndicadorVO(indicador);

      // Si el indicador no existe en el mapa, se agrega
      indicadoresVO.putIfAbsent(indicador.getIdCatalogoIndicador(), defaultIndicadorVO);
      IndicadorResultadoCortoPlazo indicadorVO = indicadoresVO.get(indicador.getIdCatalogoIndicador());

      /*
       *  Producto 1:M ProductoCalendario
       *
       *  ProductoCalendario:
       *    mes
       *    monto
       *
       *  1,2,3 -> Primer trimestre
       *  sumar los montos
       */

      assert indicadorVO != null;

      var productosCalendarioList = indicador.getProductoCalendario();
      if (productosCalendarioList == null) {
        Log.info("No se encontró el producto calendario con idProducto: " + indicador.getIdProducto());
        return;
      }

      productosCalendarioList.forEach(productoCalendario -> {
        switch (productoCalendario.getCiMes()) {
          case 1:
          case 2:
          case 3:
            indicadorVO.setPrimerTrimestre(indicadorVO.getPrimerTrimestre() + productoCalendario.getCiMonto());
            break;
          case 4:
          case 5:
          case 6:
            indicadorVO.setSegundoTrimestre(indicadorVO.getSegundoTrimestre() + productoCalendario.getCiMonto());
            break;
          case 7:
          case 8:
          case 9:
            indicadorVO.setTercerTrimestre(indicadorVO.getTercerTrimestre() + productoCalendario.getCiMonto());
            break;
          case 10:
          case 11:
          case 12:
            indicadorVO.setCuartoTrimestre(indicadorVO.getCuartoTrimestre() + productoCalendario.getCiMonto());
            break;
        }
      });

      // Meta programada es la suma de los montos de todos los trimestres
      indicadorVO.setMetaProgramada(indicadorVO.getPrimerTrimestre() + indicadorVO.getSegundoTrimestre() + indicadorVO.getTercerTrimestre() + indicadorVO.getCuartoTrimestre());

    });

    return indicadoresVO.values().stream().toList();
  }

  @Override
  public List<ProductoMirVO> consultarProductosPorAnhio(int idAnhio, String cveUsuario) {
    var perfilLaboral = perfilLaboralRepository.findByCveUsuario(cveUsuario).orElseThrow(() -> new NotFoundException("No se encontró el perfil laboral del usuario"));
    var idCatalogo = perfilLaboral.getIdCatalogoUnidad();

    var productos = productoMirRepository.findByIdAnhioAndIdCatalogoUnidad(idAnhio, idCatalogo);
    var tabla = new ArrayList<ProductoMirVO>();
    productos.forEach(productoMir -> {
      var producto = new ProductoMirVO();
      producto.setIdProducto(productoMir.getIdProducto());
      producto.setNombreProducto(productoMir.getCxNombre());
      producto.setNivel(productoMir.getCcExterna());

      /*
       * La clave se compone de:
       * - La clave del proyecto
       * - La clave de la actividad
       * - La clave del producto
       * - La clave de la categorización
       * - La clave del tipo de producto
       *
       * Ejemplo:
       * {cveProyecto}-{cveActividad}-{cveProducto}-{categorizacion}-{tipoProducto}
       *
       * Sí la cveProducto es null, se reemplaza por "0"
       * La clave de actividad debe tener un left pad de 2 ceros
       * La clave de producto debe tener un left pad de 4 ceros
       */

      String cveProducto = productoMir.getCveProducto() == null ? "0000" : padLeftZeros(productoMir.getCveProducto(), 4);
      String cveActividad = padLeftZeros(productoMir.getCveActividad(), 2);

      var clave = productoMir.getCveProyecto() +
              "-" +
              cveActividad +
              "-" +
              cveProducto +
              "-" +
              productoMir.getCategorizacion() +
              "-" +
              productoMir.getTipoProducto();

      producto.setClave(clave);
      tabla.add(producto);
    });
    return tabla;
  }

  private static IndicadorResultadoCortoPlazo getDefaultIndicadorVO(IndicadorMir indicador) {
    var defaultIndicadorVO = new IndicadorResultadoCortoPlazo();
    defaultIndicadorVO.setIdIndicador(indicador.getIdCatalogoIndicador());
    defaultIndicadorVO.setTipo(indicador.getCcExternaDos());
    defaultIndicadorVO.setNivel(indicador.getCcExterna());
    defaultIndicadorVO.setNombreIndicador(indicador.getCdOpcion());
    defaultIndicadorVO.setMetaProgramada(0);
    defaultIndicadorVO.setPrimerTrimestre(0);
    defaultIndicadorVO.setSegundoTrimestre(0);
    defaultIndicadorVO.setTercerTrimestre(0);
    defaultIndicadorVO.setCuartoTrimestre(0);
    return defaultIndicadorVO;
  }

  private static String padLeftZeros(String inputString, int length) {
    if (inputString.length() >= length) {
      return inputString;
    }
    StringBuilder sb = new StringBuilder();
    while (sb.length() < length - inputString.length()) {
      sb.append('0');
    }
    sb.append(inputString);
    return sb.toString();
  }
}
