package mx.sep.dgtic.sipse.presupuestal.service.impl;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoUsuarioEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.Revision;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ValidacionDTO;
import mx.sep.dgtic.sipse.presupuestal.dao.ArbolRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.ArchivoRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.DatosGeneralesRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.DiagnosticoRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.IndicadorResultadoRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.MetApartadoRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.MetArchivoValidacionRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.MetElementoValidarRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.MetRevisionValidacionRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.MetValidacionRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.ProgramaPresupuestalRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.UsuarioRepository;
import mx.sep.dgtic.sipse.presupuestal.entity.Arbol;
import mx.sep.dgtic.sipse.presupuestal.entity.Archivo;
import mx.sep.dgtic.sipse.presupuestal.entity.DatosGenerales;
import mx.sep.dgtic.sipse.presupuestal.entity.Diagnostico;
import mx.sep.dgtic.sipse.presupuestal.entity.IndicadorResultado;
import mx.sep.dgtic.sipse.presupuestal.entity.MetArchivoValidacionEntity;
import mx.sep.dgtic.sipse.presupuestal.entity.MetRevisionValidacionEntity;
import mx.sep.dgtic.sipse.presupuestal.entity.MetValidacionEntity;
import mx.sep.dgtic.sipse.presupuestal.entity.ProgramaPresupuestal;
import mx.sep.dgtic.sipse.presupuestal.entity.TipoDocumento;
import mx.sep.dgtic.sipse.presupuestal.entity.Usuario;
import mx.sep.dgtic.sipse.presupuestal.service.ValidacionService;

import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ValidacionServiceImpl implements ValidacionService {

	@Inject
	private UsuarioRepository usuarioRepository;

	@Inject
	private MetValidacionRepository metValidacionRepository;

	@Inject
	private MetArchivoValidacionRepository metArchivoValidacionRepository;

	@Inject
	private MetApartadoRepository metApartadoRepository;

	@Inject
	private MetRevisionValidacionRepository metRevisionValidacionRepository;

	@Inject
	private MetElementoValidarRepository metElementoValidarRepository;

	@Inject
	private ArchivoRepository archivoRepository;

	@Inject
	private DatosGeneralesRepository datosGeneralesRepository;

	@Inject
	private DiagnosticoRepository diagnosticoRepository;

	@Inject
	private ArbolRepository arbolRepo;

	@Inject
	private IndicadorResultadoRepository indicadorResultadoRepository;

	@Inject
	private ProgramaPresupuestalRepository programaPresupuestalRepository;
	@Inject
	private ArbolRepository arbolRepository;

	@Override
	@Transactional
	public RespuestaGenerica guardar(ValidacionDTO peticion) {
		Integer idValidacion = 1;
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			if (peticion.getApartado() == null) {
				throw new BadRequestException("El apartado no puede ser nulo");
			}
			if (peticion.getCveUsuario() == null) {
				throw new BadRequestException("La clave de usuario  no puede ser nula");
			}
			if (peticion.getId() == null) {
				throw new BadRequestException("El id no puede ser nulo");
			}
			Log.info("peticion.getCveUsuario() " + peticion.getCveUsuario());

			Usuario usuario = usuarioRepository.findById(peticion.getCveUsuario());
			if (usuario == null)
				return new RespuestaGenerica("500", "El usuario no existe, favor de validar.");

			Log.info("peticion.getApartado() " + peticion.getApartado());

			switch (peticion.getApartado()) {

			case "VALIDACION-PRESUPUESTO-DATOS-GENERALES":
				Log.info("VALIDACION-PRESUPUESTO-DATOS-GENERALES");
				DatosGenerales datosGenerales = datosGeneralesRepository.findById(peticion.getId());

				switch (usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()) {
				case "ENLACE":
				case "SUPERVISOR":
					idValidacion = datosGenerales.getIdValidacionSupervisor();
					break;
				case "PLANEACION":
					idValidacion = datosGenerales.getIdValidacionPlaneacion();
					break;
				case "PRESUPUESTO":
					idValidacion = datosGenerales.getIdValidacion();
					break;

				}
				break;
			case "VALIDACION-PRESUPUESTO-M001": case "VALIDACION-PRESUPUESTO-O001":
				Log.info("VALIDACION-PRESUPUESTO-DATOS-GENERALES");
				ProgramaPresupuestal programa = programaPresupuestalRepository.findById(peticion.getId());

				switch (usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()) {
				case "ENLACE":
				case "SUPERVISOR":
					idValidacion = programa.getIdValidacionSupervisor();
					break;
				case "PLANEACION":
					idValidacion = programa.getIdValidacionPlaneacion();
					break;
				case "PRESUPUESTO":
					idValidacion = programa.getIdValidacion();
					break;
				}
				break;
			case "VALIDADCION-PRESUPUESTO-DIAGNOSTICO":
				Log.info("VALIDACION-PRESUPUESTO-DX");
				Diagnostico diagnostico = diagnosticoRepository.findById(peticion.getId());

				switch (usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()) {
				case "ENLACE":
				case "SUPERVISOR":
					idValidacion = diagnostico.getIdValidacionSupervisor();
					break;
				case "PLANEACION":
					idValidacion = diagnostico.getIdValidacionPlaneacion();
					break;
				case "PRESUPUESTO":
					idValidacion = diagnostico.getIdValidacion();
					break;

				}
				break;
			case "VALIDACION-PRESUPUESTO-ARBOL-PROBLEMA": case "VALIDACION-PRESUPUESTO-ARBOL-OBJETIVO":
				
				Log.info("VALIDACION-PRESUPUESTO-DX");
				Arbol arbolProblema = arbolRepository.findById(peticion.getId());

				switch (usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()) {
				case "ENLACE":
				case "SUPERVISOR":
					idValidacion = arbolProblema.getIdValidacionSupervisor();
					break;
				case "PLANEACION":
					idValidacion = arbolProblema.getIdValidacionPlaneacion();
					break;
				case "PRESUPUESTO":
					idValidacion = arbolProblema.getIdValidacion();
					break;

				}
				break;
			case "VALIDACION-PRESUPUESTO-MATRIZ-INDICADORES":
				Log.info("VALIDACION-PRESUPUESTO-MATRIZ-INDICADORES");
				IndicadorResultado matrizIndicadores = indicadorResultadoRepository.find("idPresupuestal",peticion.getId()).firstResult();

				switch (usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()) {
				case "ENLACE":
				case "SUPERVISOR":
					idValidacion = matrizIndicadores.getIdValidacionSupervisor();
					break;
				case "PLANEACION":
					idValidacion = matrizIndicadores.getIdValidacionPlaneacion();
					break;
				case "PRESUPUESTO":
					idValidacion = matrizIndicadores.getIdValidacion();
					break;

				}
				break;

			default:
				Log.info("Este apartado no esta considerado");
				throw new BadRequestException("Este apartado no esta considerado en esta solucion");
			}

			//Registramos en base la validación(Actualizamos o insertamos)
			MetValidacionEntity validador = this.registrarValidacion(peticion, idValidacion, usuario);
			//Registrar el idValidación en entidad de negocio
			this.registrarValidacionEnEntidadNegocio(peticion,validador, usuario);

		} catch (Exception e) {
			respuesta = new RespuestaGenerica("400", "Error en la petición: " + e.getMessage());
		}
		return respuesta;
	}

	private void registrarValidacionEnEntidadNegocio(ValidacionDTO peticion, MetValidacionEntity validador, Usuario usuario) {
		switch (peticion.getApartado()) {

		case "VALIDACION-PRESUPUESTO-DATOS-GENERALES":
			Log.info("Guardando en entidad de negocio - VALIDACION-PRESUPUESTO-DATOS-GENERALES");
			DatosGenerales datosGenerales = datosGeneralesRepository.findById(peticion.getId());
			Integer idValidacion=null;
			switch (usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()) {
			case "SUPERVISOR":
			case "ENLACE":
				datosGenerales.setIdValidacionSupervisor(validador.getIdValidacion());
				actualizarProgramaPresupuestal(datosGenerales.getIdPresupuestal(),
						validador.getIdValidacion(), peticion.getEstatus());
				break;
			case "PLANEACION":
				datosGenerales.setIdValidacionPlaneacion(validador.getIdValidacion());
				break;
			case "PRESUPUESTO":
				datosGenerales.setIdValidacion(validador.getIdValidacion());
				break;
			}
			datosGeneralesRepository.persistAndFlush(datosGenerales);
			break;
		case "VALIDACION-PRESUPUESTO-M001": case "VALIDACION-PRESUPUESTO-O001":
			Log.info("Guardando en entidad de negocio - " + peticion.getApartado());
			ProgramaPresupuestal programa = programaPresupuestalRepository.findById(peticion.getId());

			switch (usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()) {
			case "SUPERVISOR":
			case "ENLACE":
				programa.setIdValidacionSupervisor(validador.getIdValidacion());
				actualizarProgramaPresupuestal(programa.getIdPresupuestal(),
						validador.getIdValidacion(), peticion.getEstatus());
				break;
			case "PLANEACION":
				programa.setIdValidacionPlaneacion(validador.getIdValidacion());
				break;
			case "PRESUPUESTO":
				programa.setIdValidacionSupervisor(validador.getIdValidacion());
				break;
			}
			programa.setCsEstatus(peticion.getEstatus());
			programaPresupuestalRepository.persistAndFlush(programa);
			break;
		case "VALIDADCION-PRESUPUESTO-DIAGNOSTICO":
			Log.info("VALIDACION-PRESUPUESTO-DX");
			Diagnostico diagnostico = diagnosticoRepository.findById(peticion.getId());

			switch (usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()) {
			case "SUPERVISOR":
			case "ENLACE":
				diagnostico.setIdValidacionSupervisor(validador.getIdValidacion());
				actualizarProgramaPresupuestal(diagnostico.getIdPresupuestal(),
						validador.getIdValidacion(), peticion.getEstatus());
				break;
			case "PLANEACION":
				diagnostico.setIdValidacionPlaneacion(validador.getIdValidacion());
				break;
			case "PRESUPUESTO":
				diagnostico.setIdValidacionSupervisor(validador.getIdValidacion());
				break;
			}
			diagnosticoRepository.persistAndFlush(diagnostico);
			break;
		case "VALIDACION-PRESUPUESTO-ARBOL-PROBLEMA": case "VALIDACION-PRESUPUESTO-ARBOL-OBJETIVO":
			Log.info("Guardando en entidad de negocio - " + peticion.getApartado());
			Arbol arbolObjetivo = arbolRepository.findById(peticion.getId());

			switch (usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()) {
			case "SUPERVISOR":
			case "ENLACE":
				arbolObjetivo.setIdValidacionSupervisor(validador.getIdValidacion());
				actualizarProgramaPresupuestal(arbolObjetivo.getIdPresupuestal(),
						validador.getIdValidacion(), peticion.getEstatus());
				break;
			case "PLANEACION":
				arbolObjetivo.setIdValidacionPlaneacion(validador.getIdValidacion());
				break;
			case "PRESUPUESTO":
				arbolObjetivo.setIdValidacionSupervisor(validador.getIdValidacion());
				break;
			}
			arbolRepository.persistAndFlush(arbolObjetivo);
			break;
		case "VALIDACION-PRESUPUESTO-MATRIZ-INDICADORES":
			
			Log.info("Guardando en entidad de negocio - " + peticion.getApartado());
			IndicadorResultado matrizIndicadores = indicadorResultadoRepository.find("idPresupuestal",peticion.getId()).firstResult();

			switch (usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()) {
			case "SUPERVISOR":
			case "ENLACE":
				matrizIndicadores.setIdValidacionSupervisor(validador.getIdValidacion());
				actualizarProgramaPresupuestal(matrizIndicadores.getIdPresupuestal(),
						validador.getIdValidacion(), peticion.getEstatus());
				break;
			case "PLANEACION":
				matrizIndicadores.setIdValidacionPlaneacion(validador.getIdValidacion());
				break;
			case "PRESUPUESTO":
				matrizIndicadores.setIdValidacionSupervisor(validador.getIdValidacion());
				break;
			}
			indicadorResultadoRepository.persistAndFlush(matrizIndicadores);
			//Aprobar programa
			if (EstatusEnum.APROBADO.getEstatus().equals(peticion.getEstatus()) || EstatusEnum.RECHAZADO.getEstatus().equals(peticion.getEstatus())){

				ProgramaPresupuestal programaAprobado = programaPresupuestalRepository.findById(peticion.getId());
				programaAprobado.setCsEstatus(peticion.getEstatus());
				programaAprobado.setCveUsuario(usuario.getCveUsuario());
				if (TipoUsuarioEnum.SUPERVISOR.getCdTipoUsuario().equals(usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase())) {
					programaAprobado.setIdValidacionSupervisor(validador.getIdValidacion());
					
				}
				if (EstatusEnum.APROBADO.getEstatus().equals(peticion.getEstatus())){
					programaAprobado.setDfAprobacion(Timestamp.valueOf(LocalDateTime.now()));
				}
				programaPresupuestalRepository.persistAndFlush(programaAprobado);
			}
			break;

		default:
			Log.info("Este apartado no esta considerado");
			throw new BadRequestException("Este apartado no esta considerado en esta solucion");
		}


	}

	private void actualizarProgramaPresupuestal(Integer idPrograma, Integer idValidacion, String estatus) {
		var programaActualizado = programaPresupuestalRepository.findById(idPrograma);
		if (Objects.nonNull(programaActualizado)) {
			programaActualizado.setIdValidacionSupervisor(idValidacion);
			programaActualizado.setCsEstatus(estatus);
			programaActualizado.setDfAprobacion(null);
			programaPresupuestalRepository.persistAndFlush(programaActualizado);
		}
	}

	private MetValidacionEntity registrarValidacion(ValidacionDTO peticion, Integer idValidacion, Usuario usuario) {

		if (idValidacion == null || idValidacion == 0) {
			Log.info("El idValidacion viene nulo  " + peticion.getId());
			MetValidacionEntity metValidacion = new MetValidacionEntity();
			metValidacion.setDfValidacion(LocalDate.now());
			metValidacion.setDhValidacion(LocalTime.now());
			metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
			metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
			metValidacion.setCsEstatus(peticion.getEstatus());
			metValidacionRepository.persistAndFlush(metValidacion);


			metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
			var elementosEnRevisionO = new ArrayList<MetRevisionValidacionEntity>();

			peticion.getRevision().stream().map(el -> {
				MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
				revision.setIxCheck(el.getCheck());
				revision.setCxComentario(el.getComentarios());
				revision.setIdElementoValidar(el.getIdElemento());
				revision.setIdValidacion(metValidacion.getIdValidacion());
				return revision;
			}).forEach(elementosEnRevisionO::add);
			metRevisionValidacionRepository.persist(elementosEnRevisionO);

			if (peticion.getArchivos()!=null && peticion.getArchivos().size() != 0) {
				Archivo archivo = new Archivo();
				Log.info(peticion.getEstatus());
				Log.info("peticion.getArchivos().get(0).getCveUsuario()  "
						+ peticion.getArchivos().get(0).getCveUsuario());
				archivo.setCsEstatus(peticion.getEstatus());
				archivo.setCxNombre(peticion.getArchivos().get(0).getCxNombre());
				archivo.setCveUsuario(usuario.getCveUsuario());
				archivo.setCxUuid(peticion.getArchivos().get(0).getCxUuid());
				archivo.setCxUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
				archivo.setDfFechaCarga(LocalDate.now());
				archivo.setDhHoraCarga(LocalTime.now());
				TipoDocumento tipoDoc = new TipoDocumento();
				tipoDoc.setIdTipoDocumento(1);
				archivo.setIdTipoDocumento(tipoDoc.getIdTipoDocumento());
				archivoRepository.persistAndFlush(archivo);

				metArchivoValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
				Archivo archivoNuevo = archivoRepository
						.find("cxUuid", peticion.getArchivos().get(0).getCxUuid()).firstResultOptional()
						.orElseThrow(() -> {
							throw new NotFoundException("No se encontró el archivo con uuid "
									+ peticion.getArchivos().get(0).getCxUuid());
						});
				Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
				Log.info("archivoNuevo.getIdArchivo()  " + archivoNuevo.getIdArchivo());
				MetArchivoValidacionEntity archivoValidacion = new MetArchivoValidacionEntity();
				archivoValidacion.setIdValidacion(metValidacion.getIdValidacion());
				archivoValidacion.setIdArchivo(archivoNuevo.getIdArchivo());
				metArchivoValidacionRepository.persistAndFlush(archivoValidacion);

			} else {
				Log.info("Esta peticion no trae archivos  ");
			}
			return metValidacion;
		} else {
			MetValidacionEntity existeIdValidacion = metValidacionRepository.findById(idValidacion);

			if (!ObjectUtils.isEmpty(existeIdValidacion)) {
				Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());

				existeIdValidacion.setDfValidacion(LocalDate.now());
				existeIdValidacion.setDhValidacion(LocalTime.now());
				existeIdValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
				existeIdValidacion.setCsEstatus(peticion.getEstatus());

				metValidacionRepository.persistAndFlush(existeIdValidacion);
				Log.info("metValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());

				metRevisionValidacionRepository.delete("idValidacion", existeIdValidacion.getIdValidacion());
				var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
				peticion.getRevision().stream().map(el -> {
					MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
					revision.setIxCheck(el.getCheck());
					revision.setCxComentario(el.getComentarios());
					revision.setIdElementoValidar(el.getIdElemento());
					revision.setIdValidacion(existeIdValidacion.getIdValidacion());
					return revision;
				}).forEach(elementosEnRevision::add);
				metRevisionValidacionRepository.persist(elementosEnRevision);

				if (peticion.getArchivos() != null) {
					if (peticion.getArchivos().size()>0) {

						Archivo archivo = new Archivo();
						Log.info(peticion.getEstatus());
						Log.info("peticion.getArchivos().get(0).getCveUsuario()  "
								+ peticion.getArchivos().get(0).getCveUsuario());
						archivo.setCsEstatus(peticion.getEstatus());
						archivo.setCxNombre(peticion.getArchivos().get(0).getCxNombre());
						archivo.setCveUsuario(usuario.getCveUsuario());
						archivo.setCxUuid(peticion.getArchivos().get(0).getCxUuid());
						archivo.setCxUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
						archivo.setDfFechaCarga(LocalDate.now());
						archivo.setDhHoraCarga(LocalTime.now());
						TipoDocumento tipoDoc = new TipoDocumento();
						tipoDoc.setIdTipoDocumento(1);
						archivo.setIdTipoDocumento(tipoDoc.getIdTipoDocumento());
						archivoRepository.persistAndFlush(archivo);

						metArchivoValidacionRepository.delete("idValidacion", existeIdValidacion.getIdValidacion());
						Archivo archivoNuevo = archivoRepository
								.find("cxUuid", peticion.getArchivos().get(0).getCxUuid()).firstResultOptional()
								.orElseThrow(() -> {
									throw new NotFoundException("No se encontró el archivo con uuid "
											+ peticion.getArchivos().get(0).getCxUuid());
								});
						Log.info("metValidacion.getIdValidacion()  " + existeIdValidacion.getIdValidacion());
						Log.info("archivoNuevo.getIdArchivo()  " + archivoNuevo.getIdArchivo());
						MetArchivoValidacionEntity archivoValidacion = new MetArchivoValidacionEntity();
						archivoValidacion.setIdValidacion(existeIdValidacion.getIdValidacion());
						archivoValidacion.setIdArchivo(archivoNuevo.getIdArchivo());
						metArchivoValidacionRepository.persistAndFlush(archivoValidacion);
					}
				} else {
					Log.info("Esta peticion no trae archivos  ");
				}

			} else {
				Log.info("No existe registro para el idValidacion " + peticion.getId());
				throw new BadRequestException("No existe registro para el id " + peticion.getId());
			}
			return existeIdValidacion;
		}
	}

	public MensajePersonalizado<ValidacionDTO> consultarRevision(String apartado, Integer id, String cveUsuario) {
		MensajePersonalizado<ValidacionDTO> respuesta = new MensajePersonalizado<ValidacionDTO>();
		var variasRevisiones = new ArrayList<Revision>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		Integer idValidacion = 1;
		Log.info("consultarRevision.");
		Usuario usuario = new Usuario();

		usuario = usuarioRepository.findById(cveUsuario);
		if (usuario == null) {

			Log.info("No existe el usuario");
			throw new BadRequestException("No existe el usuario, favor de validar");
		}
		String rol = usuario.getTipoUsuario().getCdTipoUsuario();

		switch (apartado) {

		case "VALIDACION-PRESUPUESTO-DATOS-GENERALES":
			Log.info("Entrando a " + apartado);
			DatosGenerales datosGenerales = datosGeneralesRepository.findById(id);

			switch (rol.toUpperCase()) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = datosGenerales.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = datosGenerales.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = datosGenerales.getIdValidacion();
				break;
			default:
				Log.info("Usuario sin privilegios para validar");
				throw new BadRequestException(" Usuario sin privilegios para validar con rol: " + rol);
			}
			break;
		case "VALIDADCION-PRESUPUESTO-DIAGNOSTICO":
			Log.info("Entrando a " + apartado);
			Diagnostico diagnostico = diagnosticoRepository.findById(id);
			switch (rol.toUpperCase()) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = diagnostico.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = diagnostico.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = diagnostico.getIdValidacion();
				break;
			default:
				Log.info("Usuario sin privilegios para validar");
				throw new BadRequestException(" Usuario sin privilegios para validar con rol: " + rol);
			}
			break;
		case "VALIDACION-PRESUPUESTO-ARBOL-PROBLEMA":
			Log.info("Entrando a " + apartado);
			Arbol arbol = arbolRepo.findById(id);
			if (arbol==null) {
				throw new BadRequestException(" arbol no encontrado con el id : " + id);
			}
			switch (rol.toUpperCase()) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = arbol.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = arbol.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = arbol.getIdValidacion();
				break;
			default:
				Log.info("Usuario sin privilegios para validar");
				throw new BadRequestException(" Usuario sin privilegios para validar con rol: " + rol);
			}
			break;
		case "VALIDACION-PRESUPUESTO-ARBOL-OBJETIVO":
			Log.info("Entrando a " + apartado);
			Arbol arbolObjetivo = arbolRepo.findById(id);
			if (arbolObjetivo==null) {
				throw new BadRequestException(" arbolObjetivo no encontrado con el id : " + id);
			}
			switch (rol.toUpperCase()) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = arbolObjetivo.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = arbolObjetivo.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = arbolObjetivo.getIdValidacion();
				break;
			default:
				Log.info("Usuario sin privilegios para validar");
				throw new BadRequestException(" Usuario sin privilegios para validar con rol: " + rol);
			}
			break;
		case "VALIDACION-PRESUPUESTO-MATRIZ-INDICADORES":
			Log.info("Entrando a " + apartado);
			IndicadorResultado matrizIndicadores = indicadorResultadoRepository.find("idPresupuestal",id).firstResult();
			if (matrizIndicadores==null) {
				throw new BadRequestException(" matrizIndicadores no encontrada con el id : " + id);
			}
			switch (rol.toUpperCase()) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = matrizIndicadores.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = matrizIndicadores.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = matrizIndicadores.getIdValidacion();
				break;
			default:
				Log.info("Usuario sin privilegios para validar");
				throw new BadRequestException(" Usuario sin privilegios para validar con rol: " + rol);
			}
			break;
		case "VALIDACION-PRESUPUESTO-M001": case "VALIDACION-PRESUPUESTO-O001":
			Log.info("Entrando a " + apartado);
			ProgramaPresupuestal programa = programaPresupuestalRepository.findById(id);
			if (programa==null) {
				throw new BadRequestException(" Programa no encontrada con el id : " + id);
			}
			switch (rol.toUpperCase()) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = programa.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = programa.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = programa.getIdValidacion();
				break;
			default:
				Log.info("Usuario sin privilegios para validar");
				throw new BadRequestException(" Usuario sin privilegios para validar con rol: " + rol);
			}
			break;

		default:
			Log.info("Este apartado no esta considerado");
			throw new BadRequestException("No existe registro para el id " + id);
		}
		Log.info("IdValidacion de busqueda() " + idValidacion);
		if (idValidacion == null) {
			Log.info("No hay validación para este id");
			throw new BadRequestException("No existe validación-rol para el id " + id);
		}

		ValidacionDTO validacionDTO = new ValidacionDTO();
		MetValidacionEntity validacion = new MetValidacionEntity();

		validacionDTO.setApartado(apartado);
		if (idValidacion != null) {
			validacion = metValidacionRepository.findById(idValidacion);
			Log.info("tipoDeApartado.getCxNombre()  " + apartado);
			validacionDTO.setCveUsuario(validacion.getCveUsuarioRegistra());
			validacionDTO.setEstatus(validacion.getCsEstatus());
			validacionDTO.setId(idValidacion);
		}

		List<MetRevisionValidacionEntity> revisiones = metRevisionValidacionRepository
				.find("idValidacion", idValidacion).list();
		revisiones.stream().map(revision -> {
			Revision rev = new Revision();
			rev.setIdElemento(revision.getIdElementoValidar());
			rev.setComentarios(revision.getCxComentario());
			rev.setCheck(revision.getIxCheck());
			return rev;
		}).forEach(variasRevisiones::add);

		if (variasRevisiones != null) {
			if (variasRevisiones.size() > 0) {
				Log.info("variasRevisiones.get(0).getIdElemento()  " + variasRevisiones.get(0).getIdElemento());
				var numeroDeApartado = metElementoValidarRepository.findById(variasRevisiones.get(0).getIdElemento());
				var tipoDeApartado = metApartadoRepository.findById(numeroDeApartado.getIdApartado());

				Log.info("tipoDeApartado.getCxNombre()  " + tipoDeApartado.getCxNombre());

				validacionDTO.setRevision(variasRevisiones);

			}
		}

		validacionDTO.setRevision(variasRevisiones);

		PanacheQuery<MetArchivoValidacionEntity> encontrarArchivo = metArchivoValidacionRepository.find("idValidacion",
				idValidacion);
		if (encontrarArchivo.list().size() > 0) {
			Log.info(" encontrarArchivo.getIdArchivo()  " + encontrarArchivo.list().get(0).getIdArchivo());
			var archivoEncontrado = archivoRepository.findById(encontrarArchivo.list().get(0).getIdArchivo());
			Log.info(" archivoEncontrado.getIdArchivo()  " + archivoEncontrado.getIdArchivo());

			ArrayList<ArchivoDTO> lstArchivo = new ArrayList<ArchivoDTO>();
			ArchivoDTO archivo = new ArchivoDTO();
			archivo.setIdArchivo(archivoEncontrado.getIdArchivo());
			archivo.setCsEstatus(archivoEncontrado.getCsEstatus());
			archivo.setCveUsuario(archivoEncontrado.getCveUsuario());
			archivo.setCxNombre(archivoEncontrado.getCxNombre());
			archivo.setCxUuid(archivoEncontrado.getCxUuid());
			archivo.setDfFechaCarga(archivoEncontrado.getDfFechaCarga());
			archivo.setDfHoraCarga(archivoEncontrado.getDhHoraCarga());
			archivo.setCxUuidToPdf(archivoEncontrado.getCxUuidToPdf());
			lstArchivo.add(archivo);
			validacionDTO.setArchivos(lstArchivo);
		}

		respuesta.setRespuesta(validacionDTO);
		return respuesta;
	}

}
