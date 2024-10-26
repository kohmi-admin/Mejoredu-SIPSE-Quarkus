package mx.sep.dgtic.sipse.presupuestal.service.impl;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPorID;
import mx.edu.sep.dgtic.mejoredu.presupuestales.*;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.sipse.presupuestal.dao.*;
import mx.sep.dgtic.sipse.presupuestal.entity.Archivo;
import mx.sep.dgtic.sipse.presupuestal.entity.FichaIndicadores;
import mx.sep.dgtic.sipse.presupuestal.entity.IndicadorPrograma;
import mx.sep.dgtic.sipse.presupuestal.entity.MetValidacionEntity;
import mx.sep.dgtic.sipse.presupuestal.entity.ProgramaPresupuestal;
import mx.sep.dgtic.sipse.presupuestal.service.DatosGeneralesService;
import mx.sep.dgtic.sipse.presupuestal.service.ProgramasPresupuestalesService;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ProgramasPresupuestalesServiceImpl implements ProgramasPresupuestalesService {
	@ConfigProperty(name = "programa_presupuestal.m001")
	private Integer ID_M001;
	@ConfigProperty(name = "programa_presupuestal.o001")
	private Integer ID_O001;
	@Inject
	private ProgramaPresupuestalRepository programaPresupuestalRepository;
	@Inject
	private MasterCatalogoRepository masterCatalogoRepository;
	@Inject
	private ArchivoRepository archivoRepository;
	@Inject
	private FichaIndicadoresRepository fichaIndicadoresRepository;
	@Inject
	private IndicadorProgramaRepository indicadorProgramaRepository;

	@Inject
	private MetValidacionRepository metValidacionRepository;

	@Inject
	private UsuarioRepository usuarioRepository;

	@Inject
	private DatosGeneralesService datosGeneralesService;

	@Override
	public List<RespuestaProgramaPresupuestalVO> consultaPorAnhio(int anho, boolean consultarArchivos) {
		var lista = programaPresupuestalRepository.findByAnho(anho);

		RespuestaM001VO respuestaM001 = consultarArchivos ? consultarM001PorAnhio(anho) : null;
		RespuestaM001VO respuestaO001 = consultarArchivos ? consultarO001PorAnhio(anho) : null;
		RespuestaDatosGeneralesVO respuestaDatosGenerales = consultarArchivos ?
				datosGeneralesService.consultarPorAnho(anho) : null;


		return lista.stream().map(programa -> {
			var programaVo = new RespuestaProgramaPresupuestalVO();
			programaVo.setIdProgramaPresupuestal(programa.getIdPresupuestal());
			var catalogo = masterCatalogoRepository.findById(programa.getIdTipoPrograma());
			programaVo.setClave(catalogo.getCcExterna());
			programaVo.setAprobado(programa.getDfAprobacion() != null);
			programaVo.setFechaRegistro(programa.getDfRegistro());
			programaVo.setFechaActualizacion(programa.getDfActualizacion());
			programaVo.setFechaAprobacion(programa.getDfAprobacion());
			if (Objects.nonNull(programa.getCsEstatus()))
				programaVo.setEstatusGeneral(programa.getCsEstatus());
			if (Objects.nonNull(programa.getIdValidacion()))
				programaVo.setEstatusPresupuestal(
						metValidacionRepository.findById(programa.getIdValidacion()).getCsEstatus());
			if (Objects.nonNull(programa.getIdValidacionPlaneacion()))
				programaVo.setEstatusPlaneacion(
						metValidacionRepository.findById(programa.getIdValidacionPlaneacion()).getCsEstatus());
			if (Objects.nonNull(programa.getIdValidacionSupervisor()))
				programaVo.setEstatusSupervisor(
						metValidacionRepository.findById(programa.getIdValidacionSupervisor()).getCsEstatus());

			programaVo.setArchivos(Collections.emptyList());

			if (Objects.nonNull(respuestaM001) &&
					respuestaM001.getIdProgramaPresupuestal().equals(programaVo.getIdProgramaPresupuestal()))
				programaVo.setArchivos(respuestaM001.getArchivos());

			else if (Objects.nonNull(respuestaO001) &&
					respuestaO001.getIdProgramaPresupuestal().equals(programaVo.getIdProgramaPresupuestal()))
				programaVo.setArchivos(respuestaO001.getArchivos());

			else if (Objects.nonNull(respuestaDatosGenerales) &&
					programaVo.getArchivos().isEmpty())
				programaVo.setArchivos(respuestaDatosGenerales.getArchivos());

			return programaVo;
		}).toList();
	}

	@Override
	public RespuestaProgramaPresupuestalVO consultaPorId(int id) {
		var programa = programaPresupuestalRepository.findByIdOptional(id).orElseThrow(() -> {
			throw new RuntimeException("No se encontró el programa presupuestal con id: " + id);
		});

		var catalogo = masterCatalogoRepository.findById(programa.getIdTipoPrograma());

		var vo = new RespuestaProgramaPresupuestalVO();
		vo.setIdProgramaPresupuestal(programa.getIdPresupuestal());
		vo.setClave(catalogo.getCcExterna());
		vo.setAprobado(programa.getDfAprobacion() != null);
		vo.setFechaRegistro(programa.getDfRegistro());
		vo.setFechaActualizacion(programa.getDfActualizacion());
		vo.setFechaAprobacion(programa.getDfAprobacion());

		if (Objects.nonNull(programa.getCsEstatus()))
			vo.setEstatusGeneral(programa.getCsEstatus());
		if (Objects.nonNull(programa.getIdValidacion()))
			vo.setEstatusPresupuestal(metValidacionRepository.findById(programa.getIdValidacion()).getCsEstatus());
		if (Objects.nonNull(programa.getIdValidacionPlaneacion()))
			vo.setEstatusPlaneacion(
					metValidacionRepository.findById(programa.getIdValidacionPlaneacion()).getCsEstatus());
		if (Objects.nonNull(programa.getIdValidacionSupervisor()))
			vo.setEstatusSupervisor(
					metValidacionRepository.findById(programa.getIdValidacionSupervisor()).getCsEstatus());
		return vo;
	}

	@Override
	public RespuestaM001VO consultaPorIdM001(int id) {
		var programa = programaPresupuestalRepository.findByIdOptional(id).orElseThrow(() -> {
			throw new NotFoundException("No se encontró el programa presupuestal con id: " + id);
		});

		var indicadorPrograma = indicadorProgramaRepository.findByIdProgramaPresupuestal(programa.getIdPresupuestal())
				.orElseThrow(() -> {
					throw new NotFoundException("No se encontró el indicador para el programa con id: " + id);
				});

		var fichaIndicador = fichaIndicadoresRepository.findByIdOptional(indicadorPrograma.getIdFichaIndicadores())
				.orElseThrow(() -> {
					throw new NotFoundException("No se encontró la ficha indicador para el programa con id: " + id);
				});

		return entitiesToVO(programa, indicadorPrograma, fichaIndicador);
	}

	@Override
	public RespuestaM001VO consultarM001PorAnhio(int anhio) {
		var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(anhio, ID_M001)
				.orElseThrow(() -> {
					throw new NotFoundException("No se encontró el programa presupuestal con anhio: " + anhio);
				});

		var indicadorPrograma = indicadorProgramaRepository.findByIdProgramaPresupuestal(programa.getIdPresupuestal())
				.orElseThrow(() -> {
					throw new NotFoundException(
							"No se encontró el indicador para el programa con id: " + programa.getIdPresupuestal());
				});

		var fichaIndicador = fichaIndicadoresRepository.findByIdOptional(indicadorPrograma.getIdFichaIndicadores())
				.orElseThrow(() -> {
					throw new NotFoundException("No se encontró la ficha indicador para el programa con id: "
							+ programa.getIdPresupuestal());
				});

		return entitiesToVO(programa, indicadorPrograma, fichaIndicador);
	}

	@Override
	public RespuestaM001VO consultaPorIdO001(int id) {
		var programa = programaPresupuestalRepository.findByIdOptional(id).orElseThrow(() -> {
			throw new NotFoundException("No se encontró el programa presupuestal con id: " + id);
		});

		var indicadorPrograma = indicadorProgramaRepository.findByIdProgramaPresupuestal(programa.getIdPresupuestal())
				.orElseThrow(() -> {
					throw new NotFoundException("No se encontró el indicador para el programa con id: " + id);
				});

		var fichaIndicador = fichaIndicadoresRepository.findByIdOptional(indicadorPrograma.getIdFichaIndicadores())
				.orElseThrow(() -> {
					throw new NotFoundException("No se encontró la ficha indicador para el programa con id: " + id);
				});

		return entitiesToVO(programa, indicadorPrograma, fichaIndicador);
	}

	@Override
	public RespuestaM001VO consultarO001PorAnhio(int anhio) {
		var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(anhio, ID_O001)
				.orElseThrow(() -> {
					throw new NotFoundException("No se encontró el programa presupuestal con anhio: " + anhio);
				});

		var indicadorPrograma = indicadorProgramaRepository.findByIdProgramaPresupuestal(programa.getIdPresupuestal())
				.orElseThrow(() -> {
					throw new NotFoundException(
							"No se encontró el indicador para el programa con id: " + programa.getIdPresupuestal());
				});

		var fichaIndicador = fichaIndicadoresRepository.findByIdOptional(indicadorPrograma.getIdFichaIndicadores())
				.orElseThrow(() -> {
					throw new NotFoundException("No se encontró la ficha indicador para el programa con id: "
							+ programa.getIdPresupuestal());
				});

		return entitiesToVO(programa, indicadorPrograma, fichaIndicador);
	}

	@Override
	@Transactional
	public void registrarM001(PeticionM001VO programaPeticion) {
		createOrUpdateProgramaIndicador(programaPeticion, ID_M001);
	}

	@Override
	@Transactional
	public void registrarO001(PeticionM001VO programa) {
		createOrUpdateProgramaIndicador(programa, ID_O001);
	}

	@Override
	@Transactional
	public void eliminar(int id) {
		var programa = programaPresupuestalRepository.findByIdOptional(id)
				.orElseThrow(() -> new NotFoundException("No se encontró el programa presupuestal con el id: " + id));

		programa.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
		programaPresupuestalRepository.persist(programa);
	}

	@Override
	@Transactional
	public void enviarRevision(PeticionPorID peticionPorID) {
		var programa = programaPresupuestalRepository.findByIdOptional(peticionPorID.getId())
				.orElseThrow(() -> new NotFoundException(
						"No se encontró el programa presupuestal con el id: " + peticionPorID.getId()));

		programa.setCveUsuario(peticionPorID.getUsuario());
		programa.setCsEstatus(EstatusEnum.PORREVISAR.getEstatus());
		programaPresupuestalRepository.persist(programa);

		// Cambiar el estatus de presupuesto a P
		if (programa.getIdValidacion() != null) {
			this.cambiarEstatusValidacion(programa.getIdValidacion(), EstatusEnum.PORREVISAR,
					peticionPorID.getUsuario());

		}
		// Cambiar el estatus de planeación a P
		if (programa.getIdValidacionPlaneacion() != null) {
			this.cambiarEstatusValidacion(programa.getIdValidacionPlaneacion(), EstatusEnum.PORREVISAR,
					peticionPorID.getUsuario());

		}
		// Cambiar el estatus de supervisor a P
		if (programa.getIdValidacionSupervisor() != null) {
			this.cambiarEstatusValidacion(programa.getIdValidacionSupervisor(), EstatusEnum.PORREVISAR,
					peticionPorID.getUsuario());

		}
	}

	@Override
	public void enviarValidacionTecnica(PeticionPorID peticionPorID) {
		var programa = programaPresupuestalRepository.findByIdOptional(peticionPorID.getId())
				.orElseThrow(() -> new NotFoundException(
						"No se encontró el programa presupuestal con el id: " + peticionPorID.getId()));

		programa.setCveUsuario(peticionPorID.getUsuario());
		programa.setCsEstatus(EstatusEnum.VALIDACIONTECNICA.getEstatus());

		programaPresupuestalRepository.persist(programa);
	}

	@Override
	@Transactional
	public void finalizarRegistro(PeticionPorID peticionPorID) {
		var programa = programaPresupuestalRepository.findByIdOptional(peticionPorID.getId())
				.orElseThrow(() -> new NotFoundException(
						"No se encontró el programa presupuestal con el id: " + peticionPorID.getId()));

		programa.setCveUsuario(peticionPorID.getUsuario());
		programa.setCsEstatus(EstatusEnum.FINALIZADO.getEstatus());

		programaPresupuestalRepository.persist(programa);
	}

	@Transactional
	public void cambiarEstatusValidacion(Integer idValidacion, EstatusEnum estatus, String usuario) {
		if (idValidacion != null) {
			MetValidacionEntity validacion = metValidacionRepository.findById(idValidacion);
			if (validacion != null) {
				validacion.setCsEstatus(estatus.getEstatus());
				validacion.setCveUsuarioActualiza(usuario);
				metValidacionRepository.persistAndFlush(validacion);

			}
		}

	}

	private RespuestaM001VO entitiesToVO(ProgramaPresupuestal programa, IndicadorPrograma indicadorPrograma,
			FichaIndicadores fichaIndicadores) {

		var vo = new RespuestaM001VO();

		if (Objects.nonNull(programa.getCsEstatus()))
			vo.setEstatusGeneral(programa.getCsEstatus());
		if (Objects.nonNull(programa.getIdValidacion()))
			vo.setEstatusPresupuestal(metValidacionRepository.findById(programa.getIdValidacion()).getCsEstatus());
		if (Objects.nonNull(programa.getIdValidacionPlaneacion()))
			vo.setEstatusPlaneacion(
					metValidacionRepository.findById(programa.getIdValidacionPlaneacion()).getCsEstatus());
		if (Objects.nonNull(programa.getIdValidacionSupervisor()))
			vo.setEstatusSupervisor(
					metValidacionRepository.findById(programa.getIdValidacionSupervisor()).getCsEstatus());

		var archivosVo = programa.getArchivos().stream().map(it -> {
			var archivoVO = new ArchivoDTO();

			archivoVO.setIdArchivo(it.getIdArchivo());
			archivoVO.setCxNombre(it.getCxNombre());
			archivoVO.setCxUuid(it.getCxUuid());
			archivoVO.setDfFechaCarga(it.getDfFechaCarga());
			archivoVO.setDfHoraCarga(it.getDhHoraCarga());
			archivoVO.setCsEstatus(it.getCsEstatus());
			archivoVO.setCveUsuario(it.getCveUsuario());
			archivoVO.setCxUuidToPdf(it.getCxUuidToPdf());

			return archivoVO;
		}).toList();

		vo.setIdProgramaPresupuestal(programa.getIdPresupuestal());
		vo.setIdTipoPrograma(programa.getIdTipoPrograma());
		vo.setArchivos(archivosVo);
		vo.setIdRamoSector(indicadorPrograma.getIdRamoSector());
		vo.setIdUnidadResponsable(indicadorPrograma.getIdUnidadResponsable());
		vo.setCveUsuario(programa.getCveUsuario());
		vo.setIdAnhio(programa.getIdAnhio());
		vo.setNombrePrograma(indicadorPrograma.getCxNombrePrograma());
		vo.setIdVinculacionODS(indicadorPrograma.getIdVinculacionOds());

		var datosGenerales = new DatosGeneralesIndicadorVO();
		datosGenerales.setNombreIndicador(fichaIndicadores.getCxNombreIndicador());
		datosGenerales.setIdDimensionMedicion(fichaIndicadores.getIdDimension());
		datosGenerales.setIdTipoIndicador(fichaIndicadores.getIdTipoIndicador());
		datosGenerales.setDefinicionIndicador(fichaIndicadores.getCxDefinicionIndicador());
		datosGenerales.setMetodoCalculo(fichaIndicadores.getCxMetodoCalculoIndicador());
		datosGenerales.setIdUnidadMedida(fichaIndicadores.getIdUnidadMedida());
		datosGenerales.setUnidadMedidaDescubrir(fichaIndicadores.getCxUnidadMedidaDescubrir());
		datosGenerales.setUnidadAbsoluta(fichaIndicadores.getCxUnidadAbsoluta());
		datosGenerales.setIdTipoMedicion(fichaIndicadores.getIdTipoMedicion());
		datosGenerales.setTipoMedicionDescubrir(fichaIndicadores.getCxDescubrirTipoMedicion());
		datosGenerales.setIdFrecuenciaMedicion(fichaIndicadores.getIdFrecuenciaMedicion());
		datosGenerales.setFrecuenciaMedicionDescubrir(fichaIndicadores.getCxDescubrirFrecuenciaMedicion());
		datosGenerales.setNumerador(fichaIndicadores.getCxNumerador());
		datosGenerales.setDenominador(fichaIndicadores.getCxDenominador());
		datosGenerales.setMeta(fichaIndicadores.getCxMeta());

		var lineaBase = new LineaBaseVO();
		lineaBase.setValorBase(fichaIndicadores.getCxValorBase());
		lineaBase.setPeriodo(fichaIndicadores.getCxPeriodoBase());
		lineaBase.setIdAnhio(fichaIndicadores.getIdAnhioBase());

		var metaAnual = new MetaAnualVO();
		metaAnual.setValorAnual(fichaIndicadores.getCxValorMeta());
		metaAnual.setIdAnhio(fichaIndicadores.getIdAnhioMeta());
		metaAnual.setPeriodoCumplimiento(fichaIndicadores.getCxPeriodoMeta());
		metaAnual.setMedioVerificacion(fichaIndicadores.getCxMedioVerificacion());

		var caracteristicasVariables = new CaracteristicasVariablesIndicadorVO();
		caracteristicasVariables.setNombreVariable(fichaIndicadores.getCxNombreVariable());
		caracteristicasVariables.setDescripcionVariable(fichaIndicadores.getCxDescripcionVariable());
		caracteristicasVariables.setFuenteInformacion(fichaIndicadores.getCxFuenteInformacion());
		caracteristicasVariables.setUnidadMedida(fichaIndicadores.getCxUnidadMedida());
		caracteristicasVariables.setFrecuenciaMedicion(fichaIndicadores.getCxFrecuenciaMedicion());
		caracteristicasVariables.setMetodoRecoleccion(fichaIndicadores.getCxMetodoRecoleccion());
		caracteristicasVariables.setIdComportamientoIndicador(fichaIndicadores.getIdComportamientoIndicador());
		caracteristicasVariables.setIdComportamientoMedicion(fichaIndicadores.getIdComportamientoMedicion());
		caracteristicasVariables.setIdTipoValor(fichaIndicadores.getIdTipoValor());
		caracteristicasVariables.setIdDesagregacion(fichaIndicadores.getIdDesagregacionGeografica());
		caracteristicasVariables.setDescripcionVinculacion(fichaIndicadores.getCxDescripcionVinculacion());

		vo.setDatosGenerales(datosGenerales);
		vo.setLineaBase(lineaBase);
		vo.setMetaAnual(metaAnual);
		vo.setCaracteristicasVariables(caracteristicasVariables);

		return vo;
	}

	private void createOrUpdateProgramaIndicador(PeticionM001VO programaPeticion, Integer idTipoPrograma) {
		var programa = programaPresupuestalRepository
				.findByAnhoPlaneacionAndTipoPrograma(programaPeticion.getIdAnhio(), idTipoPrograma).orElseGet(() -> {
					var programaPresupuestal = new ProgramaPresupuestal();
					programaPresupuestal.setIdTipoPrograma(idTipoPrograma);
					programaPresupuestal.setIdAnhio(programaPeticion.getIdAnhio());
					programaPresupuestal.setCsEstatus("A");
					return programaPresupuestal;
				});

		programa.setCveUsuario(programaPeticion.getCveUsuario());
		programa.getArchivos().clear();
		programaPeticion.getArchivos().forEach(archivo -> {
			var archivoVO = archivoRepository.consultarPorUUID(archivo.getUuid()).orElseGet(() -> {
				var nuevoArchivo = new Archivo();
				nuevoArchivo.setCxNombre(archivo.getNombre());
				nuevoArchivo.setCxUuid(archivo.getUuid());
				nuevoArchivo.setIdTipoDocumento(archivo.getTipoArchivo());
				nuevoArchivo.setDfFechaCarga(LocalDate.now());
				nuevoArchivo.setDhHoraCarga(LocalTime.now());
				nuevoArchivo.setCsEstatus("A");
				nuevoArchivo.setCveUsuario(programaPeticion.getCveUsuario());

				archivoRepository.persist(nuevoArchivo);
				return nuevoArchivo;
			});
			programa.getArchivos().add(archivoVO);
		});

		programaPresupuestalRepository.persistAndFlush(programa);

		// Ya cree el programa, falta el indicador y luego indicador programa
		var indicadorPrograma = indicadorProgramaRepository.findByIdProgramaPresupuestal(programa.getIdPresupuestal());
		if (indicadorPrograma.isEmpty()) {
			// Crearlo
			var fichaIndicador = new FichaIndicadores();
			updateFichaIndicador(fichaIndicador, programaPeticion);
			fichaIndicadoresRepository.persistAndFlush(fichaIndicador);

			Log.info("Creando indicador programa" + fichaIndicador.getIdFichaIndicadores());

			var nuevoIndicadorPrograma = new IndicadorPrograma();
			nuevoIndicadorPrograma.setIdFichaIndicadores(fichaIndicador.getIdFichaIndicadores());
			nuevoIndicadorPrograma.setIdPresupuestal(programa.getIdPresupuestal());
			nuevoIndicadorPrograma.setCxNombrePrograma(programaPeticion.getNombrePrograma());
			nuevoIndicadorPrograma.setIdVinculacionOds(programaPeticion.getIdVinculacionODS());
			nuevoIndicadorPrograma.setIdRamoSector(programaPeticion.getIdRamoSector());
			nuevoIndicadorPrograma.setIdUnidadResponsable(programaPeticion.getIdUnidadResponsable());

			indicadorProgramaRepository.persist(nuevoIndicadorPrograma);
		} else {
			// Actualizarlo
			var fichaIndicador = fichaIndicadoresRepository.findById(indicadorPrograma.get().getIdFichaIndicadores());
			updateFichaIndicador(fichaIndicador, programaPeticion);
			fichaIndicadoresRepository.persistAndFlush(fichaIndicador);

			Log.info("Actualizando indicador programa" + fichaIndicador.getIdFichaIndicadores());

			indicadorPrograma.get().setIdFichaIndicadores(fichaIndicador.getIdFichaIndicadores());
			indicadorPrograma.get().setCxNombrePrograma(programaPeticion.getNombrePrograma());
			indicadorPrograma.get().setIdVinculacionOds(programaPeticion.getIdVinculacionODS());
			indicadorPrograma.get().setIdRamoSector(programaPeticion.getIdRamoSector());
			indicadorPrograma.get().setIdUnidadResponsable(programaPeticion.getIdUnidadResponsable());

			indicadorProgramaRepository.persist(indicadorPrograma.get());
		}
	}

	private void updateFichaIndicador(FichaIndicadores fichaIndicadores, PeticionM001VO peticionM001VO) {
		// Datos generales
		var datosGenerales = peticionM001VO.getDatosGenerales();
		fichaIndicadores.setCxNombreIndicador(datosGenerales.getNombreIndicador());
		fichaIndicadores.setIdDimension(datosGenerales.getIdDimensionMedicion());
		fichaIndicadores.setIdTipoIndicador(datosGenerales.getIdTipoIndicador());
		fichaIndicadores.setCxDefinicionIndicador(datosGenerales.getDefinicionIndicador());
		fichaIndicadores.setCxMetodoCalculoIndicador(datosGenerales.getMetodoCalculo());
		fichaIndicadores.setIdUnidadMedida(datosGenerales.getIdUnidadMedida());
		fichaIndicadores.setCxUnidadMedidaDescubrir(datosGenerales.getUnidadMedidaDescubrir());
		fichaIndicadores.setCxUnidadAbsoluta(datosGenerales.getUnidadAbsoluta());
		fichaIndicadores.setIdTipoMedicion(datosGenerales.getIdTipoMedicion());
		fichaIndicadores.setCxDescubrirTipoMedicion(datosGenerales.getTipoMedicionDescubrir());
		fichaIndicadores.setIdFrecuenciaMedicion(datosGenerales.getIdFrecuenciaMedicion());
		fichaIndicadores.setCxDescubrirFrecuenciaMedicion(datosGenerales.getFrecuenciaMedicionDescubrir());
		fichaIndicadores.setCxNumerador(datosGenerales.getNumerador());
		fichaIndicadores.setCxDenominador(datosGenerales.getDenominador());
		fichaIndicadores.setCxMeta(datosGenerales.getMeta());

		// Linea base
		var lineaBase = peticionM001VO.getLineaBase();
		fichaIndicadores.setCxValorBase(lineaBase.getValorBase());
		fichaIndicadores.setIdAnhioBase(lineaBase.getIdAnhio());
		fichaIndicadores.setCxPeriodoBase(lineaBase.getPeriodo());

		// Meta anual
		var metaAnual = peticionM001VO.getMetaAnual();
		fichaIndicadores.setCxValorMeta(metaAnual.getValorAnual());
		fichaIndicadores.setIdAnhioMeta(metaAnual.getIdAnhio());
		fichaIndicadores.setCxPeriodoMeta(metaAnual.getPeriodoCumplimiento());
		fichaIndicadores.setCxMedioVerificacion(metaAnual.getMedioVerificacion());

		// Características variables
		var caracteristicasVariables = peticionM001VO.getCaracteristicasVariables();
		fichaIndicadores.setCxNombreVariable(caracteristicasVariables.getNombreVariable());
		fichaIndicadores.setCxDescripcionVariable(caracteristicasVariables.getDescripcionVariable());
		fichaIndicadores.setCxFuenteInformacion(caracteristicasVariables.getFuenteInformacion());
		fichaIndicadores.setCxUnidadMedida(caracteristicasVariables.getUnidadMedida());
		fichaIndicadores.setCxFrecuenciaMedicion(caracteristicasVariables.getFrecuenciaMedicion());
		fichaIndicadores.setCxMetodoRecoleccion(caracteristicasVariables.getMetodoRecoleccion());
		fichaIndicadores.setIdComportamientoIndicador(caracteristicasVariables.getIdComportamientoIndicador());
		fichaIndicadores.setIdComportamientoMedicion(caracteristicasVariables.getIdComportamientoMedicion());
		fichaIndicadores.setIdTipoValor(caracteristicasVariables.getIdTipoValor());
		fichaIndicadores.setIdDesagregacionGeografica(caracteristicasVariables.getIdDesagregacion());
		fichaIndicadores.setCxDescripcionVinculacion(caracteristicasVariables.getDescripcionVinculacion());
	}
}
