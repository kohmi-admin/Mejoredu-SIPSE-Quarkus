package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoCalendarioVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.MetasBienestarDTO;
import mx.sep.dgtic.mejoredu.seguimiento.dao.MasterCatalogoRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.ProductoRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.VtMetasbienestarRepository;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Producto;
import mx.sep.dgtic.mejoredu.seguimiento.entity.VtMetasBienestarEntity;
import mx.sep.dgtic.mejoredu.seguimiento.service.MetasBienestarService;

@Service
public class MetasBienestarServiceImpl implements MetasBienestarService {

	private static final Integer CERO = 0;
	@Inject
	MasterCatalogoRepository catalogoRepo;

	@Inject
	ProductoRepository productoRepository;

	@Inject
	VtMetasbienestarRepository vtMetasbienestarRepository;

	@Override
	public List<MetasBienestarDTO> consultarPorAnhio(Integer anhio, String cveUsuario) {
		Log.info("anhio seleccionado " + anhio);
		Log.info("Usuario logueado " + cveUsuario);

		var metasBienestar = new ArrayList<MetasBienestarDTO>();
		Log.info("anhio " + anhio);
		List<VtMetasBienestarEntity> metas = vtMetasbienestarRepository
				.find("anhio=?1 and cveUsuario=?2", anhio, cveUsuario).list();
		if (ObjectUtils.isEmpty(metas)) {
			throw new BadRequestException(
					"No existen registros en este año  " + anhio + " para el usuario:  " + cveUsuario);
		}
		metas.stream().map(vtMeta -> {
			MetasBienestarDTO meta = new MetasBienestarDTO();
			if (!ObjectUtils.isEmpty(vtMeta.getIdMeta()))
				meta.setIdMeta(vtMeta.getIdMeta());

			meta.setCveMetaParametro(vtMeta.getCveMetaPara());
			meta.setCveObjetivoPrioritario(vtMeta.getCveObjetivo());
			meta.setNombreDelIndicadorPI(vtMeta.getNomIndicador());
			meta.setCveUsuario(vtMeta.getCveUsuario());
			meta.setEntregables(vtMeta.getEntregables());
			meta.setAnhio(vtMeta.getAnhio());
			meta.setPeriodicidad(vtMeta.getPeriodicidad());
			meta.setFuenteVariable1(vtMeta.getFuente());
			meta.setFuenteOtro(vtMeta.getFuenteOtro());
			meta.setTendenciaEsperada(vtMeta.getTendencia());
			meta.setPeriodicidadOtro(Arrays.toString(vtMeta.getPeriodicidadOtro()));
			meta.setTendenciaOtro(Arrays.toString(vtMeta.getTendenciaOtro()));
			meta.setUnidadDeMedida(vtMeta.getUnidadMedida());
			meta.setUnidadDeMedidaOtro(Arrays.toString(vtMeta.getUnidadMedidaOtro()));

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
			productoVO.setIdCategorizacion(producto.getCategorizacion().get().getId());
		if (producto.getTipoProducto().isPresent())
			productoVO.setIdTipoProducto(producto.getTipoProducto().get().getId());
		if (producto.getIndicadorMIR().isPresent())
			productoVO.setIdIndicadorMIR(producto.getIndicadorMIR().get().getId());
		if (producto.getIndicadorPI().isPresent())
			productoVO.setIdIndicadorPI(producto.getIndicadorPI().get().getId());
		if (producto.getNivelEducativo().isPresent())
			productoVO.setIdNivelEducativo(producto.getNivelEducativo().get().getId());
		productoVO.setVinculacionProducto(producto.getCxVinculacionProducto());
		if (producto.getContinuidad().isPresent())
			productoVO.setIdContinuidad(producto.getContinuidad().get().getId());
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

		Log.info("cveUsuario " + cveUsuario);
		Log.info("año " + anhio);
		List<Producto> productos = productoRepository
				.find("anhioPublicacion=?1 and csEstatus NOT IN ('B','I') and usuario.cveUsuario=?2", anhio, cveUsuario)
				.list();
		if (ObjectUtils.isEmpty(productos)) {
			throw new BadRequestException("No existen registros en este año  " + anhio
					+ " para el idCatalogoIndicadorPI:  " + " y el usuario(a): " + cveUsuario);
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
				productoVO.setIdCategorizacion(producto.getCategorizacion().get().getId());
			if (producto.getTipoProducto().isPresent())
				productoVO.setIdTipoProducto(producto.getTipoProducto().get().getId());
			if (producto.getIndicadorMIR().isPresent())
				productoVO.setIdIndicadorMIR(producto.getIndicadorMIR().get().getId());
			if (producto.getIndicadorPI().isPresent())
				productoVO.setIdIndicadorPI(producto.getIndicadorPI().get().getId());
			if (producto.getNivelEducativo().isPresent())
				productoVO.setIdNivelEducativo(producto.getNivelEducativo().get().getId());
			productoVO.setVinculacionProducto(producto.getCxVinculacionProducto());
			if (producto.getContinuidad().isPresent())
				productoVO.setIdContinuidad(producto.getContinuidad().get().getId());
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