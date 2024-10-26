package mx.sep.dgtic.mejoredu.cortoplazo.service.impl;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;

import jakarta.ws.rs.BadRequestException;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoUsuarioEnum;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoCalendarioVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.MetasBienestarDTO;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.*;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.Producto;
import mx.sep.dgtic.mejoredu.cortoplazo.service.MetasBienestarService;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MetasBienestarServiceImpl implements MetasBienestarService {

  private static final Integer CERO = 0;
  @Inject
  private UsuarioRepository usuarioRepository;

  @Inject
  MasterCatalogoRepository catalogoRepo;

  @Inject
  ProductoRepository productoRepository;

  @Inject
  VtMetasbienestarRepository vtMetasbienestarRepository;

  @Inject
  VtMetasBienestarV2Repository vtMetasBienestarV2Repository;

  @Inject
  private PerfilLaboralRepository perfilLaboralRepository;

  @Override
  public List<MetasBienestarDTO> consultarPorAnhio(Integer anhio, String cveUsuario) {
    Log.info("anhio seleccionado " + anhio);
    Log.info("Usuario logueado " + cveUsuario);

    var metasBienestar = new ArrayList<MetasBienestarDTO>();
    Log.info("anhio " + anhio);

    var usuario = usuarioRepository.findByIdOptional(cveUsuario)
        .orElseThrow(() -> new BadRequestException("No se encontró el usuario con la clave " + cveUsuario));
    var perfil = perfilLaboralRepository.findByCveUsuario(cveUsuario)
        .orElseThrow(() -> new BadRequestException("No existe perfil laboral para el usuario: " + cveUsuario));

    var metas = usuario.hasReadPermission()
        ? vtMetasBienestarV2Repository.findByAnhio(anhio)
        : vtMetasBienestarV2Repository.findByAnhioAndIdUnidad(anhio, perfil.getIdCatalogoUnidad());
    if (ObjectUtils.isEmpty(metas)) {
      throw new BadRequestException("No existen registros en este año  " +
          anhio + " para el usuario:  " + cveUsuario);
    }
    metas.stream().map(vtMeta -> {
      MetasBienestarDTO meta = new MetasBienestarDTO();
      if (!ObjectUtils.isEmpty(vtMeta.getIdElemento()))
        meta.setIdMeta(vtMeta.getIdElemento());

      meta.setCveMetaParametro(".");
      meta.setCveObjetivoPrioritario(vtMeta.getCveObjetivo());
      meta.setNombreDelIndicadorPI(vtMeta.getIndicador());
      // meta.setCveUsuario(vtMeta.getCveUsuario());
      meta.setEntregables(vtMeta.getEntregables());
      // meta.setAnhio(vtMeta.getAnhio());
      meta.setPeriodicidad(vtMeta.getPeriodicidad());
      // meta.setFuenteVariable1(vtMeta.getFuente());
      // meta.setFuenteOtro(vtMeta.getFuenteOtro());
      meta.setTendenciaEsperada(vtMeta.getTendencia());
      meta.setPeriodicidadOtro(vtMeta.getPeriodicidadOtro());
      // meta.setTendenciaOtro(vtMeta.getTendenciaOtro());
      meta.setUnidadDeMedida(vtMeta.getUnidadMedida());
      meta.setUnidadDeMedidaOtro(vtMeta.getUnidadMedidaOtro());

      return meta;
    }).forEach(metasBienestar::add);

    return metasBienestar;
  }

  @Override
  public ProductoVO consultarPorId(Integer id) {
    Log.info("id seleccionado " + id);
    var producto = productoRepository.findByIdOptional(id)
        .orElseThrow(() -> new RuntimeException("No existe registro de producto con id " + id));
    var productoVO = new ProductoVO();

    productoVO.setIdProducto(producto.getIdProducto());
    productoVO.setCveUsuario(producto.getUsuario().getCveUsuario());
    productoVO.setIdActividad(producto.getActividad().getIdActividad());
    productoVO.setIdProyecto(producto.getActividad().getProyectoAnual().getIdProyecto());
    productoVO.setCveProducto(producto.getCveProducto());
    productoVO.setNombre(producto.getCxNombre());
    productoVO.setDescripcion(producto.getCxDescripcion());

    productoVO.setEstatus(producto.getCsEstatus());
    if (producto.getCategorizacion().isPresent())
      productoVO.setIdCategorizacion(producto.getCategorizacion().get().getIdCatalogo());
    if (producto.getTipoProducto().isPresent())
      productoVO.setIdTipoProducto(producto.getTipoProducto().get().getIdCatalogo());
    if (producto.getIndicadorMIR().isPresent())
      productoVO.setIdIndicadorMIR(producto.getIndicadorMIR().get().getIdCatalogo());
    if (producto.getIndicadorPI().isPresent())
      productoVO.setIdIndicadorPI(producto.getIndicadorPI().get().getIdCatalogo());
    if (producto.getNivelEducativo().isPresent())
      productoVO.setIdNivelEducativo(producto.getNivelEducativo().get().getIdCatalogo());
    productoVO.setVinculacionProducto(producto.getCxVinculacionProducto());
    if (producto.getContinuidad().isPresent())
      productoVO.setIdContinuidad(producto.getContinuidad().get().getIdCatalogo());
    productoVO.setPorPublicar(producto.getCbPorPublicar());
    productoVO.setIdAnhoPublicacion(producto.getAnhioPublicacion());

    if (producto.getAnhioPublicacion() != null)
      productoVO.setIdAnhoPublicacion(producto.getAnhioPublicacion());
    productoVO.setNombrePotic(producto.getCxCvenombrePotic());

    var productosCalendario = producto.getProductoCalendario().stream().map(at -> {
      var vo2 = new ProductoCalendarioVO();

      vo2.setIdProductoCalendario(at.getIdProductoCalendario());
      vo2.setMes(at.getCiMes());
      vo2.setMonto(at.getCiMonto());
      vo2.setIdProducto(producto.getIdProducto());

      return vo2;
    }).collect(Collectors.toList());

    productoVO.setProductoCalendario(productosCalendario);

    return productoVO;
  }

  @Override
  public List<ProductoVO> consultarPorIdCatalogoIndicadorPI(Integer anhio, String cveUsuario) {
    var productosVO = new ArrayList<ProductoVO>();

    var usuario = usuarioRepository.findByIdOptional(cveUsuario)
        .orElseThrow(() -> new BadRequestException("No se encontró el usuario con la clave " + cveUsuario));
    var perfil = perfilLaboralRepository.findByCveUsuario(cveUsuario)
        .orElseThrow(() -> new BadRequestException("No existe perfil laboral para el usuario: " + cveUsuario));

    List<Producto> productos = usuario.hasReadPermission()
    ? productoRepository.find("""
        SELECT p FROM Producto p
        JOIN p.actividad a
        JOIN a.proyectoAnual pa
        JOIN pa.anhoPlaneacion ap
        JOIN PerfilLaboral pl ON pa.usuario.cveUsuario = pl.usuario.cveUsuario
        LEFT JOIN AdecuacionProducto adecuacionProducto
            ON p.idProducto = adecuacionProducto.idProductoModificacion
        WHERE
          adecuacionProducto.idAdecuacionProducto IS NULL
          AND ap.idAnhio = ?1
          AND ap.csEstatus NOT IN ('B','I')
          AND a.csEstatus NOT IN ('B','I')
        	AND p.csEstatus NOT IN ('B','I')
        	AND p.idIndicadorPI IS NOT NULL
        """, anhio).list()
    : productoRepository.find("""
        SELECT p FROM Producto p
        JOIN p.actividad a
        JOIN a.proyectoAnual pa
        JOIN pa.anhoPlaneacion ap
        JOIN PerfilLaboral pl ON pa.usuario.cveUsuario = pl.usuario.cveUsuario
        
        LEFT JOIN AdecuacionProducto adecuacionProducto
            ON p.idProducto = adecuacionProducto.idProductoModificacion
        WHERE
          adecuacionProducto.idAdecuacionProducto IS NULL
          AND ap.idAnhio = ?1
          AND ap.csEstatus NOT IN ('B','I')
          AND a.csEstatus NOT IN ('B','I')
        	AND p.csEstatus NOT IN ('B','I')
        	AND pl.idCatalogoUnidad = ?2
        	AND p.idIndicadorPI IS NOT NULL
        """, anhio, perfil.getIdCatalogoUnidad()).list();
    if (ObjectUtils.isEmpty(productos)) {
      throw new BadRequestException("No existen registros en este año  " +
          anhio + " para el idCatalogoIndicadorPI:  " + " y el usuario(a): " + cveUsuario);
    }
    productos.stream().map(producto -> {
      ProductoVO productoVO = new ProductoVO();
      productoVO.setIdProducto(producto.getIdProducto());
      productoVO.setCveUsuario(producto.getUsuario().getCveUsuario());
      productoVO.setIdActividad(producto.getActividad().getIdActividad());
      productoVO.setIdProyecto(producto.getActividad().getProyectoAnual().getIdProyecto());
      productoVO.setCveProducto(producto.getCveProducto());
      productoVO.setNombre(producto.getCxNombre());
      productoVO.setDescripcion(producto.getCxDescripcion());

      productoVO.setEstatus(producto.getCsEstatus());
      if (producto.getCategorizacion().isPresent())
        productoVO.setIdCategorizacion(producto.getCategorizacion().get().getIdCatalogo());
      if (producto.getTipoProducto().isPresent())
        productoVO.setIdTipoProducto(producto.getTipoProducto().get().getIdCatalogo());
      if (producto.getIndicadorMIR().isPresent())
        productoVO.setIdIndicadorMIR(producto.getIndicadorMIR().get().getIdCatalogo());
      if (producto.getIndicadorPI().isPresent())
        productoVO.setIdIndicadorPI(producto.getIndicadorPI().get().getIdCatalogo());
      if (producto.getNivelEducativo().isPresent())
        productoVO.setIdNivelEducativo(producto.getNivelEducativo().get().getIdCatalogo());
      productoVO.setVinculacionProducto(producto.getCxVinculacionProducto());
      if (producto.getContinuidad().isPresent())
        productoVO.setIdContinuidad(producto.getContinuidad().get().getIdCatalogo());
      productoVO.setPorPublicar(producto.getCbPorPublicar());
      productoVO.setIdAnhoPublicacion(producto.getAnhioPublicacion());

      if (producto.getAnhioPublicacion() != null)
        productoVO.setIdAnhoPublicacion(producto.getAnhioPublicacion());
      productoVO.setNombrePotic(producto.getCxCvenombrePotic());

      var productosCalendario = producto.getProductoCalendario().stream().map(at -> {
        var vo2 = new ProductoCalendarioVO();

        vo2.setIdProductoCalendario(at.getIdProductoCalendario());
        vo2.setMes(at.getCiMes());
        vo2.setMonto(at.getCiMonto());
        vo2.setIdProducto(producto.getIdProducto());

        return vo2;
      }).collect(Collectors.toList());

      productoVO.setProductoCalendario(productosCalendario);

      return productoVO;
    }).forEach(productosVO::add);


    return productosVO;
  }

}