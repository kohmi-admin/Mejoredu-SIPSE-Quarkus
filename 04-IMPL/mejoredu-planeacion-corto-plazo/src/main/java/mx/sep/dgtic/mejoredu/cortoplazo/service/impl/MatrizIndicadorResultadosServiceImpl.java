package mx.sep.dgtic.mejoredu.cortoplazo.service.impl;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoUsuarioEnum;
import mx.edu.sep.dgtic.mejoredu.presupuestales.mir.IndicadorResultadoCortoPlazo;
import mx.sep.dgtic.mejoredu.cortoplazo.ProductoMirVO;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.*;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.IndicadorMir;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.VtIndicadorMirV2Projection;
import mx.sep.dgtic.mejoredu.cortoplazo.service.MatrizIndicadorResultadosService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class MatrizIndicadorResultadosServiceImpl implements MatrizIndicadorResultadosService {
  @Inject
  private ProductoMirRepository productoMirRepository;
  @Inject
  private ProductoCalendarioRepository productoCalendarioRepository;
  @Inject
  private IndicadorMirRepository indicadorMirRepository;
  @Inject
  private VtIndicadorMirV2Repository vtIndicadorMirV2Repository;
  @Inject
  private PerfilLaboralRepository perfilLaboralRepository;
  @Inject
  private UsuarioRepository usuarioRepository;

  @Override
  public List<IndicadorResultadoCortoPlazo> consultaTablaMirPorAnhio(int idAnhio, String cveUsuario) {
    var usuario = usuarioRepository.findByIdOptional(cveUsuario)
        .orElseThrow(() -> new BadRequestException("No se encontró el usuario con la clave " + cveUsuario));
    var perfilLaboral = perfilLaboralRepository.findByCveUsuario(cveUsuario).orElseThrow(() -> new NotFoundException("No se encontró el perfil laboral del usuario"));
    var idCatalogoUnidad = perfilLaboral.getIdCatalogoUnidad();

    var indicadores = (usuario.hasReadPermission())
        ? vtIndicadorMirV2Repository.findByIdAnhio(idAnhio)
        : vtIndicadorMirV2Repository.findByIdAnhioAndIdCatalogoUnidad(idAnhio, idCatalogoUnidad);

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

      switch (indicador.getMes()) {
        case 1:
        case 2:
        case 3:
          indicadorVO.setPrimerTrimestre(indicadorVO.getPrimerTrimestre() + indicador.getEntregables());
          break;
        case 4:
        case 5:
        case 6:
          indicadorVO.setSegundoTrimestre(indicadorVO.getSegundoTrimestre() + indicador.getEntregables());
          break;
        case 7:
        case 8:
        case 9:
          indicadorVO.setTercerTrimestre(indicadorVO.getTercerTrimestre() + indicador.getEntregables());
          break;
        case 10:
        case 11:
        case 12:
          indicadorVO.setCuartoTrimestre(indicadorVO.getCuartoTrimestre() + indicador.getEntregables());
          break;
      }
      // Meta programada es la suma de los montos de todos los trimestres
      indicadorVO.setMetaProgramada(indicadorVO.getPrimerTrimestre() + indicadorVO.getSegundoTrimestre() + indicadorVO.getTercerTrimestre() + indicadorVO.getCuartoTrimestre());
    });

    return indicadoresVO.values().stream().toList();
  }

  @Override
  public List<ProductoMirVO> consultarProductosPorAnhio(int idAnhio, String cveUsuario) {
    var usuario = usuarioRepository.findByIdOptional(cveUsuario)
        .orElseThrow(() -> new BadRequestException("No se encontró el usuario con la clave " + cveUsuario));
    var perfilLaboral = perfilLaboralRepository.findByCveUsuario(cveUsuario).orElseThrow(() -> new NotFoundException("No se encontró el perfil laboral del usuario"));
    var idCatalogo = perfilLaboral.getIdCatalogoUnidad();

    var productos = usuario.hasReadPermission()
        ? productoMirRepository.findByIdAnhio(idAnhio)
        : productoMirRepository.findByIdAnhioAndIdCatalogoUnidad(idAnhio, idCatalogo);

    var tabla = new ArrayList<ProductoMirVO>();
    productos.forEach(productoMir -> {
      var producto = new ProductoMirVO();
      producto.setIdProducto(productoMir.getIdProducto());
      producto.setNombreProducto(productoMir.getCxNombre());
      producto.setNivel(productoMir.getCcExterna());

      /*
       * La clave se compone de:
       * - Dos dígitos para el año
       * - Primer dígito para la unidad
       * - La clave del proyecto
       * - La clave de la actividad
       * - La clave del producto
       * - La clave de la categorización
       * - La clave del tipo de producto
       *
       * Ejemplo:
       * {anhio}{unidad}{cveProyecto}-{cveActividad}-{cveProducto}-{categorizacion}-{tipoProducto}
       *
       * Sí la cveProducto es null, se reemplaza por "0"
       * La clave de actividad debe tener un left pad de 2 ceros
       * La clave de producto debe tener un left pad de 2 ceros
       */

      String cveProducto = productoMir.getCveProducto() == null ? "00" : padLeftZeros(productoMir.getCveProducto(), 2);
      String cveActividad = padLeftZeros(productoMir.getCveActividad(), 2);
      // Tomar los últimos dos digitos del año
      String cveAnhio = String.valueOf(productoMir.getIdAnhio()).substring(2);
      // Tomar el primer dígito de la clave unidad
      String cveUnidad = productoMir.getCveUnidad().substring(0, 1);

      var clave =
          cveAnhio +
          cveUnidad +
          productoMir.getCveProyecto() +
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

  private static IndicadorResultadoCortoPlazo getDefaultIndicadorVO(VtIndicadorMirV2Projection indicador) {
    var defaultIndicadorVO = new IndicadorResultadoCortoPlazo();
    defaultIndicadorVO.setIdIndicadorMP(indicador.getIdIndicador());
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
