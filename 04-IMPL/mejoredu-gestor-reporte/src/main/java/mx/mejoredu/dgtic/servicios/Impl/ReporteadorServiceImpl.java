package mx.mejoredu.dgtic.servicios.Impl;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import io.quarkus.logging.Log;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoUsuarioEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.reportes.*;
import mx.mejoredu.dgtic.daos.*;
import mx.mejoredu.dgtic.entidades.*;

import mx.mejoredu.dgtic.entidades.Respuestas.ListadoSeguimientoReportes;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import jakarta.inject.Inject;
import mx.mejoredu.dgtic.servicios.IReporteadorService;

@Service
public class ReporteadorServiceImpl implements IReporteadorService {
	private static final Integer CATALOGOESTATUS = 2240;
	private static final Integer CATALOGOESTATUSMIR = 2243;
	private static final Object IDPADREUNIDAD = 2059;
	@Inject
	VistaProyectoRepository vistaProyectoRepository;
	@Inject
	MasterCatalogoRepositorio masterCatalogoRepositorio;
	@Inject
	VistaEntregablesProductoRepositorio vistaEntregablesProductoRepositorio;
	@Inject
	ProductoRepository productoRepository;
	@Inject
	MetAdecuacionProyectoRepository metAdecuacionProyectoRepository;
	@Inject
	MetAdecuacionSolicitudRepository metAdecuacionSolicitudRepository;
	@Inject
	MetSolicitudRepository metSolicitudRepository;
	@Inject
	PerfilLaboralRepository perfilLaboralRepository;
	@Inject
	ProyectoAnualRepository proyectoAnualRepository;
	@Inject
	SeguimientoRepository seguimientoRepository;
	@Inject
	ProductoCanceladoRepository productoCanceladoRepository;
	@Inject
	PresupuestoRepository presupuestoRepository;
	@Inject
	PresupuestoProyectoRepository presupuestoProyectoRepository;
	@Inject
	PresupuestoUnidadRepository presupuestoUnidadRepository;
	@Inject
	ProductoAsociadosMIRRepository productoAsociadosMIRRepository;
	@Inject
	PAAAprobadoRepository paaAprobadoRepository;
	@Inject
	ProductoMIRrepository productoMirRepository;
	@Inject
	MetAdecuacionProductoRepository metAdecuacionProductoRepository;
	@Inject
	MetAdecuacionActividadRepository metAdecuacionActividadRepository;
	@Inject
	MetAdecuacionPresupuestoRepository metAdecuacionPresupuestoRepository;
	@Inject
	MetAdecuacionAccionRepository metAdecuacionAccionRepository;
	@Inject
	UsuarioRepository usuarioRepository;
	@Inject
	MetCortoplazoActividadRepository metCortoplazoActividadRepository;
	@Inject
	ProductoCalendarioRepository productoCalendarioRepository;
	@Inject
	private ProyectoCategoriaRepository proyectoCategoriaRepository;
	
	@Inject
	private Vt_producto_sumatiroaRepository vt_producto_sumatiroaRepository;
	@Inject
	private ProductoMIRrepository productoMIRrepository;
	@Inject
	private VTProductoRepository vtProductoRepository;
	@Inject
	ProductoAvanceTrimestralRepository productoAvanceTrimestreRepository;

	@Inject
	SeguimientoGralRepository seguimientoGralRepository;
	
	@Override
	public MensajePersonalizado<List<ProyectoEstatusDTO>> consultarEstatusPorAnhio(Integer anhio) {
		MensajePersonalizado<List<ProyectoEstatusDTO>> respuesta = new MensajePersonalizado<List<ProyectoEstatusDTO>>();
		try {

			// List<ProyectoEstatusDTO> lstProyectos =

			List<ProyectoEstatusDTO> lstProyectos = new ArrayList<ProyectoEstatusDTO>();
			respuesta.setCodigo("200");
			respuesta.setMensaje("Exitoso");
			ProyectoEstatusDTO proyectoEstatusDTO = new ProyectoEstatusDTO();
			proyectoEstatusDTO.setNombreEstatus("Completo");
			proyectoEstatusDTO.setPorcentaje(80);

			ProyectoEstatusDTO proyectoEstatusDTOI = new ProyectoEstatusDTO();
			proyectoEstatusDTOI.setNombreEstatus("Incompleto");
			proyectoEstatusDTOI.setPorcentaje(10);

			ProyectoEstatusDTO proyectoEstatusDTOB = new ProyectoEstatusDTO();
			proyectoEstatusDTOB.setNombreEstatus("Cancelado");
			proyectoEstatusDTOB.setPorcentaje(10);
			lstProyectos.add(proyectoEstatusDTO);
			lstProyectos.add(proyectoEstatusDTOI);
			lstProyectos.add(proyectoEstatusDTOB);
			respuesta.setRespuesta(lstProyectos);
		} catch (Exception e) {
			respuesta.setCodigo("500");
			respuesta.setMensaje("Error al consultar los estatus del proyecto");
		}
		return respuesta;

	}

	@Override
	public MensajePersonalizado<RespuestaReportePAAGeneralDTO> consultarPAAReporteGeneralorAnhio(Integer anhio,
			String cveUsuario) {
		Optional<PerfilLaboral> unidadUsuarios = perfilLaboralRepository.findByCveUsuario(cveUsuario);
		MensajePersonalizado<RespuestaReportePAAGeneralDTO> respuesta = new MensajePersonalizado<RespuestaReportePAAGeneralDTO>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		RespuestaReportePAAGeneralDTO reporte = new RespuestaReportePAAGeneralDTO();
		List<CatMasterCatalogo> productosCategoria = masterCatalogoRepositorio.findByIdPadre(838);
		List<CatMasterCatalogo> productosTipo = masterCatalogoRepositorio.findByIdPadre(858);
		String query = "idAnhio = ?1 and idCatalogoUnidad = ?2";
		if (TipoUsuarioEnum.CONSULTOR
				.getIdTipoUsuario() == (unidadUsuarios.get().getUsuario().getTipoUsuario().getIdTipoUsuario())) // Si el
																												// usuario
																												// es
																												// consultor
																												// entonces
																												// mira
																												// todo
																												// no
																												// filtra
																												// por
																												// unidad
			query = "idAnhio = ?1 and ?2= ?2";
		List<VistaEntregablesProducto> vistaEntregablesProducto = vistaEntregablesProductoRepositorio
				.find(query, anhio, unidadUsuarios.get().getIdCatalogoUnidad()).list();

		int proyectos = (int) vistaEntregablesProducto.stream().map(VistaEntregablesProducto::getIdProyecto).distinct()
				.count();

		int actividades = (int) vistaEntregablesProducto.stream().map(VistaEntregablesProducto::getIdActividad)
				.distinct().count();
		int productos = (int) vistaEntregablesProducto.stream().map(VistaEntregablesProducto::getIdProducto).distinct()
				.count();
		int sumaCiMonto = vistaEntregablesProducto.stream().mapToInt(VistaEntregablesProducto::getCiMonto).sum();

		reporte.setTotalProyectos(proyectos);
		reporte.setTotalActividades(actividades);
		reporte.setTotalProductos(productos);
		reporte.setTotalEntregables(sumaCiMonto);

		List<ProductosCategoriaDTO> lstCategoriasProducto = new ArrayList<ProductosCategoriaDTO>();
		// Agrupar por categorias

		for (CatMasterCatalogo categoria : productosCategoria) {

			List<ProyectoPorcategoria> lstCategoPorProds = proyectoCategoriaRepository
					.find(query + " and idCatalogoCategorizacion =?3", anhio,
							unidadUsuarios.get().getIdCatalogoUnidad(), categoria.getIdCatalogo())
					.list();

			int totalProductos = (int) lstCategoPorProds.stream()
					.collect(Collectors.summingInt(ProyectoPorcategoria::getCxTotalProducto));
			lstCategoriasProducto.add(new ProductosCategoriaDTO(totalProductos, categoria.getCdOpcion()));
		}
		reporte.setProductosCategoria(lstCategoriasProducto);

		List<ProyectosUnidad> lstUnidad = new ArrayList<ProyectosUnidad>();
		List<VistaEntregablesProducto> proyectosUnidad = vistaEntregablesProductoRepositorio
				.find(query, anhio, unidadUsuarios.get().getIdCatalogoUnidad()).list();
		// Agrupar por cveUnidad, cveProyecto, cxNombreProyecto
		Map<String, List<VistaEntregablesProducto>> proyectosAgrupados = proyectosUnidad.stream()
				.collect(Collectors.groupingBy(proyecto -> proyecto.getCveUnidad() + proyecto.getCveProyecto()
						+ proyecto.getCxNombreProyecto()));
		// Obtener la lista final de proyectos únicos
		List<VistaEntregablesProducto> proyectosUnicos = proyectosAgrupados.values().stream()
				.map(listaPorGrupo -> listaPorGrupo.get(0)).collect(Collectors.toList());

		for (VistaEntregablesProducto unidad : proyectosUnicos) {
			CatMasterCatalogo unidadAdmin = masterCatalogoRepositorio.findById(unidad.getIdCatalogoUnidad());
			lstUnidad.add(new ProyectosUnidad(unidadAdmin.getCdOpcion().trim(), unidad.getCveProyecto(),
					unidad.getCxNombreProyecto()));
		}
		reporte.setProyectosUnidad(lstUnidad);
		respuesta.setRespuesta(reporte);

		List<ProductosTipo> lstTipo = new ArrayList<ProductosTipo>();
		Integer totalPorTipo = 0;

		// Obtener la lista final de productos por tipo
		Map<String, List<VistaEntregablesProducto>> agrupaProductosTipo = vistaEntregablesProducto.stream()
				.collect(Collectors.groupingBy(proyecto -> proyecto.getIdCatalgoTipoProducto().toString()));

		List<VistaEntregablesProducto> lstProductosTipo = agrupaProductosTipo.values().stream()
				.map(listaPorGrupo -> listaPorGrupo.get(0)).collect(Collectors.toList());

		Log.info("size :" + vistaEntregablesProducto.size());

		for (VistaEntregablesProducto entregable : lstProductosTipo) {
			Log.info("getIdCatalgoTipoProducto:" + entregable.getIdCatalgoTipoProducto());
			Log.info("idCatalgoTipoProducto:" + unidadUsuarios.get().getIdCatalogoUnidad());

			List<VistaEntregablesProducto> lstRecuperaProductos = vistaEntregablesProductoRepositorio
					.find(query + " and idCatalgoTipoProducto = ?3", anhio, unidadUsuarios.get().getIdCatalogoUnidad(),
							entregable.getIdCatalgoTipoProducto())
					.list();
			if (entregable.getIdCatalgoTipoProducto() == 900 || entregable.getIdCatalgoTipoProducto() == 864) {
				Log.info("es el de 4");
			}

			/*
			 * Map<String, List<VistaEntregablesProducto>> agrupaProductosXTipo =
			 * lstRecuperaProductos.stream()
			 * .filter(producto->producto.getIdCatalgoTipoProducto()==entregable.
			 * getIdCatalgoTipoProducto()) .collect(Collectors.groupingBy(proyecto ->
			 * proyecto.getCveProyecto()+proyecto.getIdActividad()+proyecto.getIdProducto())
			 * );
			 * 
			 * List<VistaEntregablesProducto> lstProductoParaEsteTipo =
			 * agrupaProductosXTipo.values().stream() .map(listaPorGrupo ->
			 * listaPorGrupo.get(0)).collect(Collectors.toList());
			 */

			int totalProdPortipo = (int) lstRecuperaProductos.stream()
					.collect(Collectors.groupingBy(producto -> producto.getIdProducto())).size();
			Log.info("totalProdPortipo: " + totalProdPortipo);
			CatMasterCatalogo masterCatalogo = masterCatalogoRepositorio
					.findById(entregable.getIdCatalgoTipoProducto());
			lstTipo.add(new ProductosTipo(masterCatalogo.getCdOpcion(), totalProdPortipo));
			totalPorTipo += totalProdPortipo;
		}

		/*
		 * for (CatMasterCatalogo productosTipoI : productosTipo) {
		 * Log.info("Buscando ... : "+productosTipoI.getIdCatalogo());
		 * 
		 * 
		 * int total = (int) vistaEntregablesProductoRepositorio .find(query +
		 * " and idCatalgoTipoProducto = ?3", anhio,
		 * unidadUsuarios.get().getIdCatalogoUnidad(), productosTipoI.getIdCatalogo())
		 * .stream().mapToInt(VistaEntregablesProducto::getIdCatalgoTipoProducto).count(
		 * );
		 * 
		 * if (total != 0) { int totalTipoActual = vistaEntregablesProducto.stream()
		 * .filter(tipo->
		 * tipo.getIdCatalgoTipoProducto()==productosTipoI.getIdCatalogo())
		 * .mapToInt(VistaEntregablesProducto::getCiMonto) .sum();
		 * Log.info("totalTipoActual: "+totalTipoActual); lstTipo.add(new
		 * ProductosTipo(productosTipoI.getCdOpcion(), total));
		 * Log.info("Tipo :"+productosTipoI.getIdCatalogo()+ ":"+ total);
		 * totalPorTipo+=total; } }
		 */
		Log.info("totalPorTipo :" + totalPorTipo);
		reporte.setProductosTipo(lstTipo);

		return respuesta;
	}

	@Override
	public MensajePersonalizado<RespuestaReporteAlineacionMIR> alineacionGeneral(Integer anhio, String cveUsuario) {
		MensajePersonalizado<RespuestaReporteAlineacionMIR> respuesta = new MensajePersonalizado<RespuestaReporteAlineacionMIR>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		RespuestaReporteAlineacionMIR alineacionMIR = new RespuestaReporteAlineacionMIR();
		List<CatMasterCatalogo> productosCategoria = masterCatalogoRepositorio.findByIdPadre(838);
		List<CatMasterCatalogo> productosTipo = masterCatalogoRepositorio.findByIdPadre(858);
		List<CatMasterCatalogo> indicadoresMIR = masterCatalogoRepositorio.findByIdPadre(625);
		Optional<PerfilLaboral> unidadUsuarios = perfilLaboralRepository.findByCveUsuario(cveUsuario);
		Integer idCatalogoUnidad = unidadUsuarios.get().getIdCatalogoUnidad();
		Log.info("Año:" + anhio);
		Log.info("Unidad:" + idCatalogoUnidad);
		String query = "idAnhio = ?1 and idCatalogoUnidad = ?2";
		if (TipoUsuarioEnum.CONSULTOR
				.getIdTipoUsuario() == (unidadUsuarios.get().getUsuario().getTipoUsuario().getIdTipoUsuario())
				|| TipoUsuarioEnum.SUPERVISOR
						.getIdTipoUsuario() == (unidadUsuarios.get().getUsuario().getTipoUsuario().getIdTipoUsuario())
				|| TipoUsuarioEnum.ADMINISTRADOR
						.getIdTipoUsuario() == (unidadUsuarios.get().getUsuario().getTipoUsuario().getIdTipoUsuario())

				|| TipoUsuarioEnum.SUPERUSUARIO
						.getIdTipoUsuario() == (unidadUsuarios.get().getUsuario().getTipoUsuario().getIdTipoUsuario())) // Si
																														// el
																														// usuario
																														// es
																														// consultor
																														// entonces
																														// mira
																														// todo
																														// no
																														// filtra
																														// por
																														// unidad
			query = "idAnhio = ?1 and ?2= ?2";

		List<ProductoMir> productosMIR = productoMirRepository.list(query, anhio, idCatalogoUnidad);
		Log.info("productosMIR size:" + productosMIR.size());

//		List<VistaEntregablesProducto> vistaEntregablesProducto = vistaEntregablesProductoRepositorio
//				.find(query, anhio, unidadUsuarios.get().getIdCatalogoUnidad()).list();
//		
//		
//		Log.info("vistaEntregablesProducto size:"+vistaEntregablesProducto.size());
//
//		Long productoCont = vistaEntregablesProducto.stream().map(VistaEntregablesProducto::getIdProducto).distinct()
//				.count();
//		
		List<VtProducto> lstProducto = vtProductoRepository
				.find(query, anhio, unidadUsuarios.get().getIdCatalogoUnidad()).list();
		Log.info("lstProducto.size:" + lstProducto.size());

		Long productoCont = (long) lstProducto.size();
		Log.info("productoCont:" + productoCont);

		String strCve = "";
		for (int ln = 0; ln < productosMIR.size(); ln++) {
			strCve += productosMIR.get(ln).getIdProducto() + ",";
		}

		strCve = strCve + "0";
		Log.info("Clave " + strCve);

		// GET PRODUCTOS ASOCIADOS A LA MIR
		List<ProductosAsociadosMIR> productosAsociadosMIR = productoAsociadosMIRRepository
				.find("idProducto in (" + strCve + ")").list();
		Map<String, List<ProductosAsociadosMIR>> productosAsociadosMIRAgrupados = productosAsociadosMIR.stream()
				.collect(Collectors.groupingBy(ProductosAsociadosMIR::getCcExterna));
		List<ProductosAsociadosMIR> productosAsociadosMIRUnicos = productosAsociadosMIRAgrupados.values().stream()
				.map(listaPorGrupo -> listaPorGrupo.get(0)).toList();

		List<ProductosAlineadosEstatusMIRDTO> productosAlineadosEstatus = new ArrayList<ProductosAlineadosEstatusMIRDTO>();

		/*
		 * Ajuste para lograr filtrar los productos que pertenecen al tipo y nivel de
		 * usuario
		 */
		String strQueryProdAsocMIR = query + " and idCatalgoIndicador = ?3 and csEstatus= 'C'";
		for (ProductosAsociadosMIR categoria : productosAsociadosMIRUnicos) {
			int total = (int) productoAsociadosMIRRepository
					.find(strQueryProdAsocMIR, anhio, idCatalogoUnidad, categoria.getIdCatalgoIndicador()).stream()
					.count();
			productosAlineadosEstatus.add(new ProductosAlineadosEstatusMIRDTO(total, categoria.getCcExterna()));
		}

		List<ProductosAlineadosNivelMIRDTO> productosAlineadosNivelMIRDTOS = new ArrayList<ProductosAlineadosNivelMIRDTO>();

		List<ProductosAsociadosMIR> productosAsoc = productoAsociadosMIRRepository.list(query + " and csEstatus= 'C'",
				anhio, idCatalogoUnidad);

		List<ProductosAsociadosMIR> productosConIdIndicadorNoNulo = productosAsoc.stream()
				.filter(product -> product.getIdCatalgoIndicador() > 0).toList();
		long cumplido = productosConIdIndicadorNoNulo.stream()
				.filter(producto -> EstatusEnum.COMPLETO.getEstatus().equals(producto.getCsEstatus())).count();
		long cancelado = productosConIdIndicadorNoNulo.stream()
				.filter(producto -> EstatusEnum.BLOQUEADO.getEstatus().equals(producto.getCsEstatus())).count();
		long enProceso = productosConIdIndicadorNoNulo.stream()
				.filter(producto -> EstatusEnum.PARCIALMENTECUMPLIDO.getEstatus().equals(producto.getCsEstatus()))
				.count();

		/**/

		productosAlineadosNivelMIRDTOS.add(new ProductosAlineadosNivelMIRDTO((int) cancelado, "Cancelado"));
		productosAlineadosNivelMIRDTOS.add(new ProductosAlineadosNivelMIRDTO((int) cumplido, "Cumplido"));
		productosAlineadosNivelMIRDTOS.add(new ProductosAlineadosNivelMIRDTO((int) enProceso, "En Proceso"));
		alineacionMIR.setTotalProductos(productoCont.intValue());
		alineacionMIR.setProductosAlineadosNivelMIR(productosAlineadosNivelMIRDTOS);
		alineacionMIR.setProductosAlineadosEstatusMIRDTOS(productosAlineadosEstatus);
		alineacionMIR.setProductosAlineadosMIR(productosAsoc.size());
		if (productoCont.intValue() > 0)
			alineacionMIR.setPorcentajeAlineadosMIR(productosAsoc.size() * 100 / productoCont.intValue());
		else
			alineacionMIR.setPorcentajeAlineadosMIR(0);

		List<ProductosAlineadosPorIndicadorMIRDTO> productosAlineadosMIR = new ArrayList<ProductosAlineadosPorIndicadorMIRDTO>();
		Set<String> procesados = new HashSet<>(); // <String>
		for (ProductoMir mir : productoMIRrepository.list(query, anhio, idCatalogoUnidad)) {
			String ccExternos = mir.getCcExternos();

			// Solo procesamos si no ha sido procesado previamente
			if (!procesados.contains(ccExternos)) {
				int prdMir = (int) productoMIRrepository.find("ccExternos = ?1", ccExternos).count();

				// Agregamos el resultado a la lista de productos alineados
				productosAlineadosMIR.add(new ProductosAlineadosPorIndicadorMIRDTO(prdMir, ccExternos));

				// Marcamos el ccExternos como procesado
				procesados.add(ccExternos);
			}
		}
		alineacionMIR.setProductosAlineadosPorIndicadorMIRDTOS(productosAlineadosMIR);

		respuesta.setRespuesta(alineacionMIR);
		return respuesta;
	}

	private void foreach(Object object) {
		// TODO Auto-generated method stub

	}

	@Override
	public MensajePersonalizado<RespuestaReporteAdecuacionDTO> adecuacionesGeneral(Integer anhio, String cveUsuario) {
		List<CatMasterCatalogo> adecuacionesCategorias = masterCatalogoRepositorio.findByIdPadre(2222);
		Optional<PerfilLaboral> unidadUsuarios = perfilLaboralRepository.findByCveUsuario(cveUsuario);
		int catUnidad = unidadUsuarios.get().getIdCatalogoUnidad();

		String strQuery = "idCatalogoUnidad =?1 and idCatalogoEstatus in (?2,?3) and idCatalogoAnhio = ?4 ";
		String strQueryAdecua = "idCatalogoAdecuacion = ?1 and idCatalogoEstatus in (?2,?3) and idCatalogoUnidad = ?4 and idCatalogoAnhio = ?5";

		switch (Integer.valueOf(unidadUsuarios.get().getUsuario().getTipoUsuario().getIdTipoUsuario())) {
		case 5: // Supervisor
		case 3: // Consultor
			strQuery = "?1=?1 and idCatalogoEstatus in (?2,?3) and idCatalogoAnhio = ?4 ";
			strQueryAdecua = "idCatalogoAdecuacion = ?1 and idCatalogoEstatus in (?2,?3) and ?4 = ?4 and idCatalogoAnhio = ?5";
			break;

		default:
			break;
		}

		List<MetSolicitud> solicitud = metSolicitudRepository
				.find(strQuery, catUnidad, CATALOGOESTATUS, CATALOGOESTATUSMIR, anhio).list();
		int totalAdecuaciones = (int) solicitud.size();

		List<CatMasterCatalogo> unidadAdministrativa = masterCatalogoRepositorio
				.find("idCatalogo = ?1", unidadUsuarios.get().getIdCatalogoUnidad()).list();
		MensajePersonalizado<RespuestaReporteAdecuacionDTO> respuesta = new MensajePersonalizado<RespuestaReporteAdecuacionDTO>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		RespuestaReporteAdecuacionDTO adecuacionDTO = new RespuestaReporteAdecuacionDTO();
		adecuacionDTO.setTotalAdecuados(totalAdecuaciones);

		List<AdecuacionTipo> adecuacionTipos = new ArrayList<AdecuacionTipo>();
		for (CatMasterCatalogo tiposAdecuacion : adecuacionesCategorias) {
			int cantidads = (int) metSolicitudRepository.find(strQueryAdecua, tiposAdecuacion.getIdCatalogo(),
					CATALOGOESTATUS, CATALOGOESTATUSMIR, catUnidad, anhio).count();
			adecuacionTipos.add(new AdecuacionTipo(cantidads, tiposAdecuacion.getCdOpcion()));
		}
		adecuacionDTO.setAdecuacionTipos(adecuacionTipos);

		List<AdecuacionUnidad> adecuacionUnidads = new ArrayList<AdecuacionUnidad>();
		List<CatMasterCatalogo> lstUnidadesCat = masterCatalogoRepositorio
				.find("idCatalogoPadre = ?1 and dfBaja is null", IDPADREUNIDAD).list();
		for (CatMasterCatalogo unidad : lstUnidadesCat) {
			Log.info("unidad:");
			Integer idCataUnidad = unidad.getIdCatalogo();
			Log.info("getIdCatalogo:" + Integer.valueOf(idCataUnidad));
			Log.info("getDfBaja:" + unidad.getDfBaja());
			List<MetSolicitud> solConIDUnidad = solicitud.stream()
					.filter(solEval -> solEval.getIdCatalogoUnidad().equals(idCataUnidad)).toList();
			Integer iContadorUnidad = solConIDUnidad.size();
			Log.info("Sol conID: " + iContadorUnidad);

			if (iContadorUnidad > 0)
				adecuacionUnidads.add(new AdecuacionUnidad(iContadorUnidad, unidad.getCdOpcion().trim()));
		}
		adecuacionDTO.setAdecuacionUnidades(adecuacionUnidads);

		List<AdecuacionProyecto> adecuacionProyectos = new ArrayList<AdecuacionProyecto>();
		List<MetAdecuacionSolicitud> adecuacionSolicitudesList = new ArrayList<>();
		List<MetAdecuacionProyecto> adecuacionProyectoList = new ArrayList<>();
		for (MetSolicitud listaForProyectos : solicitud) {
			var registroSoli = metAdecuacionSolicitudRepository
					.find("idSolicitud = ?1", listaForProyectos.getIdSolicitud()).list();
			for (int i = 0; i < registroSoli.size(); i++) {
				var registroProyecto = metAdecuacionProyectoRepository
						.find("idAdecuacionSolicitud = ?1", registroSoli.get(i).getIdAdecuacionSolicitud())
						.firstResult();
				var registroActi = metAdecuacionActividadRepository
						.find("idAdecuacionSolicitud = ?1", registroSoli.get(i).getIdAdecuacionSolicitud())
						.firstResult();
				var registroProdu = metAdecuacionProductoRepository
						.find("idAdecuacionSolicitud = ?1", registroSoli.get(i).getIdAdecuacionSolicitud())
						.firstResult();
				var registroPresu = metAdecuacionPresupuestoRepository
						.find("idAdecuacionSolicitud = ?1", registroSoli.get(i).getIdAdecuacionSolicitud())
						.firstResult();
				var registroAccion = metAdecuacionAccionRepository
						.find("idAdecuacionSolicitud = ?1", registroSoli.get(i).getIdAdecuacionSolicitud())
						.firstResult();

//			for (int i = 0; i < adecuacionSolicitudesList.size(); i++) {
//				MetAdecuacionProyecto registroProyecto = metAdecuacionProyectoRepository.find("idAdecuacionSolicitud = ?1", adecuacionSolicitudesList.get(i).getIdAdecuacionSolicitud()).firstResult();
//				MetAdecuacionActividad registroActividad = metAdecuacionActividadRepository.find("idAdecuacionSolicitud = ?1", adecuacionSolicitudesList.get(i).getIdAdecuacionSolicitud()).firstResult();
//				MetAdecuacionProducto registroProducto = metAdecuacionProductoRepository.find("idAdecuacionSolicitud = ?1", adecuacionSolicitudesList.get(i).getIdAdecuacionSolicitud()).firstResult();
//				MetAdecuacionPresupuesto registroPresupuesto = metAdecuacionPresupuestoRepository.find("idAdecuacionSolicitud = ?1", adecuacionSolicitudesList.get(i).getIdAdecuacionSolicitud()).firstResult();
//				MetAdecuacionAccion registroAccion = metAdecuacionAccionRepository.find("idAdecuacionSolicitud = ?1", adecuacionSolicitudesList.get(i).getIdAdecuacionSolicitud()).firstResult();
				if (registroProyecto != null) {
					adecuacionProyectoList.add(registroProyecto);
				}
				if (registroActi != null) {
					Actividad actividad = metCortoplazoActividadRepository
							.findById(Optional.ofNullable(registroActi.getIdActividadReferencia())
									.orElse(registroActi.getIdActividadModificacion()));
					MetAdecuacionProyecto proyectoAnual = metAdecuacionProyectoRepository
							.find("idProyecto = ?1", actividad.getIdProyecto()).firstResult();
					if (proyectoAnual != null)
						adecuacionProyectoList.add(proyectoAnual);
				}
				if (registroProdu != null) {
					Producto producto = productoRepository
							.findById(Optional.ofNullable(registroProdu.getIdProductoReferencia())
									.orElse(registroProdu.getIdProductoModificacion()));
					Actividad actividad = metCortoplazoActividadRepository.findById(producto.getActividad());
					MetAdecuacionProyecto proyectoAnual = metAdecuacionProyectoRepository
							.find("idProyecto = ?1 or idProyectoReferencia = ?1", actividad.getIdProyecto())
							.firstResult();
					if (proyectoAnual != null)
						adecuacionProyectoList.add(proyectoAnual);

				}
				if (registroPresu != null) {
					Presupuesto presupuesto = presupuestoRepository
							.findById(Optional.ofNullable(registroPresu.getIdPresupuestoReferencia())
									.orElse(registroPresu.getIdPresupuestoModificacion()));
					Producto producto = productoRepository.findById(presupuesto.getProducto());
					Actividad actividad = metCortoplazoActividadRepository.findById(producto.getActividad());
					MetAdecuacionProyecto proyectoAnual = metAdecuacionProyectoRepository
							.find("idProyecto = ?1 or idProyectoReferencia = ?1", actividad.getIdProyecto())
							.firstResult();
					if (proyectoAnual != null)
						adecuacionProyectoList.add(proyectoAnual);
				}
				if (registroAccion != null) {
					Presupuesto presupuesto = presupuestoRepository
							.findById(Optional.ofNullable(registroAccion.getIdPresupuestoReferencia())
									.orElse(registroAccion.getIdPresupuestoModificacion()));
					Producto producto = productoRepository.findById(presupuesto.getProducto());
					Actividad actividad = metCortoplazoActividadRepository.findById(producto.getActividad());
					MetAdecuacionProyecto proyectoAnual = metAdecuacionProyectoRepository
							.find("idProyecto = ?1 or idProyectoReferencia = ?1", actividad.getIdProyecto())
							.firstResult();
					if (proyectoAnual != null)
						adecuacionProyectoList.add(proyectoAnual);
				}
			}
		}
		List<MetAdecuacionProyecto> proyectosSinRepetir = adecuacionProyectoList.stream()
				.collect(Collectors.toMap(MetAdecuacionProyecto::getIdAdecuacionProyecto, p -> p, (p1, p2) -> p1))
				.values().stream().collect(Collectors.toList());
		// for por registros en metAdecuacionProyecto
		for (MetAdecuacionProyecto registro : proyectosSinRepetir) {
			ProyectoAnual nombreProyecto = new ProyectoAnual();
			if (registro.getIdProyecto() != null) {
				nombreProyecto = proyectoAnualRepository.findById(registro.getIdProyecto());
			}
			int cantidadAdecuacion = (int) adecuacionProyectoList.stream()
					.filter(p -> p.getIdProyecto() == registro.getIdProyecto()).count();
			if (cantidadAdecuacion != 0) {
				adecuacionProyectos
						.add(new AdecuacionProyecto(cantidadAdecuacion, nombreProyecto.getCxNombreProyecto()));
			}

		}
		adecuacionDTO.setAdecuacionProyectos(adecuacionProyectos);
		respuesta.setRespuesta(adecuacionDTO);
		return respuesta;
	}

//	public int calcularTotal(List<Producto> lista) {
//		var total = lista.stream().mapToInt(producto -> {
//			var monto = producto.getProductoCalendario().stream().mapToInt(ProductoCalendario::getCiMonto).sum();
//			return monto;
//		}).sum();
//		return total;
//	}
//
//	public int calcularTotalPorTrimestre(List<Producto> lista, int trimestre) {
//		var total = 0;
//		for (int i = 0; i < lista.size(); i++) {
//			var productosCalendario = lista.get(i).getProductoCalendario();
//			for (int j = 0; j < productosCalendario.size(); j++) {
//				int mes = productosCalendario.get(j).getCiEntregados();
//				switch (trimestre) {
//				case 1:
//					if (mes == 1 || mes == 2 || mes == 3) {
//						total++;
//						// total += productosCalendario.get(j).getCiMonto();
//					}
//					break;
//				case 2:
//					if (mes == 4 || mes == 5 || mes == 6) {
//						total++;
//						// total += productosCalendario.get(j).getCiMonto();
//					}
//					break;
//				case 3:
//					if (mes == 7 || mes == 8 || mes == 9) {
//						total++;
//						// total += productosCalendario.get(j).getCiMonto();
//					}
//					break;
//				case 4:
//					if (mes == 10 || mes == 11 || mes == 12) {
//						total++;
//						// total += productosCalendario.get(j).getCiMonto();
//					}
//				}
//			}
//		}
//		return total;
//	}


	@Override
	public MensajePersonalizado<RespuestaReporteSeguimientoDTO> seguimientoGeneral(Integer anhio, String cveUsuario) {

		Optional<PerfilLaboral> unidadUsuarios = perfilLaboralRepository.findByCveUsuario(cveUsuario);
		int catUnidad = unidadUsuarios.get().getIdCatalogoUnidad();

		String strQuery = "idCatalogoUnidad = ?2 and idAnhio = ?1";

		switch (Integer.valueOf(unidadUsuarios.get().getUsuario().getTipoUsuario().getIdTipoUsuario())) {
		case 5: // Supervisor
		case 3: // Consultor
			strQuery = "idAnhio = ?1  and ?2 = ?2 ";
			break;

		default:
			break;
		}

		MensajePersonalizado<RespuestaReporteSeguimientoDTO> respuesta = new MensajePersonalizado<RespuestaReporteSeguimientoDTO>();

		List<CatMasterCatalogo> unidadAdministrativa = masterCatalogoRepositorio
				.find("idCatalogo = ?1", unidadUsuarios.get().getIdCatalogoUnidad()).list();
		if (unidadAdministrativa == null) {
			respuesta.setCodigo("500");
			respuesta.setMensaje("Error unidad no valida.");
		}


		List<ProductoAvance> listaSeguimiento = new ArrayList<ProductoAvance>();
		var productosAvanzadosEnGral = seguimientoGralRepository
				.find(strQuery, anhio,unidadAdministrativa.get(0).getIdCatalogo()).list();
		if (productosAvanzadosEnGral == null) {
			respuesta.setCodigo("200");
			respuesta.setMensaje("No hay información para esta consulta.");
		}
		var productosAvanzados = seguimientoRepository
				.find(strQuery, anhio,unidadAdministrativa.get(0).getIdCatalogo()).list();
		if (productosAvanzados == null) {
			respuesta.setCodigo("200");
			respuesta.setMensaje("No hay información del trimestre para esta consulta.");
		}
		if (productosAvanzados != null)
			listaSeguimiento.addAll(productosAvanzados);
		
		Integer totalProductoCumplidos =0;
		try {
			for (var avance:productosAvanzadosEnGral) {
				if (avance.getCumplido() != null)
					totalProductoCumplidos+=avance.getCumplido();
			}
			//totalProductoCumplidos = productosAvanzadosEnGral.stream().filter(avance -> avance.getCumplido() >= 1).map(x -> x.getCumplido()).collect(Collectors.summingInt(Integer::intValue));	
		}catch (Exception e) {
			// TODO: handle exception
			Log.info("No hay productos cumplidos");
		}
		
		var productosCancelados = 0;
		var totalProductosCancelados = 0;
		
		/*Recupear numeros de trimestres*/
		List<ProductoAvanceTrimestre> productosAvanceTrimestral = productoAvanceTrimestreRepository.find(strQuery, anhio,unidadAdministrativa.get(0).getIdCatalogo()).list();

		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		
		
		
		RespuestaReporteSeguimientoDTO seguimientoDTO = new RespuestaReporteSeguimientoDTO();
		seguimientoDTO.setTotalProductosCumplidos(Integer.valueOf((int) totalProductoCumplidos));
		seguimientoDTO.setTotalProductosCancelados(Integer.valueOf((int) totalProductosCancelados));

		List<SeguimientoSemestre> primerSemestre = new ArrayList<SeguimientoSemestre>();
		List<SeguimientoSemestre> segundoSemestre = new ArrayList<SeguimientoSemestre>();
		List<SeguimientoSemestre> tercerSemestre = new ArrayList<SeguimientoSemestre>();
		List<SeguimientoSemestre> cuartoSemestre = new ArrayList<SeguimientoSemestre>();
		
		/*
		 * Calcular el trimestre valido de consulta según la fecha actual
		 */
		LocalDate fechaActual = LocalDate.now();

		int iMaxTrimestre = 1 + (fechaActual.getMonthValue() / 3);
		
		
		var lstProductoC = productosAvanceTrimestral.stream().filter(x -> x.getCumplido() && x.getIxTrimestre()==1).toList();
		var lstProductoCN = productosAvanceTrimestral.stream().filter(x -> x.getNocumplido() && x.getIxTrimestre()==1).toList();
		var lstProductoPC = productosAvanceTrimestral.stream().filter(x -> x.getParcialcumplido() && x.getIxTrimestre()==1).toList();
		var lstProductoS = productosAvanceTrimestral.stream().filter(x -> x.getSuperado() && x.getIxTrimestre()==1).toList();
		
		primerSemestre.add(new SeguimientoSemestre(lstProductoC.size(), "Cumplido"));
		primerSemestre.add(new SeguimientoSemestre(lstProductoCN.size(), "NoCumplido"));
		primerSemestre.add(new SeguimientoSemestre(lstProductoPC.size(), "ParcialmenteCumplido"));
		primerSemestre.add(new SeguimientoSemestre(lstProductoS.size(), "Superado"));
		primerSemestre.add(new SeguimientoSemestre(0, "Cancelado"));
		
		var lstProducto2C = productosAvanceTrimestral.stream().filter(x -> x.getCumplido() && x.getIxTrimestre()==2).toList();
		var lstProducto2CN = productosAvanceTrimestral.stream().filter(x -> x.getNocumplido() && x.getIxTrimestre()==2).toList();
		var lstProducto2PC = productosAvanceTrimestral.stream().filter(x -> x.getParcialcumplido() && x.getIxTrimestre()==2).toList();
		var lstProducto2S = productosAvanceTrimestral.stream().filter(x -> x.getSuperado() && x.getIxTrimestre()==2).toList();
		var lstProducto2Ca = productosAvanceTrimestral.stream().filter(x -> x.getSuperado() && x.getIxTrimestre()==2).toList();
		segundoSemestre.add(new SeguimientoSemestre(lstProducto2C.size(), "Cumplido"));
		segundoSemestre.add(new SeguimientoSemestre(lstProducto2CN.size(), "NoCumplido"));
		segundoSemestre.add(new SeguimientoSemestre(lstProducto2PC.size(), "ParcialmenteCumplido"));
		segundoSemestre.add(new SeguimientoSemestre(lstProducto2S.size(), "Superado"));
		segundoSemestre.add(new SeguimientoSemestre(0, "Cancelado"));

		var lstProducto3C = productosAvanceTrimestral.stream().filter(x -> x.getCumplido() && x.getIxTrimestre()==3).toList();
		var lstProducto3CN = productosAvanceTrimestral.stream().filter(x -> x.getNocumplido() && x.getIxTrimestre()==3).toList();
		var lstProducto3PC = productosAvanceTrimestral.stream().filter(x -> x.getParcialcumplido() && x.getIxTrimestre()==3).toList();
		var lstProducto3S = productosAvanceTrimestral.stream().filter(x -> x.getSuperado() && x.getIxTrimestre()==3).toList();
		var lstProducto3Ca = productosAvanceTrimestral.stream().filter(x -> x.getSuperado() && x.getIxTrimestre()==3).toList();
		tercerSemestre.add(new SeguimientoSemestre(lstProducto3C.size(), "Cumplido"));
		tercerSemestre.add(new SeguimientoSemestre(lstProducto3CN.size(), "NoCumplido"));
		tercerSemestre.add(new SeguimientoSemestre(lstProducto3PC.size(), "ParcialmenteCumplido"));
		tercerSemestre.add(new SeguimientoSemestre(lstProducto3S.size(), "Superado"));
		tercerSemestre.add(new SeguimientoSemestre(0, "Cancelado"));

		
		var lstProducto4C = productosAvanceTrimestral.stream().filter(x -> x.getCumplido() && x.getIxTrimestre()==4).toList();
		var lstProducto4CN = productosAvanceTrimestral.stream().filter(x -> x.getNocumplido() && x.getIxTrimestre()==4).toList();
		var lstProducto4PC = productosAvanceTrimestral.stream().filter(x -> x.getParcialcumplido() && x.getIxTrimestre()==4).toList();
		var lstProducto4S = productosAvanceTrimestral.stream().filter(x -> x.getSuperado() && x.getIxTrimestre()==4).toList();
		var lstProducto4Ca = productosAvanceTrimestral.stream().filter(x -> x.getSuperado() && x.getIxTrimestre()==4).toList();
		cuartoSemestre.add(new SeguimientoSemestre(lstProducto4C.size(), "Cumplido"));
		cuartoSemestre.add(new SeguimientoSemestre(lstProducto4CN.size(), "NoCumplido"));
		cuartoSemestre.add(new SeguimientoSemestre(lstProducto4PC.size(), "ParcialmenteCumplido"));
		cuartoSemestre.add(new SeguimientoSemestre(lstProducto4S.size(), "Superado"));
		cuartoSemestre.add(new SeguimientoSemestre(0, "Cancelado"));

		seguimientoDTO.setPrimerTrimestre(primerSemestre);
		seguimientoDTO.setSegundoTrimestre(segundoSemestre);
		seguimientoDTO.setTercerTrimestre(tercerSemestre);
		seguimientoDTO.setCuartoTrimestre(cuartoSemestre);

		respuesta.setRespuesta(seguimientoDTO);
		return respuesta;
	}

	public List<ListadoSeguimientoReportes> calcularTrimestre(List<vt_producto_sumatiroa> calendario) {
		List<ListadoSeguimientoReportes> calendarioallenar = new ArrayList<ListadoSeguimientoReportes>();
		List<vt_producto_sumatiroa> primerSemestre = new ArrayList<vt_producto_sumatiroa>();
		List<vt_producto_sumatiroa> segundoSemestre = new ArrayList<vt_producto_sumatiroa>();
		List<vt_producto_sumatiroa> tercerSemestre = new ArrayList<vt_producto_sumatiroa>();
		List<vt_producto_sumatiroa> cuartoSemestre = new ArrayList<vt_producto_sumatiroa>();
		for (var item : calendario) {
			if (1 == item.getId().getIxTrimestre()) {
				primerSemestre.add(item);
			}
			if (2 == item.getId().getIxTrimestre()) {
				segundoSemestre.add(item);
			}
			if (3 == item.getId().getIxTrimestre()) {
				tercerSemestre.add(item);
			}
			if (4 == item.getId().getIxTrimestre()) {
				cuartoSemestre.add(item);
			}

		}

		calendarioallenar
				.add(new ListadoSeguimientoReportes(primerSemestre, segundoSemestre, tercerSemestre, cuartoSemestre));
		return calendarioallenar;
	}

	public List<ListadoSeguimientoReportes> calcularProductos(List<ListadoSeguimientoReportes> lista) {
		List<ListadoSeguimientoReportes> completo = new ArrayList<ListadoSeguimientoReportes>();
		List<vt_producto_sumatiroa> calendarioListPrimero = new ArrayList<vt_producto_sumatiroa>();
		List<vt_producto_sumatiroa> calendarioListSegundo = new ArrayList<vt_producto_sumatiroa>();
		List<vt_producto_sumatiroa> calendarioListTercero = new ArrayList<vt_producto_sumatiroa>();
		List<vt_producto_sumatiroa> calendarioListCuarto = new ArrayList<vt_producto_sumatiroa>();

		for (ListadoSeguimientoReportes listadoSeguimientoReportes : lista) {
			for (vt_producto_sumatiroa calendario1 : listadoSeguimientoReportes.getPrimerTrimestre()) {
				calendarioListPrimero.add(calendario1);
			}
			for (vt_producto_sumatiroa calendario2 : listadoSeguimientoReportes.getSegundoTrimestre()) {
				calendarioListSegundo.add(calendario2);
			}
			for (vt_producto_sumatiroa calendario3 : listadoSeguimientoReportes.getTercerTrimestre()) {
				calendarioListTercero.add(calendario3);
			}
			for (vt_producto_sumatiroa calendario4 : listadoSeguimientoReportes.getCuartoTrimestre()) {
				calendarioListCuarto.add(calendario4);
			}
		}

		completo.add(new ListadoSeguimientoReportes(calendarioListPrimero, calendarioListSegundo, calendarioListTercero,
				calendarioListCuarto));
		return completo;
	}

	@Override
	public MensajePersonalizado<RespuestaReportePresupuestoDTO> presupuestoGeneral(int anhio, String cveUsuario) {
		// presupuestoRepository.consultaPorCsEstatus("");
		MensajePersonalizado<RespuestaReportePresupuestoDTO> respuesta = new MensajePersonalizado<RespuestaReportePresupuestoDTO>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		RespuestaReportePresupuestoDTO presupuestoDTO = new RespuestaReportePresupuestoDTO();

		Usuario usuario = usuarioRepository.findById(cveUsuario);
		Integer idTipoUsuario = usuario.getTipoUsuario().getIdTipoUsuario();
		Integer idUnidad = usuario.getPerfilLaboral().get(0).getIdCatalogoUnidad();
		List<PresupuestoUnidad> presupuestoUnidad = new ArrayList<PresupuestoUnidad>();
		List<PresupuestoProyecto> presupuestoProyectos = new ArrayList<PresupuestoProyecto>();

		if ((TipoUsuarioEnum.CONSULTOR.getIdTipoUsuario() == idTipoUsuario
				|| TipoUsuarioEnum.ADMINISTRADOR.getIdTipoUsuario() == idTipoUsuario
				|| TipoUsuarioEnum.SUPERVISOR.getIdTipoUsuario() == idTipoUsuario
				|| TipoUsuarioEnum.SUPERUSUARIO.getIdTipoUsuario() == idTipoUsuario))
		//
		{
			presupuestoUnidad = presupuestoUnidadRepository.consultaPorAnhio(anhio);
			presupuestoProyectos = presupuestoProyectoRepository.consultaPorAnhio(anhio);
		} else {
			presupuestoUnidad = presupuestoUnidadRepository.consultaPorAnhioUnidad(anhio, idUnidad);
			presupuestoProyectos = presupuestoProyectoRepository.consultaPorAnhioUnidad(anhio, idUnidad);
		}
		var presupuestoUnidadVo = presupuestoUnidad.stream().map(presupuesto -> {
			var presupuestoUnidadMapeado = new PresupuestoUnidadDTO();
			presupuestoUnidadMapeado.setIdAnhio(presupuesto.getIdAnhio());
			presupuestoUnidadMapeado.setCvUnidad(presupuesto.getCveUnidad());
			presupuestoUnidadMapeado.setTotalCalendarizado(presupuesto.getTotalCalendarizado());
			presupuestoUnidadMapeado.setTotalAnualAsignado(presupuesto.getTotalAnualAsignado());
			Log.info(presupuesto.getTotalCalendarizado());
			Log.info(presupuesto.getTotalAnualAsignado());
			presupuestoUnidadMapeado.setIdUnidad(presupuesto.getIdUnidad());
			presupuestoUnidadMapeado.setCcExternaDos(presupuesto.getCcExternaDos());
			Log.info("getIdUnidad:" + presupuesto.getIdUnidad());
			Log.info("getCcExternaDos:" + presupuesto.getCcExternaDos());
			return presupuestoUnidadMapeado;
		}).toList();
		var presupuestoAnualTotal = presupuestoUnidad.stream().mapToDouble(PresupuestoUnidad::getTotalAnualAsignado)
				.sum();
		Log.info(presupuestoAnualTotal);

		presupuestoDTO.setPresupuestoAsignado(presupuestoAnualTotal);

		presupuestoDTO.setPresupuestoUnidad(presupuestoUnidadVo);
		Log.info("Proyecto - presupuesto");
		var presupuestosVO = presupuestoProyectos.stream().map(presupuestoProyecto -> {
			var presupuestoMapeado = new PresupuestoProyectoDTO();
			presupuestoMapeado.setIdAnhio(presupuestoProyecto.getIdAnhio());
			presupuestoMapeado.setCveUnidad(presupuestoProyecto.getCveUnidad());
			presupuestoMapeado.setCxNombreProyecto(presupuestoProyecto.getCxNombreProyecto());
			presupuestoMapeado.setTotalCalendarizado(presupuestoProyecto.getTotalCalendarizado());
			presupuestoMapeado.setTotalAnualASignado(presupuestoProyecto.getTotalAnualAsignado());
			Log.info("getTotalCalendarizado " + presupuestoProyecto.getTotalCalendarizado());
			Log.info("getTotalAnualAsignado " + presupuestoProyecto.getTotalAnualAsignado());
			presupuestoMapeado.setIdUnidad(presupuestoProyecto.getIdUnidad());
			return presupuestoMapeado;
		}).toList();

		presupuestoDTO.setPresupuestoProyectos(presupuestosVO);
		respuesta.setRespuesta(presupuestoDTO);
		return respuesta;
	}

	public MensajePersonalizado<List<PAAAprobadoDTO>> consultarPAAAprobados(PeticionPAAA peticionPAAA) {
		MensajePersonalizado<List<PAAAprobadoDTO>> respuesta = new MensajePersonalizado<List<PAAAprobadoDTO>>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		List<PAAAprobadoDTO> lstPAAAprobados = convert(
				paaAprobadoRepository.find("idAnhio", peticionPAAA.getIdAnhio()).list());
		respuesta.setRespuesta(lstPAAAprobados);
		return respuesta;
	}

	private List<PAAAprobadoDTO> convert(List<PAAAprobado> lstPAAAprobados) {
		// TODO Auto-generated method stub
		return lstPAAAprobados.stream().map(paaAprobado -> mapperDTO().map(paaAprobado, PAAAprobadoDTO.class))
				.collect(Collectors.toList());
	}

	private ModelMapper mapperDTO() {
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.map(PAAAprobado.class, PAAAprobadoDTO.class);
		return modelMapper;
	}

	private PAAAprobado covert(PAAAprobadoDTO paaAprobadoDto) {
		ModelMapper modelMapper = new ModelMapper();
		PAAAprobado paaAprobado = modelMapper.map(paaAprobadoDto, PAAAprobado.class);
		return paaAprobado;
	}
}
