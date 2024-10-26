package mx.mejoredu.dgtic.servicios.Impl;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Calendarizacion;
import mx.mejoredu.dgtic.dao.CortoplazoActividadRepository;
import mx.mejoredu.dgtic.dao.ProductoRepository;
import mx.mejoredu.dgtic.dao.ProyectoAnualRepository;
import mx.mejoredu.dgtic.entity.*;
import mx.mejoredu.dgtic.servicios.ActividadesService;
import mx.mejoredu.dgtic.servicios.EstatusProgmaticoService;
import mx.mejoredu.dgtic.servicios.ProductosService;
import mx.sep.dgtic.mejoredu.seguimiento.*;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.*;

/**
 * @author Emmanuel Estrada Gonzalez (emmanuel.estrada)
 * @version 1.0
 */
@Service
public class EstatusProgmaticoServiceImpl implements EstatusProgmaticoService {

	@Inject
	private ProyectoAnualRepository proyectoAnualRepository;
	@Inject
	private CortoplazoActividadRepository cortoplazoActividadRepository;
	@Inject
	private ProductoRepository productoRepository;

	@Inject
	private ActividadesService actividadesService;

	@Inject
	private ProductosService productosService;

	@Override
	public List<SeguimientoEstatusProgramaticoVO> consultaEstatus(Integer anhio, Integer trimestre, Integer idUnidad,
			Integer idProyecto, Integer idActividad, Integer tipoAdecuacion) {
		var lista = proyectoAnualRepository.findEstatusProgramatico(anhio, trimestre, idUnidad, idProyecto, idActividad,
				tipoAdecuacion);

		var hashProyectos = new HashMap<Integer, ProyectoEstatus>();

		lista.forEach(proyecto -> {
			Log.info(proyecto.getIdProyecto());
			Log.info(hashProyectos.containsKey(proyecto.getIdProyecto()));
			
			if (proyecto.getIdProyecto()==1029) {
				Log.info(1029);
			}
			
			if (hashProyectos.containsKey(proyecto.getIdProyecto())) {
				// Si ya existe el proyecto, entonces solo agrego la actividad, producto
				var proyectoEstatus = hashProyectos.get(proyecto.getIdProyecto());
				proyectoEstatus.add(proyecto);
			} else {
				var proyectoEstatus = new ProyectoEstatus();
				proyectoEstatus.setIdProyecto(proyecto.getIdProyecto());
				proyectoEstatus.setCveProyecto(proyecto.getCveProyecto());
				proyectoEstatus.setNombreProyecto(proyecto.getNombreProyecto());
				proyectoEstatus.setIdUnidad(proyecto.getIdUnidad());
				proyectoEstatus.setCveUnidad(proyecto.getCveUnidad());
				proyectoEstatus.setUnidad(proyecto.getCveUnidadExterna());
				proyectoEstatus.add(proyecto);
				proyectoEstatus
						.setTotalAdecuaciones(proyectoEstatus.totalAdecuaciones + proyecto.getAdecuacionesProyecto());
				hashProyectos.put(proyecto.getIdProyecto(), proyectoEstatus);
			}
		});

		// Map hashProyectos to List<SeguimientoEstatusProgramaticoVO>
		List<SeguimientoEstatusProgramaticoVO> seguimiento = new ArrayList<>();
		for (ProyectoEstatus proyectoEstatus : hashProyectos.values()) {
			Log.info("idP>" + proyectoEstatus.getIdProyecto());
			seguimiento.add(proyectoEstatus.toVO());
		}

		return seguimiento;
	}

	@Override
	public List<ActividadEstatusProgramaticoVO> consultarActividades(Integer idProyecto, Integer trimestre) {
		var lista = cortoplazoActividadRepository.findActividadesEstatusProgramatico(idProyecto, trimestre);

		var hashActividades = new HashMap<Integer, ActividadEstatus>();

		lista.forEach(actividad -> {
			if (hashActividades.containsKey(actividad.getIdActividad())) {
				// Si ya existe la actividad, entonces solo agrego el producto
				var actividadEstatus = hashActividades.get(actividad.getIdActividad());
				actividadEstatus.add(actividad);
			} else {
				var actividadEstatus = new ActividadEstatus();
				actividadEstatus.setIdUnidad(actividad.getIdUnidad());
				actividadEstatus.setUnidad(actividad.getUnidad());
				actividadEstatus.setCveUnidad(actividad.getCveUnidad());
				actividadEstatus.setIdActividad(actividad.getIdActividad());
				actividadEstatus.setCveActividad(actividad.getCveActividad());
				actividadEstatus.setNombreActividad(actividad.getNombreActividad());
				actividadEstatus.add(actividad);
				hashActividades.put(actividad.getIdActividad(), actividadEstatus);
			}
		});

		List<ActividadEstatusProgramaticoVO> seguimiento = new ArrayList<>();
		for (ActividadEstatus actividadEstatus : hashActividades.values()) {
			seguimiento.add(actividadEstatus.toVO());
		}

		return seguimiento;
	}

	@Override
	public List<ProductosEstatusProgramaticoVO> consultarProductos(Integer idActividad, Integer trimestre) {
		var lista = productoRepository.findProductosEstatusProgramatico(idActividad, trimestre);

		return lista.stream().map(it -> {
			var calendarizacion = it.getProductoCalendario().stream()
					.sorted(Comparator.comparing(ProductoCalendario::getCiMes, Comparator.reverseOrder())).toList();

			Optional<EvidenciaTrimestral> evidencia = Optional.empty();

			for (var pc : calendarizacion) {
				if (pc.getAvances().isEmpty())
					continue;
				var avanceTrimestral = pc.getAvances().stream().filter(a -> a.getEvidenciaTrimestral() != null)
						.findFirst();
				if (avanceTrimestral.isPresent()) {
					evidencia = Optional.of(avanceTrimestral.get().getEvidenciaTrimestral());
					break;
				}
			}

			Integer idUnidad;
			String unidad;
			String cveUnidad;
			if (it.getActividad().getProyecto().getUnidadAdministrativa() != null) {
				idUnidad = it.getActividad().getProyecto().getUnidadAdministrativa().getId();
				unidad = it.getActividad().getProyecto().getUnidadAdministrativa().getCcExternaDos();
				cveUnidad = it.getActividad().getProyecto().getUnidadAdministrativa().getCcExterna();
			} else {
				idUnidad = null;
				unidad = null;
				cveUnidad = null;
			}

			return ProductosEstatusProgramaticoVO.builder().idUnidad(idUnidad).unidad(unidad).cveUnidad(cveUnidad)
					.idProducto(it.getIdProducto()).cveProducto(it.getCveProducto()).nombreProducto(it.getCxNombre())
					.idCategoria(it.getCategorizacion().map(MasterCatalogo::getId).orElse(null))
					.categoria(it.getCategorizacion().map(MasterCatalogo::getCdOpcion).orElse(null))
					.idTipoProducto(it.getTipoProducto().map(MasterCatalogo::getId).orElse(null))
					.tipoProducto(it.getTipoProducto().map(MasterCatalogo::getCdOpcion).orElse(null))
					.entregablesProgramados(it.getProductoCalendario().stream()
							.flatMapToInt(calendario -> Optional.ofNullable(calendario.getCiMonto()).stream()
									.mapToInt(Integer::intValue))
							.sum())
					.entregablesFinalizados(it.getProductoCalendario().stream()
							.flatMapToInt(calendario -> Optional.ofNullable(calendario.getCiEntregados()).stream()
									.mapToInt(Integer::intValue))
							.sum())
					.estatus(it.getCsEstatus())
					// TODO: Revisar este fragmento para garantizar no null pointer
					.revisado(evidencia.map(ev -> {
						if (ev.getAprobacionJuntaDirectiva() == null)
							return null;
						return ev.getFechaSesion() != null && !ev.getAprobacionJuntaDirectiva().isBlank()
								&& ev.getFechaAprobacion() != null;
					}).orElse(null)).aprobado(evidencia.map(ev -> {
						if (ev.getAprobacionJuntaDirectiva() == null)
							return null;
						return !ev.getAprobacionJuntaDirectiva().isBlank();
					}).orElse(null)).fechaAprobacion(evidencia.map(ev -> {
						if (ev.getFechaAprobacion() == null)
							return null;
						return Date.from(
								ev.getFechaAprobacion().atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
					}).orElse(null)).publicado(evidencia.map(ev -> ev.getIdTipoPublicacion() != null).orElse(null))
					.tipoPublicacion(evidencia.map(ev -> {
						if (ev.getIdTipoPublicacion() == null)
							return null;
						return ev.getTipoPublicacion().getCdOpcion();
					}).orElse(null)).medioDifusion(evidencia.map(ev -> {
						if (ev.getIdTipoDifusion() == null)
							return null;
						return ev.getTipoDifusion().getCdOpcion();
					}).orElse(null)).build();
		}).toList();
	}

	@Override
	public DetallesProductoEstatusProgramaticoVO consultarDetallesProducto(Integer idProducto) {
		var producto = productoRepository.detailsById(idProducto)
				.orElseThrow(() -> new NotFoundException("Producto con id " + idProducto + " no encontrado"));

		var presupuestoVO = producto.getPresupuesto().stream()
				.map(it -> ProductoPresupuestoVO.builder().idPresupuesto(it.getIdPresupuesto())
						.cveAccion(it.getCveAccion()).cxNombrePresupuesto(it.getCxNombreAccion())
						.csEstatus(it.getCsEstatus())
						.cxPartidaGasto(it.getPartidaGastos().stream()
								.map(pg -> PartidaGastoVO.builder().idPartida(pg.getIdPartida())
										// TODO: Revisar campo ixAnual de PartidaGasto
										.anual(pg.getIxAnual()).cxNombrePartida(pg.getCatalogoPartida().getCdOpcion())
										.calendarizacion(pg.getPresupuestoCalendarios().stream()
												.map(pc -> Calendarizacion.builder().mes(pc.getIxMes())
														// TODO: Revisar campo ixMonto de PresupuestoCalendario
														.monto(pc.getIxMonto()).build())
												.toList())
										.build())
								.toList())
						.build())
				.toList();

		var hashCalendario = new HashMap<Integer, CalendarizacionProductoVO>();
		producto.getProductoCalendario().forEach(calendario -> {
			if (hashCalendario.containsKey(calendario.getCiMes())) {
				var calendarioProducto = hashCalendario.get(calendario.getCiMes());
				// calendarioProducto.setProgramado(calendarioProducto.getProgramado() +
				// calendario.getCiMonto());
				// calendarioProducto.setEntregado(calendarioProducto.getEntregado() +
				// calendario.getCiEntregados());
			} else {
				var calendarioProducto = new CalendarizacionProductoVO();
				calendarioProducto.setMes(calendario.getCiMes());
				calendarioProducto.setProgramado(calendario.getCiMonto());
				calendarioProducto.setEntregado(calendario.getCiEntregados());
				hashCalendario.put(calendario.getCiMes(), calendarioProducto);
			}
		});

		// Sort the hash map by month and map it to a list
		var calendarizacion = hashCalendario.entrySet().stream().sorted(Map.Entry.comparingByKey())
				.map(Map.Entry::getValue).toList();

		// Get last adecuacionProductoReferencia
		var adecuacionProductoReferencia = producto.getAdecuacionProductoReferencia().stream()
				.filter(apr -> apr.getIdProductoModificacion() != null)
				.max(Comparator.comparing(AdecuacionProducto::getIdAdecuacionProducto)).orElse(null);

		Optional<Producto> productoModificado = Optional.empty();
		if (adecuacionProductoReferencia != null) {
			var detallesModificacion = productoRepository
					.detailsById(adecuacionProductoReferencia.getIdProductoModificacion());

			detallesModificacion.ifPresent(value -> value.getProductoCalendario().forEach(calendario -> {
				if (hashCalendario.containsKey(calendario.getCiMes())) {
					var calendarioProducto = hashCalendario.get(calendario.getCiMes());
					calendarioProducto.setModificado(calendarioProducto.getProgramado() + calendario.getCiMonto());
				} else {
					var calendarioProducto = new CalendarizacionProductoVO();
					calendarioProducto.setMes(calendario.getCiMes());
					calendarioProducto.setModificado(calendario.getCiMonto());
					hashCalendario.put(calendario.getCiMes(), calendarioProducto);
				}
			}));

			productoModificado = detallesModificacion;
		}

		Integer idUnidad;
		String unidad;
		String cveUnidad;
		if (producto.getActividad().getProyecto().getUnidadAdministrativa() != null) {
			idUnidad = producto.getActividad().getProyecto().getUnidadAdministrativa().getId();
			unidad = producto.getActividad().getProyecto().getUnidadAdministrativa().getCcExternaDos();
			cveUnidad = producto.getActividad().getProyecto().getUnidadAdministrativa().getCcExterna();
		} else {
			idUnidad = null;
			unidad = null;
			cveUnidad = null;
		}

		var vo = DetallesProductoEstatusProgramaticoVO.builder()
				.idProyecto(producto.getActividad().getProyecto().getIdProyecto())
				.cveProyecto(producto.getActividad().getProyecto().getCveProyecto())
				.nombreProyecto(producto.getActividad().getProyecto().getCxNombreProyecto()).idUnidad(idUnidad)
				.unidad(unidad).cveUnidad(cveUnidad).idActividad(producto.getActividad().getIdActividad())
				.cveActividad(producto.getActividad().getCveActividad())
				.nombreActividad(producto.getActividad().getCxNombreActividad()).idProducto(producto.getIdProducto())
				.cveProducto(producto.getCveProducto())
				// Convert cveProducto to numeroProducto: e.g. "0001" -> "1"
				.numeroProducto(producto.getCveProducto().replaceFirst("^0+(?!$)", ""))
				.nombreProducto(producto.getCxNombre())
				.idCategorizacion(producto.getCategorizacion().map(MasterCatalogo::getId).orElse(null))
				.categorizacion(producto.getCategorizacion().map(MasterCatalogo::getCdOpcion).orElse(null))
				.idTipoProducto(producto.getTipoProducto().map(MasterCatalogo::getId).orElse(null))
				.tipoProducto(producto.getTipoProducto().map(MasterCatalogo::getCdOpcion).orElse(null))
				.nombreProyectoModificado(
						productoModificado.map(p -> p.getActividad().getProyecto().getCxNombreProyecto()).orElse(null))
				.nombreActividadModificado(
						productoModificado.map(p -> p.getActividad().getCxNombreActividad()).orElse(null))
				.nombreProductoModificado(productoModificado.map(Producto::getCxNombre).orElse(null))
				.presupuestos(presupuestoVO).calendarizacion(calendarizacion).build();

		return vo;
	}

	@Data
	private static class ProyectoEstatus {
		private Integer idProyecto;
		private Integer cveProyecto;
		private String nombreProyecto;
		private Integer idUnidad;
		private String unidad;
		private String cveUnidad;
		private Double presupuestoProgramado = 0.0;
		private Double presupuestoUtilizado = 0.0;
		private Long totalProductosEntregados = 0L;
		private Long totalEntregablesProgramados = 0L;
		private Long totalEntregablesFinalizados = 0L;
		private Long totalAdecuaciones = 0L;

		private Set<Integer> actividades = new HashSet<>();
		private Set<Integer> productos = new HashSet<>();

		public void add(ProyectosEstatusProgramatico proyecto) {
			// Agregar actividad
			if (proyecto.getIdActividad() == null)
				return;
			if (!this.actividades.contains(proyecto.getIdActividad())) {
				this.actividades.add(proyecto.getIdActividad());
				this.totalAdecuaciones += proyecto.getAdecuacionesActividad();
			}
			// Agregar producto
			// Sí ya existe, no se hace nada
			if (proyecto.getIdProducto() == null)
				return;
			if (!this.productos.contains(proyecto.getIdProducto())) {
				Log.info("Id proyecto:" + proyecto.getIdProyecto());
				Log.info("Id producto:" + proyecto.getIdProducto());
				this.productos.add(proyecto.getIdProducto());

				if (proyecto.getProductosEntregados() != null && proyecto.getProductosEntregados() > 0) {
					this.totalProductosEntregados++;
				}

				// Agregar presupuesto
				if (proyecto.getPresupuestoProgramado() != null)
					this.presupuestoProgramado += proyecto.getPresupuestoProgramado();
				if (proyecto.getPresupuestoUtilizado() != null)
					this.presupuestoUtilizado += proyecto.getPresupuestoUtilizado();
				// Agregar entregables
				if (proyecto.getEntregablesProgramados() != null)
					this.totalEntregablesProgramados += proyecto.getEntregablesProgramados();
				if (proyecto.getEntregablesFinalizados() != null)
					this.totalEntregablesFinalizados += proyecto.getEntregablesFinalizados();
				// Agregar adecuaciones
				if (proyecto.getAdecuacionesAcciones() != null)
					this.totalAdecuaciones += proyecto.getAdecuacionesAcciones();
				if (proyecto.getAdecuacionesPresupuesto() != null)
					this.totalAdecuaciones += proyecto.getAdecuacionesPresupuesto();
			}
		}

		public SeguimientoEstatusProgramaticoVO toVO() {
			float porcentajePresupuesto = (float) (this.presupuestoUtilizado / this.presupuestoProgramado * 100);
			var porcentajeProductos = (float) this.totalProductosEntregados / this.productos.size() * 100;
			var porcentajeEntregables = (float) this.totalEntregablesFinalizados / this.totalEntregablesProgramados
					* 100;

			return SeguimientoEstatusProgramaticoVO.builder().idProyecto(this.idProyecto)
					.claveProyecto(this.cveProyecto).idUnidad(this.idUnidad).cveUnidad(this.cveUnidad)
					.unidad(this.unidad).proyecto(this.nombreProyecto).presupuestoProgramado(this.presupuestoProgramado)
					.presupuestoUtilizado(this.presupuestoUtilizado)
					.porcentajePresupuesto(Float.isNaN(porcentajePresupuesto) ? 0 : porcentajePresupuesto)
					.totalActividades((long) this.actividades.size())
					.totalProductosProgramados((long) this.productos.size())
					.totalProductosEntregados(this.totalProductosEntregados)
					.porcentajeProductos(Float.isNaN(porcentajeProductos) ? 0 : porcentajeProductos)
					.totalEntregablesProgramados(this.totalEntregablesProgramados)
					.totalEntregablesFinalizados(this.totalEntregablesFinalizados)
					.porcentajeEntregables(Float.isNaN(porcentajeEntregables) ? 0 : porcentajeEntregables)
					.totalAdecuaciones(this.totalAdecuaciones).build();
		}
	}

	@Data
	private static class ActividadEstatus {
		private Integer idUnidad;
		private String unidad;
		private String cveUnidad;
		private Integer idActividad;
		private Integer cveActividad;
		private String nombreActividad;

		private Double presupuestoProgramado = 0.0;
		private Double presupuestoUtilizado = 0.0;
		private Long totalProductosEntregados = 0L;
		private Long totalEntregablesProgramados = 0L;
		private Long totalEntregablesFinalizados = 0L;
		private Long totalAdecuaciones = 0L;

		private Set<Integer> productos = new HashSet<>();

		public void add(ActividadEstatusProgramatico actividad) {
			// Agregar producto
			// Sí ya existe, no se hace nada
			if (actividad.getIdProducto() == null)
				return;
			if (!this.productos.contains(actividad.getIdProducto())) {
				this.productos.add(actividad.getIdProducto());

				this.totalAdecuaciones += actividad.getAdecuacionesProductos();

				if (actividad.getProductosEntregados() != null && actividad.getProductosEntregados() > 0) {
					this.totalProductosEntregados++;
				}

				// Agregar presupuesto
				if (actividad.getPresupuestoProgramado() != null)
					this.presupuestoProgramado += actividad.getPresupuestoProgramado();
				if (actividad.getPresupuestoUtilizado() != null)
					this.presupuestoUtilizado += actividad.getPresupuestoUtilizado();
				// Agregar entregables
				if (actividad.getEntregablesProgramados() != null)
					this.totalEntregablesProgramados += actividad.getEntregablesProgramados();
				if (actividad.getEntregablesFinalizados() != null)
					this.totalEntregablesFinalizados += actividad.getEntregablesFinalizados();
				// Agregar adecuaciones
				if (actividad.getAdecuacionesAcciones() != null)
					this.totalAdecuaciones += actividad.getAdecuacionesAcciones();
				if (actividad.getAdecuacionesPresupuesto() != null)
					this.totalAdecuaciones += actividad.getAdecuacionesPresupuesto();
			}
		}

		public ActividadEstatusProgramaticoVO toVO() {
			var porcentajePresupuesto = (float) (this.presupuestoUtilizado / this.presupuestoProgramado * 100);
			var porcentajeProductos = (float) this.totalProductosEntregados / this.productos.size() * 100;
			var porcentajeEntregables = (float) this.totalEntregablesFinalizados / this.totalEntregablesProgramados
					* 100;

			return ActividadEstatusProgramaticoVO.builder().idUnidad(this.idUnidad).unidad(this.unidad)
					.cveUnidad(this.cveUnidad).idActividad(this.idActividad).cveActividad(this.cveActividad)
					.nombreActividad(this.nombreActividad).presupuestoProgramado(this.presupuestoProgramado)
					.presupuestoUtilizado(this.presupuestoUtilizado)
					.porcentajePresupuesto(Float.isNaN(porcentajePresupuesto) ? 0 : porcentajePresupuesto)
					.totalProductosProgramados((long) this.productos.size())
					.totalProductosEntregados(this.totalProductosEntregados)
					.porcentajeProductos(Float.isNaN(porcentajeProductos) ? 0 : porcentajeProductos)
					.totalEntregablesProgramados(this.totalEntregablesProgramados)
					.totalEntregablesFinalizados(this.totalEntregablesFinalizados)
					.porcentajeEntregables(Float.isNaN(porcentajeEntregables) ? 0 : porcentajeEntregables)
					.totalAdecuaciones(this.totalAdecuaciones).build();
		}
	}
}
