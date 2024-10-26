package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.dao.entity.JustificacionIndicador;
import mx.edu.sep.dgtic.mejoredu.dao.repository.JustificacionIndicadorRepository;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoCalendarioVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionProductoVO;
import mx.sep.dgtic.mejoredu.seguimiento.dao.*;
import mx.sep.dgtic.mejoredu.seguimiento.entity.*;
import mx.sep.dgtic.mejoredu.seguimiento.producto.PeticionCancelacionProductoVO;
import mx.sep.dgtic.mejoredu.seguimiento.producto.RespuestaAdecuacionProductoVO;
import mx.sep.dgtic.mejoredu.seguimiento.producto.RespuestaRegistroProductoVO;
import mx.sep.dgtic.mejoredu.seguimiento.service.ProductoService;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductoServiceImpl implements ProductoService {
	@Inject
	private ProyectoAnualRepository proyectoRepository;
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
	@Inject
	private AdecuacionProductoRepository adecuacionProductoRepository;
	@Inject
	private SecuenciaProductoRepository secuenciaProductoRepository;
	@Inject
	private AvanceRepository avanceRepository;
	@Inject
	private JustificacionIndicadorRepository justificacionIndicadorRepository;
	@Inject
	private JustificacionProductoRepository justificacionProductoRepository;

	@Inject
	private SecuenciaProductoXProyectoRepo secuenciaProductoXProyectoRepo;

	@Transactional
	public List<RespuestaAdecuacionProductoVO> consultaProductoModificacion(int idAdecuacionSolicitud) {
		var adecuacionProducto = adecuacionProductoRepository.list("""
				SELECT ap FROM AdecuacionProducto ap
				JOIN FETCH ap.productoModificacion
				WHERE ap.idAdecuacionSolicitud = ?1
				AND ap.idProductoModificacion IS NOT NULL
				AND ap.idProductoReferencia IS NOT NULL
				""", idAdecuacionSolicitud);

		return adecuacionProducto.stream().map(it -> {
			var vo = new RespuestaAdecuacionProductoVO();

			vo.setIdProductoModificacion(it.getIdProductoModificacion());
			vo.setProductoModificacion(entitieToVO(it.getProductoModificacion()));
			if (it.getProductoReferencia() != null) {
				vo.setIdProductoReferencia(it.getIdProductoReferencia());
				vo.setProductoReferencia(entitieToVO(it.getProductoReferencia()));
			}

			return vo;
		}).toList();
	}

	@Transactional
	@Override
	public List<RespuestaAdecuacionProductoVO> consultaProducto(int idAdecuacionSolicitud) {
		var adecuacionProducto = adecuacionProductoRepository.list("""
				SELECT ap FROM AdecuacionProducto ap
				JOIN FETCH ap.productoModificacion
				WHERE ap.idAdecuacionSolicitud = ?1
				""", idAdecuacionSolicitud);

		return adecuacionProducto.stream().map(it -> {
			var vo = new RespuestaAdecuacionProductoVO();

			vo.setIdProductoModificacion(it.getIdProductoModificacion());
			vo.setProductoModificacion(entitieToVO(it.getProductoModificacion()));
			if (it.getProductoReferencia() != null) {
				vo.setIdProductoReferencia(it.getIdProductoReferencia());
				vo.setProductoReferencia(entitieToVO(it.getProductoReferencia()));
			}

			return vo;
		}).toList();
	}

	@Override
	public List<RespuestaAdecuacionProductoVO> consultaProductoCancelacion(int idAdecuacionSolicitud) {
		var adecuacionProducto = adecuacionProductoRepository.list("""
				SELECT ap FROM AdecuacionProducto ap
				JOIN FETCH ap.productoReferencia
				WHERE ap.idAdecuacionSolicitud = ?1
				AND ap.idProductoModificacion IS NULL
				AND ap.idProductoReferencia IS NOT NULL
				""", idAdecuacionSolicitud);

		return adecuacionProducto.stream().map(it -> {
			var vo = new RespuestaAdecuacionProductoVO();

			vo.setIdProductoModificacion(it.getIdProductoModificacion());
			vo.setIdProductoReferencia(it.getIdProductoReferencia());
			vo.setProductoReferencia(entitieToVO(it.getProductoReferencia()));

			return vo;
		}).toList();
	}

	@Override
	public List<ProductoVO> consultaPorActividadSolicitud(int idActividad, boolean excluirCortoPlazo, int idSolicitud) {
		actividadRepository.findByIdOptional(idActividad)
				.orElseThrow(() -> new RuntimeException("No se encontró la actividad con id " + idActividad));

		var productos = productoRepository.consultarPorIdActividadSolicitud(idActividad, excluirCortoPlazo,
				idSolicitud);
		return productos.stream().map(this::entitieToVO).toList();
	}

	@Override
	public List<ProductoVO> consultaPorActividad(int idActividad) {
		var actividad = actividadRepository.findByIdOptional(idActividad)
				.orElseThrow(() -> new RuntimeException("No se encontró la actividad con id " + idActividad));

		var productos = productoRepository.consultarActivosPorIdActividad(actividad.getIdActividad());

		return productos.stream().map(this::entitieToVO).collect(Collectors.toList());
	}

	@Override
	public ProductoVO consultarPorId(int idProducto) {
		var producto = productoRepository.findByIdOptional(idProducto)
				.orElseThrow(() -> new RuntimeException("No se encontró el producto con id " + idProducto));

		return entitieToVO(producto);
	}

	@Override
	@Transactional
	public RespuestaRegistroProductoVO registrar(PeticionProductoVO peticion) {
		var actividad = actividadRepository.findByIdOptional(peticion.getIdActividad()).orElseThrow(
				() -> new BadRequestException("No se encontró la actividad con id " + peticion.getIdActividad()));
		var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
				() -> new BadRequestException("No se encontró el usuario con id " + peticion.getCveUsuario()));

		var categoria = masterCatalogoRepository.findByIdOptional(peticion.getIdCategorizacion());
		var tipo = masterCatalogoRepository.findByIdOptional(peticion.getIdTipo());
		var indicadorMIR = masterCatalogoRepository.findByIdOptional(peticion.getIdIndicadorMIR());
		var indicadorPI = masterCatalogoRepository.findByIdOptional(peticion.getIdIndicadorPI());
		var nivelEducativo = masterCatalogoRepository.findByIdOptional(peticion.getIdNivelEducativo());

		var adecuacionProducto = new AdecuacionProducto();
		var producto = new Producto();

		if (peticion.getIdProductoReferencia() != null) {
			var adecuacionProductoPersisted = adecuacionProductoRepository.find("""
					SELECT ap FROM AdecuacionProducto ap
					JOIN FETCH ap.productoModificacion
					WHERE
					  ap.idAdecuacionSolicitud = ?1
					  AND ap.idProductoModificacion IS NOT NULL
					  AND ap.idProductoReferencia = ?2
					""", peticion.getIdAdecuacionSolicitud(), peticion.getIdProductoReferencia()).firstResultOptional();

			if (adecuacionProductoPersisted.isPresent()) {
				adecuacionProducto = adecuacionProductoPersisted.get();
				producto = adecuacionProducto.getProductoModificacion();
			}
		}

		if (peticion.getIdContinuidadOtros() != null) {
			var continuidad = masterCatalogoRepository.findByIdOptional(peticion.getIdContinuidadOtros());

			producto.setContinuidad(continuidad.get());
		}

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
		if (categoria.isPresent())
			producto.setCategorizacion(categoria.get());
		if (tipo.isPresent())
			producto.setTipoProducto(tipo.get());
		if (indicadorMIR.isPresent())
			producto.setIndicadorMIR(indicadorMIR.get());
		if (indicadorPI.isPresent())
			producto.setIndicadorPI(indicadorPI.get());
		if (nivelEducativo.isPresent())
			producto.setNivelEducativo(nivelEducativo.get());
		producto.setCxVinculacionProducto(peticion.getVinculacion());
		producto.setCbPorPublicar(peticion.getPorPublicar());

		producto.setCxCvenombrePotic(peticion.getCveNombreProyectoPOTIC());
		
		if (peticion.getAdecuacionPi() != null) {
			var justificacionPi = new JustificacionIndicador();
			justificacionPi.setCausas(peticion.getAdecuacionPi().getCausa());
			justificacionPi.setEfectos(peticion.getAdecuacionPi().getEfectos());
			justificacionPi.setOtrosMotivos(peticion.getAdecuacionPi().getOtrosMotivos());

			justificacionIndicadorRepository.persistAndFlush(justificacionPi);
			producto.setIdJustificacionPI(justificacionPi.getId());
		}
		
		/*
		 * Registra producto
		 */
		productoRepository.persistAndFlush(producto);
		
		if (peticion.getAdecuacionMir() != null) {
			var justificacionMir = new JustificacionIndicador();
			justificacionMir.setCausas(peticion.getAdecuacionMir().getCausas());
			justificacionMir.setEfectos(peticion.getAdecuacionMir().getEfectos());
			justificacionMir.setOtrosMotivos(peticion.getAdecuacionMir().getOtrosMotivos());

			justificacionIndicadorRepository.persistAndFlush(justificacionMir);
			producto.setIdJustificacionMIR(justificacionMir.getId());

			var justificacionProductoPK = new JustificacionProductoPK();
			justificacionProductoPK.setIxTrimestre(0);
			justificacionProductoPK.setIdProducto(producto.getIdProducto());

			var justificacionProducto = new JustificacionProducto();
			justificacionProducto.setId(justificacionProductoPK);
			justificacionProducto.setCausa(peticion.getAdecuacionMir().getCausas());
			justificacionProducto.setEfectos(peticion.getAdecuacionMir().getEfectos());
			justificacionProducto.setOtrosMotivos(peticion.getAdecuacionMir().getOtrosMotivos());

			justificacionProductoRepository.persistAndFlush(justificacionProducto);
			/*
			 * Actualiza producto
			 */
			productoRepository.persistAndFlush(producto);
		}


		adecuacionProducto.setIdAdecuacionSolicitud(peticion.getIdAdecuacionSolicitud());
		adecuacionProducto.setIdProductoModificacion(producto.getIdProducto());
		adecuacionProducto.setIdProductoReferencia(peticion.getIdProductoReferencia());

		adecuacionProductoRepository.persist(adecuacionProducto);

		var productosCalendario = producto.getProductoCalendario();
		Producto finalProducto = producto;
		peticion.getCalendarizacion().stream().map(it -> {
			var productoCalendario = new ProductoCalendario();

			productoCalendario.setCiMes(it.getMes());
			productoCalendario.setCiMonto(it.getActivo());
			productoCalendario.setIdProducto(finalProducto.getIdProducto());
			productoCalendarioRepository.persist(productoCalendario);

			return productoCalendario;
		}).forEach(productosCalendario::add);

		var respuesta = new RespuestaRegistroProductoVO();
		respuesta.setIdProducto(producto.getIdProducto());
		return respuesta;
	}

	@Override
	@Transactional
	public void modificar(int idProducto, PeticionProductoVO peticion) {
		var producto = productoRepository.findByIdOptional(idProducto)
				.orElseThrow(() -> new NotFoundException("No se encontró el producto con id " + idProducto));
		var actividad = actividadRepository.findByIdOptional(peticion.getIdActividad()).orElseThrow(
				() -> new BadRequestException("No se encontró la actividad con id " + peticion.getIdActividad()));
		var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
				() -> new BadRequestException("No se encontró el usuario con id " + peticion.getCveUsuario()));
		var categoria = masterCatalogoRepository.findByIdOptional(peticion.getIdCategorizacion());
		var tipo = masterCatalogoRepository.findByIdOptional(peticion.getIdTipo());
		var indicadorMIR = masterCatalogoRepository.findByIdOptional(peticion.getIdIndicadorMIR());
		var indicadorPI = masterCatalogoRepository.findByIdOptional(peticion.getIdIndicadorPI());
		var nivelEducativo = masterCatalogoRepository.findByIdOptional(peticion.getIdNivelEducativo());

		Optional<MasterCatalogo> continuidad = java.util.Optional.empty();
		if (peticion.getIdContinuidadOtros() != null)
			continuidad = masterCatalogoRepository.findByIdOptional(peticion.getIdContinuidadOtros());

		producto.setUsuario(usuario);
		producto.setActividad(actividad);
		producto.setCveProducto(peticion.getCveProducto());
		producto.setCxNombre(peticion.getNombre());
		producto.setCxDescripcion(peticion.getDescripcion());
		producto.setCsEstatus(peticion.getEstatus());
		if (categoria.isPresent())
			producto.setCategorizacion(categoria.get());
		if (tipo.isPresent())
			producto.setTipoProducto(tipo.get());
		if (indicadorMIR.isPresent())
			producto.setIndicadorMIR(indicadorMIR.get());
		if (indicadorPI.isPresent())
			producto.setIndicadorPI(indicadorPI.get());
		if (nivelEducativo.isPresent())
			producto.setNivelEducativo(nivelEducativo.get());
		producto.setCxVinculacionProducto(peticion.getVinculacion());
		if (continuidad.isPresent())
			producto.setContinuidad(continuidad.get());
		producto.setCbPorPublicar(peticion.getPorPublicar());
		peticion.setIdAnhoPublicacion(peticion.getIdAnhoPublicacion());

		if (!ObjectUtils.isEmpty(peticion.getIdAnhoPublicacion()))
			producto.setAnhioPublicacion(peticion.getIdAnhoPublicacion());
		producto.setCxCvenombrePotic(peticion.getCveNombreProyectoPOTIC());

		productoCalendarioRepository.delete("producto", producto);
		var productosCalendario = producto.getProductoCalendario();
		peticion.getCalendarizacion().stream().map(it -> {
			var productoCalendario = new ProductoCalendario();

			productoCalendario.setCiMes(it.getMes());
			productoCalendario.setCiMonto(it.getActivo());
			productoCalendario.setProducto(producto);
			productoCalendario.setIdProducto(producto.getIdProducto());
			productoCalendarioRepository.persist(productoCalendario);

			return productoCalendario;
		}).forEach(productosCalendario::add);
		productoRepository.persistAndFlush(producto);
	}

	@Override
	@Transactional
	public void eliminar(int idProducto) {
		var producto = productoRepository.findByIdOptional(idProducto)
				.orElseThrow(() -> new NotFoundException("No se encontró el producto con id " + idProducto));

		producto.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
		productoRepository.persistAndFlush(producto);

		List<Producto> productos = productoRepository
				.consultarProductosActivosPorIdActividad(producto.getActividad().getIdActividad());
		int secuenciaAux = 1;
		for (Producto prod : productos) {
			prod.setCveProducto("" + secuenciaAux++);
		}
		productoRepository.persist(productos);
	}

	@Override
	@Transactional
	public void eliminarAdecuacion(PeticionEliminarModificacion peticion) {
		var adecuacionProducto = adecuacionProductoRepository
				.find("idAdecuacionSolicitud = ?1 AND idProductoReferencia = ?2", peticion.getIdAdecuacionSolicitud(),
						peticion.getIdReferencia())
				.firstResultOptional().orElseThrow(() -> new NotFoundException(
						"No se encontró la adecuación con id " + peticion.getIdAdecuacionSolicitud()));

		if (adecuacionProducto.getIdProductoModificacion() != null) {
			var producto = productoRepository.findById(adecuacionProducto.getIdProductoModificacion());
			producto.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
			productoRepository.persist(producto);
		}

		adecuacionProductoRepository.delete(adecuacionProducto);
	}

	@Override
	@Transactional
	public void cancelarProducto(PeticionCancelacionProductoVO peticion) {
		productoRepository.findByIdOptional(peticion.getIdProductoReferencia()).orElseThrow(
				() -> new NotFoundException("No se encontró el producto con id " + peticion.getIdProductoReferencia()));

		// Primero necesito validar que no tenga entregables presentados en avances
		// programáticos
		var avance = avanceRepository.find("""
				SELECT a FROM Avance a
				INNER JOIN a.productoCalendario
				WHERE a.productoCalendario.idProducto = ?1
				""", peticion.getIdProductoReferencia()).firstResultOptional();

		if (avance.isPresent()) {
			throw new BadRequestException(
					"El producto no se puede cancelar porque tiene avances programáticos presentados");
		}

		var adecuacionProducto = adecuacionProductoRepository.find("""
				idAdecuacionSolicitud = ?1
				AND idProductoModificacion IS NULL
				AND idProductoReferencia = ?2
				""", peticion.getIdAdecuacionSolicitud(), peticion.getIdProductoReferencia()).firstResultOptional()
				.orElseGet(AdecuacionProducto::new);

		adecuacionProducto.setIdAdecuacionSolicitud(peticion.getIdAdecuacionSolicitud());
		adecuacionProducto.setIdProductoReferencia(peticion.getIdProductoReferencia());

		adecuacionProductoRepository.persist(adecuacionProducto);
	}

	@Override
	public MensajePersonalizado<Integer> secuencialPorProyecto(Integer idProyecto) {

		proyectoRepository.findByIdOptional(idProyecto)
				.orElseThrow(() -> new NotFoundException("No existe la Proyecto con id " + idProyecto));
		var secuenciaPorProyecto = secuenciaProductoXProyectoRepo.find("idProyecto", idProyecto).firstResult();

		Integer secProducto = secuenciaPorProyecto == null || secuenciaPorProyecto.getIdSecuencia() == null
				|| secuenciaPorProyecto.getIxSecuencia() == null ? 1 : secuenciaPorProyecto.getIxSecuencia();

		MensajePersonalizado<Integer> respuesta = new MensajePersonalizado<Integer>();
		try {
			respuesta.setCodigo("200");
			respuesta.setMensaje("Exitoso");
			respuesta.setRespuesta(secProducto);
		} catch (Exception e) {
			respuesta.setCodigo("500");
			respuesta.setMensaje("Error al calcular y pesistir la secuencia por proyecto");
			e.printStackTrace();
		}
		return respuesta;
	}

	@Override
	public MensajePersonalizado<Integer> secuencialPorActividad(Integer idActividad) {

		actividadRepository.findByIdOptional(idActividad)
				.orElseThrow(() -> new NotFoundException("No existe la actividad con id " + idActividad));
		var secuenciaPorActividad = secuenciaProductoRepository.find("actividad.idActividad", idActividad)
				.firstResult();

		Integer secProducto = secuenciaPorActividad == null || secuenciaPorActividad.getIdSecuencia() == null
				|| secuenciaPorActividad.getIxSecuencia() == null ? 1 : secuenciaPorActividad.getIxSecuencia();

		MensajePersonalizado<Integer> respuesta = new MensajePersonalizado<Integer>();
		try {
			respuesta.setCodigo("200");
			respuesta.setMensaje("Exitoso");
			respuesta.setRespuesta(secProducto);
		} catch (Exception e) {
			respuesta.setCodigo("500");
			respuesta.setMensaje("Error al calcular y pesistir la secuencia por actividad");
			e.printStackTrace();
		}
		return respuesta;
	}

	private ProductoVO entitieToVO(Producto producto) {
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
			vo.setIdCategorizacion(producto.getCategorizacion().get().getId());
		if (producto.getTipoProducto().isPresent())
			vo.setIdTipoProducto(producto.getTipoProducto().get().getId());
		if (producto.getIndicadorMIR().isPresent()) {
			vo.setIdIndicadorMIR(producto.getIndicadorMIR().get().getId());
			vo.setIndicadorMIR(producto.getIndicadorMIR().get().getCdOpcion());
		}
		if (producto.getIndicadorPI().isPresent())
			vo.setIdIndicadorPI(producto.getIndicadorPI().get().getId());
		if (producto.getNivelEducativo().isPresent())
			vo.setIdNivelEducativo(producto.getNivelEducativo().get().getId());
		vo.setVinculacionProducto(producto.getCxVinculacionProducto());
		if (producto.getContinuidad().isPresent())
			vo.setIdContinuidad(producto.getContinuidad().get().getId());
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
	}

	@Override
	public List<ProductoCalendario> consultaActividadPorProducto(Integer idProducto, Integer trimestre) {
		var listaidProducto = new ArrayList<Integer>(idProducto);
		var productoCalendario = productoCalendarioRepository.findByIdProducto(listaidProducto);
		var respuesta = new ArrayList<ProductoCalendario>();
		productoCalendario.forEach((producto) -> {
			// if(producto.getCiMes() < trimestre*4){
			respuesta.add(producto);
			// }
		});
		return respuesta;
	}
}