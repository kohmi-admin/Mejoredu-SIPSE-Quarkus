package mx.sep.dgtic.mejoredu.cortoplazo.service.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionProducto;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoCalendarioVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.*;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.MasterCatalogo;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.Producto;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.ProductoCalendario;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ProductoService;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import io.quarkus.logging.Log;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductoServiceImpl implements ProductoService {
	@Inject
	private ProductoRepository productoRepository;
	@Inject
	private ProductoCalendarioRepository productoCalendarioRepository;
	@Inject
	private ActividadRepository actividadRepository;
	@Inject
	private UsuarioRepository usuarioRepository;
	@Inject
	private MasterCatalogoRepository masterCatalogoRepository;

	@Override
	public List<ProductoVO> consultaPorActividad(int idActividad) {
		var actividad = actividadRepository.findByIdOptional(idActividad)
				.orElseThrow(() -> new RuntimeException("No se encontró la actividad con id " + idActividad));

		var productos = productoRepository.consultarActivosPorIdActividad(actividad.getIdActividad());

    return productos.stream().map(producto -> {
			var vo = new ProductoVO();

			vo.setIdProducto(producto.getIdProducto());
			vo.setCveUsuario(producto.getUsuario().getCveUsuario());
			vo.setIdActividad(producto.getActividad().getIdActividad());
			vo.setCveProducto(producto.getCveProducto());
			vo.setEstatus(producto.getCsEstatus());
			vo.setIdProyecto(producto.getActividad().getProyectoAnual().getIdProyecto());
			vo.setNombre(producto.getCxNombre());
			vo.setDescripcion(producto.getCxDescripcion());
			if (producto.getCategorizacion().isPresent())
				vo.setIdCategorizacion(producto.getCategorizacion().get().getIdCatalogo());
			if (producto.getTipoProducto().isPresent())
				vo.setIdTipoProducto(producto.getTipoProducto().get().getIdCatalogo());
			if (producto.getIndicadorMIR() != null && producto.getIndicadorMIR().isPresent()) {
				vo.setIdIndicadorMIR(producto.getIndicadorMIR().get().getIdCatalogo());
				vo.setIndicadorMIR(producto.getIndicadorMIR().get().getCdOpcion());
			}
			if (producto.getIndicadorPI() != null && producto.getIndicadorPI().isPresent()) {

				vo.setIdIndicadorPI(producto.getIndicadorPI().get().getIdCatalogo());
			}
			if (producto.getNivelEducativo() != null && producto.getNivelEducativo().isPresent())
				vo.setIdNivelEducativo(producto.getNivelEducativo().get().getIdCatalogo());
			vo.setVinculacionProducto(producto.getCxVinculacionProducto());
			if (producto.getContinuidad().isPresent())
				vo.setIdContinuidad(producto.getContinuidad().get().getIdCatalogo());
			vo.setPorPublicar(producto.getCbPorPublicar());

			vo.setIdAnhoPublicacion(producto.getAnhioPublicacion());

			if (producto.getAnhioPublicacion() != null)
				vo.setIdAnhoPublicacion(producto.getAnhioPublicacion());
			vo.setNombrePotic(producto.getCxCvenombrePotic());

			var productosCalendario = producto.getProductoCalendario().stream().map(at -> {
				var vo2 = new ProductoCalendarioVO();

				vo2.setIdProductoCalendario(at.getIdProductoCalendario());
				vo2.setMes(at.getCiMes());
				vo2.setMonto(at.getCiMonto());
				vo2.setIdProducto(producto.getIdProducto());

				return vo2;
			}).collect(Collectors.toList());

			vo.setProductoCalendario(productosCalendario);

			return vo;
		}).collect(Collectors.toList());
	}

	@Override
	public ProductoVO consultarPorId(int idProducto) {
		var producto = productoRepository.findByIdOptional(idProducto)
				.orElseThrow(() -> new RuntimeException("No se encontró el producto con id " + idProducto));
		var vo = new ProductoVO();

		vo.setIdProducto(producto.getIdProducto());
		vo.setCveUsuario(producto.getUsuario().getCveUsuario());
		vo.setIdActividad(producto.getActividad().getIdActividad());
		vo.setIdProyecto(producto.getActividad().getProyectoAnual().getIdProyecto());
		vo.setCveProducto(producto.getCveProducto());
		vo.setNombre(producto.getCxNombre());
		vo.setDescripcion(producto.getCxDescripcion());

		vo.setEstatus(producto.getCsEstatus());
		if (producto.getCategorizacion().isPresent())
			vo.setIdCategorizacion(producto.getCategorizacion().get().getIdCatalogo());

		if (producto.getTipoProducto().isPresent())
			vo.setIdTipoProducto(producto.getTipoProducto().get().getIdCatalogo());

		if (producto.getIndicadorMIR().isPresent()) {
			vo.setIdIndicadorMIR(producto.getIndicadorMIR().get().getIdCatalogo());
			vo.setIndicadorMIR(producto.getIndicadorMIR().get().getCdOpcion());
		}
		if (producto.getNivelEducativo().isPresent())
			vo.setIdNivelEducativo(producto.getNivelEducativo().get().getIdCatalogo());

		vo.setVinculacionProducto(producto.getCxVinculacionProducto());

		if (producto.getContinuidad().isPresent())
			vo.setIdContinuidad(producto.getContinuidad().get().getIdCatalogo());

		vo.setPorPublicar(producto.getCbPorPublicar());
		vo.setIdAnhoPublicacion(producto.getAnhioPublicacion());

		Log.info("producto.getAnhioPublicacion(): " + producto.getAnhioPublicacion());
		if (producto.getAnhioPublicacion() != null)
			vo.setIdAnhoPublicacion(producto.getAnhioPublicacion());
		
		vo.setNombrePotic(producto.getCxCvenombrePotic());
		
		Log.info("producto.getIndicadorPI(): " + producto.getIndicadorPI());
		Log.info("producto.getIndicadorPI().isPresent: " + producto.getIndicadorPI().isPresent());
		Log.info("producto.getIndicadorPI().isEmpty: " + producto.getIndicadorPI().isEmpty());
		if (producto.getIndicadorPI().isPresent())
			vo.setIdIndicadorPI(producto.getIndicadorPI().get().getIdCatalogo());
			
			

		var productosCalendario = producto.getProductoCalendario().stream().map(at -> {
			var vo2 = new ProductoCalendarioVO();

			vo2.setIdProductoCalendario(at.getIdProductoCalendario());
			vo2.setMes(at.getCiMes());
			vo2.setMonto(at.getCiMonto());
			vo2.setIdProducto(producto.getIdProducto());

			return vo2;
		}).collect(Collectors.toList());

		vo.setProductoCalendario(productosCalendario);

		return vo;
	}

	@Override
	@Transactional
	public void registrar(PeticionProducto peticion) {
		var actividad = actividadRepository.findByIdOptional(peticion.getIdActividad()).orElseThrow(
				() -> new BadRequestException("No se encontró la actividad con id " + peticion.getIdActividad()));
		var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
				() -> new BadRequestException("No se encontró el usuario con id " + peticion.getCveUsuario()));

		var categoria = masterCatalogoRepository.findByIdOptional(peticion.getIdCategorizacion());
		var tipo = masterCatalogoRepository.findByIdOptional(peticion.getIdTipo());

		var producto = new Producto();
		Optional<MasterCatalogo> indicadorPI, nivelEducativo, continuidad, indicadorMIR;
		Log.info("getIdIndicadorMIR");
		if (peticion.getIdIndicadorMIR() != null) {
			indicadorMIR = masterCatalogoRepository.findByIdOptional(peticion.getIdIndicadorMIR());
			indicadorMIR.ifPresent(producto::setIndicadorMIR);
		} else {
			producto.setIndicadorMIR(null);
		}
		Log.info("getIdIndicadorPI");
		if (peticion.getIdIndicadorPI() != null) {
			indicadorPI = masterCatalogoRepository.findByIdOptional(peticion.getIdIndicadorPI());
			indicadorPI.ifPresent(producto::setIndicadorPI);
		} else {
			producto.setIndicadorPI(null);
			producto.setIdIndicadorPI(peticion.getIdIndicadorPI());
		}
		Log.info("getIdNivelEducativo");
		if (peticion.getIdNivelEducativo() != null) {
			nivelEducativo = masterCatalogoRepository.findByIdOptional(peticion.getIdNivelEducativo());
			nivelEducativo.ifPresent(producto::setNivelEducativo);
		} else {
			producto.setNivelEducativo(null);
		}
		Log.info("getIdContinuidadOtros");
		if (peticion.getIdContinuidadOtros() != null) {
			continuidad = masterCatalogoRepository.findByIdOptional(peticion.getIdContinuidadOtros());
			continuidad.ifPresent(producto::setContinuidad);
		} else {
			producto.setContinuidad(null);
		}

		/*
		 * if (peticion.getIdContinuidadOtros() != null) { var continuidad =
		 * masterCatalogoRepository.findByIdOptional(peticion.getIdContinuidadOtros())
		 * .orElseThrow(() -> new NotFoundException(
		 * "No se encontró la continuidad con id " + peticion.getIdContinuidadOtros()));
		 * 
		 * producto.setContinuidad(continuidad); }
		 */

		producto.setAnhioPublicacion(peticion.getIdAnhoPublicacion());

		if (!ObjectUtils.isEmpty(peticion.getIdContinuidadOtros())) {
			producto.setAnhioPublicacion(peticion.getIdAnhoPublicacion());
		}
		producto.setUsuario(usuario);
		producto.setActividad(actividad);
		producto.setCveProducto(peticion.getCveProducto());
		producto.setCxNombre(peticion.getNombre());
		producto.setCxDescripcion(peticion.getDescripcion());
		producto.setCsEstatus(peticion.getEstatus());
		categoria.ifPresent(producto::setCategorizacion);
		tipo.ifPresent(producto::setTipoProducto);
		producto.setCxVinculacionProducto(peticion.getVinculacion());
		producto.setCbPorPublicar(peticion.getPorPublicar());

		producto.setCxCvenombrePotic(peticion.getCveNombreProyectoPOTIC());
		producto.setIdIndicadorPI(peticion.getIdIndicadorPI());

		productoRepository.persistAndFlush(producto);
		var productosCalendario = producto.getProductoCalendario();
		peticion.getCalendarizacion().stream().map(it -> {
			var productoCalendario = new ProductoCalendario();

			productoCalendario.setCiMes(it.getMes());
			productoCalendario.setCiMonto(it.getActivo());
			productoCalendario.setIdProducto(producto.getIdProducto());
			productoCalendarioRepository.persist(productoCalendario);

			return productoCalendario;
		}).forEach(productosCalendario::add);
	}

	@Override
	@Transactional
	public void modificar(int idProducto, PeticionProducto peticion) {
		var producto = productoRepository.findByIdOptional(idProducto)
				.orElseThrow(() -> new NotFoundException("No se encontró el producto con id " + idProducto));
		var actividad = actividadRepository.findByIdOptional(peticion.getIdActividad()).orElseThrow(
				() -> new BadRequestException("No se encontró la actividad con id " + peticion.getIdActividad()));
		var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
				() -> new BadRequestException("No se encontró el usuario con id " + peticion.getCveUsuario()));
		var categoria = masterCatalogoRepository.findByIdOptional(peticion.getIdCategorizacion());
		var tipo = masterCatalogoRepository.findByIdOptional(peticion.getIdTipo());

		Optional<MasterCatalogo> indicadorPI, nivelEducativo, continuidad, indicadorMIR;
		Log.info("getIdIndicadorMIR");
		if (peticion.getIdIndicadorMIR() != null) {
			indicadorMIR = masterCatalogoRepository.findByIdOptional(peticion.getIdIndicadorMIR());
			indicadorMIR.ifPresent(producto::setIndicadorMIR);
		} else {
			producto.setIndicadorMIR(null);
		}
		Log.info("getIdIndicadorPI");
		if (peticion.getIdIndicadorPI() != null) {
			indicadorPI = masterCatalogoRepository.findByIdOptional(peticion.getIdIndicadorPI());
			indicadorPI.ifPresent(producto::setIndicadorPI);
		} else {
			producto.setIndicadorPI(null);
			producto.setIdIndicadorPI(peticion.getIdIndicadorPI());
		}
		Log.info("getIdNivelEducativo");
		if (peticion.getIdNivelEducativo() != null) {
			nivelEducativo = masterCatalogoRepository.findByIdOptional(peticion.getIdNivelEducativo());
			nivelEducativo.ifPresent(producto::setNivelEducativo);
		} else {
			producto.setNivelEducativo(null);
		}
		Log.info("getIdContinuidadOtros");
		if (peticion.getIdContinuidadOtros() != null) {
			continuidad = masterCatalogoRepository.findByIdOptional(peticion.getIdContinuidadOtros());
			continuidad.ifPresent(producto::setContinuidad);
		} else {
			producto.setContinuidad(null);
		}

		producto.setUsuario(usuario);
		producto.setActividad(actividad);
		producto.setCveProducto(peticion.getCveProducto());
		producto.setCxNombre(peticion.getNombre());
		producto.setCxDescripcion(peticion.getDescripcion());
		producto.setCsEstatus(peticion.getEstatus());
		categoria.ifPresent(producto::setCategorizacion);
		tipo.ifPresent(producto::setTipoProducto);

		producto.setCxVinculacionProducto(peticion.getVinculacion());

		producto.setCbPorPublicar(peticion.getPorPublicar());
		peticion.setIdAnhoPublicacion(peticion.getIdAnhoPublicacion());

		if (!ObjectUtils.isEmpty(peticion.getIdAnhoPublicacion()))
			producto.setAnhioPublicacion(peticion.getIdAnhoPublicacion());
		producto.setCxCvenombrePotic(peticion.getCveNombreProyectoPOTIC());
		productoRepository.persistAndFlush(producto);

		productoCalendarioRepository.delete("idProducto", producto.getIdProducto());
		var productosCalendario = producto.getProductoCalendario();
		peticion.getCalendarizacion().stream().map(it -> {
			var productoCalendario = new ProductoCalendario();

			productoCalendario.setCiMes(it.getMes());
			productoCalendario.setCiMonto(it.getActivo());
			productoCalendario.setIdProducto(producto.getIdProducto());
			productoCalendarioRepository.persist(productoCalendario);

			return productoCalendario;
		}).forEach(productosCalendario::add);
	}

	@Override
	@Transactional
	public void eliminar(int idProducto) {
		var producto = productoRepository.findByIdOptional(idProducto)
				.orElseThrow(() -> new NotFoundException("No se encontró el producto con id " + idProducto));

		producto.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
		productoRepository.persistAndFlush(producto);
	}
}