package mx.sep.dgtic.sipse.medianoplazo.servicios.impl;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import lombok.SneakyThrows;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.Revision;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ValidacionDTO;
import mx.sep.dgtic.sipse.medianoplazo.daos.*;
import mx.sep.dgtic.sipse.medianoplazo.entidades.*;
import mx.sep.dgtic.sipse.medianoplazo.servicios.ValidacionService;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ValidacionServiceImpl implements ValidacionService {

	final private Integer IDCATOBJETIVO = 592;
	final private Integer IDCATESTRATEGIA = 771;
	final private Integer IDCATACCION = 640;

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
	private EstructuraRepository estructuraRepository;

	@Inject
	private MasterCatalogoRepository catalogoRepo;

	@Inject
	private MetaRepository metaRepository;

	@Inject
	private EpilogoRepository epilogoRepository;
	

	@Override
	@Transactional
	@SneakyThrows
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
			case "INICIO":
				Log.info("Entrando a INICIO");
				var estructura = estructuraRepository.findById(peticion.getId());
				if (estructura == null)
					throw new BadRequestException("El idEstructura no existe, favor de validar.");
				switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
				case 5:
					Log.info("peticion para usuario Supervisor");
					idValidacion = estructura.getIdValidacionSupervisor();
					Log.info("Id de validacion " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este idEstructura  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						estructura.setIdValidacionSupervisor(metValidacion.getIdValidacion());
						estructuraRepository.persistAndFlush(estructura);

						metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
						var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();

						peticion.getRevision().stream().map(el -> {
							MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
							revision.setIxCheck(el.getCheck());
							revision.setCxComentario(el.getComentarios());
							revision.setIdElementoValidar(el.getIdElemento());
							revision.setIdValidacion(metValidacion.getIdValidacion());
							return revision;
						}).forEach(elementosEnRevision::add);
						metRevisionValidacionRepository.persist(elementosEnRevision);

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(estructura.getIdValidacionSupervisor());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
							MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				case 6:
					Log.info("peticion para usuario de Planeacion");
					idValidacion = estructura.getIdValidacionPlaneacion();
					Log.info("Id de validacion " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este idEstructura  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						estructura.setIdValidacionPlaneacion(metValidacion.getIdValidacion());
						estructuraRepository.persistAndFlush(estructura);

						metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
						var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
						MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
						peticion.getRevision().stream().map(el -> {
							MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
							revision.setIxCheck(el.getCheck());
							revision.setCxComentario(el.getComentarios());
							revision.setIdElementoValidar(el.getIdElemento());
							revision.setIdValidacion(metValidacion.getIdValidacion());
							return revision;
						}).forEach(elementosEnRevision::add);
						metRevisionValidacionRepository.persist(elementosEnRevision);

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(estructura.getIdValidacionPlaneacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
							MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				case 7:
					Log.info("peticion para usuario de Presupuesto");
					idValidacion = estructura.getIdValidacion();
					Log.info("Id de validacion " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este idEstructura  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						estructura.setIdValidacion(metValidacion.getIdValidacion());
						estructuraRepository.getEntityManager().merge(estructura);

						metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
						var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
						MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
						peticion.getRevision().stream().map(el -> {
							MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
							revision.setIxCheck(el.getCheck());
							revision.setCxComentario(el.getComentarios());
							revision.setIdElementoValidar(el.getIdElemento());
							revision.setIdValidacion(metValidacion.getIdValidacion());
							return revision;
						}).forEach(elementosEnRevision::add);
						metRevisionValidacionRepository.persist(elementosEnRevision);

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(estructura.getIdValidacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
							MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				default:
					throw new BadRequestException("Este usuario no tiene los permisos necesarios");
				}

				break;
			case "OBJETIVOS":
				Log.info("Entrando a OBJETIVOS");

				var objetivo = catalogoRepo
						.find("idCatalogo = ?1 and MasterCatalogo2.idCatalogo = ?2", peticion.getId(), IDCATOBJETIVO)
						.firstResult();
				if (objetivo == null)
					throw new BadRequestException("El idObjetivo no existe, favor de validar.");
				switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
				case 5:
					Log.info("peticion para usuario Supervisor");
					idValidacion = objetivo.getIdValidacionSupervisor();
					Log.info("objetivo.getIdValidacion() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este idObjetivo  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						objetivo.setIdValidacionSupervisor(metValidacion.getIdValidacion());
						catalogoRepo.persistAndFlush(objetivo);

						metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
						var elementosEnRevisionO = new ArrayList<MetRevisionValidacionEntity>();
						MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
						peticion.getRevision().stream().map(el -> {
							MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
							revision.setIxCheck(el.getCheck());
							revision.setCxComentario(el.getComentarios());
							revision.setIdElementoValidar(el.getIdElemento());
							revision.setIdValidacion(metValidacion.getIdValidacion());
							return revision;
						}).forEach(elementosEnRevisionO::add);
						metRevisionValidacionRepository.persist(elementosEnRevisionO);

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(objetivo.getIdValidacionSupervisor());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
							MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idObjetivo " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				case 6:
					Log.info("peticion para usuario de Planeacion");
					idValidacion = objetivo.getIdValidacionPlaneacion();
					Log.info("objetivo.getIdValidacion() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este idObjetivo  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						objetivo.setIdValidacionPlaneacion(metValidacion.getIdValidacion());
						objetivo.setLockFlag(1);
						objetivo.setIxDependencia(0);
						catalogoRepo.persistAndFlush(objetivo);

						metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
						var elementosEnRevisionO = new ArrayList<MetRevisionValidacionEntity>();
						MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
						peticion.getRevision().stream().map(el -> {
							MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
							revision.setIxCheck(el.getCheck());
							revision.setCxComentario(el.getComentarios());
							revision.setIdElementoValidar(el.getIdElemento());
							revision.setIdValidacion(metValidacion.getIdValidacion());
							return revision;
						}).forEach(elementosEnRevisionO::add);
						metRevisionValidacionRepository.persist(elementosEnRevisionO);

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(objetivo.getIdValidacionPlaneacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
							MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idObjetivo " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				case 7:
					Log.info("peticion para usuario de Presupuesto");
					idValidacion = objetivo.getIdValidacion();
					Log.info("objetivo.getIdValidacion() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este idObjetivo  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						objetivo.setIdValidacion(metValidacion.getIdValidacion());
						catalogoRepo.persistAndFlush(objetivo);

						metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
						var elementosEnRevisionO = new ArrayList<MetRevisionValidacionEntity>();
						MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
						peticion.getRevision().stream().map(el -> {
							MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
							revision.setIxCheck(el.getCheck());
							revision.setCxComentario(el.getComentarios());
							revision.setIdElementoValidar(el.getIdElemento());
							revision.setIdValidacion(metValidacion.getIdValidacion());
							return revision;
						}).forEach(elementosEnRevisionO::add);
						metRevisionValidacionRepository.persist(elementosEnRevisionO);

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(objetivo.getIdValidacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
							MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idObjetivo " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				default:
					throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
				}

				break;
			case "ESTRATEGIAS-ACCIONES":
				Log.info("Entrando a Estrategias");

				var estrategia = catalogoRepo.findById(peticion.getId());
				if (estrategia == null)
					throw new BadRequestException("El idEstrategia no existe, favor de validar.");
				switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
				case 5:
					Log.info("peticion para usuario Supervisor");
					idValidacion = estrategia.getIdValidacionSupervisor();
					Log.info("estrategia.getIdValidacion() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este idEstrategia  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						estrategia.setIdValidacionSupervisor(metValidacion.getIdValidacion());
						catalogoRepo.persistAndFlush(estrategia);

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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(estrategia.getIdValidacionSupervisor());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();

							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				case 6:
					Log.info("peticion para usuario de Planeacion");
					idValidacion = estrategia.getIdValidacionPlaneacion();
					Log.info("estrategia.getIdValidacion() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este idEstrategia  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						estrategia.setIdValidacionPlaneacion(metValidacion.getIdValidacion());
						catalogoRepo.persistAndFlush(estrategia);

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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(estrategia.getIdValidacionPlaneacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();

							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				case 7:
					Log.info("peticion para usuario de Presupuesto");
					idValidacion = estrategia.getIdValidacion();
					Log.info("estrategia.getIdValidacion() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este idEstrategia  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						estrategia.setIdValidacion(metValidacion.getIdValidacion());
						catalogoRepo.persistAndFlush(estrategia);

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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(estrategia.getIdValidacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();

							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				default:
					throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
				}

				break;
			case "METAS-PARA-EL-BIENESTAR":
				Log.info("Entrando a metas");

				var meta = metaRepository.findById(peticion.getId());
				if (meta == null)
					throw new BadRequestException("El idMeta no existe, favor de validar.");
				switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
				case 5:
					Log.info("peticion para usuario Supervisor");
					idValidacion = meta.getIdValidacionSupervisor();
					Log.info("meta.getIdValidacionSupervisor() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este id  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						meta.setIdValidacionSupervisor(metValidacion.getIdValidacion());
						metaRepository.getEntityManager().merge(meta);

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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(meta.getIdValidacionSupervisor());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();

							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				case 6:
					Log.info("peticion para usuario de Planeacion");
					idValidacion = meta.getIdValidacionPlaneacion();
					Log.info("meta.getIdValidacionPlaneacion() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este id  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						meta.setIdValidacionPlaneacion(metValidacion.getIdValidacion());
						metaRepository.getEntityManager().merge(meta);

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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(meta.getIdValidacionPlaneacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();

							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				case 7:
					Log.info("peticion para usuario de Presupuesto");
					idValidacion = meta.getIdValidacion();
					Log.info("meta.getIdValidacion() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este id  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						meta.setIdValidacion(metValidacion.getIdValidacion());
						metaRepository.getEntityManager().merge(meta);

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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(meta.getIdValidacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();

							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				default:
					throw new BadRequestException("Este usuario no tiene los permisos necesarios");
				}

				break;
			case "PARAMETROS":
				Log.info("Entrando a PARAMETROS");
				var parametro = metaRepository.findById(peticion.getId());
				if (parametro == null)
					throw new BadRequestException("El idMeta no existe, favor de validar.");
				switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
				case 5:
					Log.info("peticion para usuario Supervisor");
					idValidacion = parametro.getIdValidacionSupervisor();
					Log.info("parametro.getIdValidacion() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este id  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						parametro.setIdValidacionSupervisor(metValidacion.getIdValidacion());
						metaRepository.getEntityManager().merge(parametro);

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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(parametro.getIdValidacionSupervisor());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();

							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}

					break;
				case 6:
					Log.info("peticion para usuario de Planeacion");
					idValidacion = parametro.getIdValidacionPlaneacion();
					Log.info("parametro.getIdValidacion() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este id  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						parametro.setIdValidacionPlaneacion(metValidacion.getIdValidacion());
						metaRepository.getEntityManager().merge(parametro);

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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(parametro.getIdValidacionPlaneacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();

							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}

					break;
				case 7:
					Log.info("peticion para usuario de Presupuesto");
					idValidacion = parametro.getIdValidacion();
					Log.info("parametro.getIdValidacion() " + idValidacion);
					if (idValidacion == null) {
						Log.info("El idValidacion viene nulo para este id  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						parametro.setIdValidacion(metValidacion.getIdValidacion());
						metaRepository.getEntityManager().merge(parametro);

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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(parametro.getIdValidacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();

							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}

					break;
				default:
					throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
				}

				break;
			case "EPILOGO-CARGA-DEL-PI-Y-ACTAS":
				Log.info("Entrando a EPILOGO-CARGA-DEL-PI-Y-ACTAS");
				
				

				var epilogo = epilogoRepository.findById(peticion.getId());
				if (epilogo == null)
					throw new BadRequestException("El id no existe, favor de validar.");
				
				
				// Ajustar estatus del proyecto dependiendo de los comentarios en otros
				// apartados
				this.actualizaProgramaInstituacional(usuario, peticion, epilogo);
				
				switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
				case 5:
					Log.info("peticion para usuario Supervisor");
					idValidacion = epilogo.getIdValidacionSupervisor();
					Log.info("epilogo.getIdValidacion() " + idValidacion);
					if (idValidacion == null || idValidacion == 0) {
						Log.info("El idValidacion viene nulo para este idObjetivo  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						epilogo.setIdValidacionSupervisor(metValidacion.getIdValidacion());
						epilogoRepository.persistAndFlush(epilogo);

						metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
						var elementosEnRevisionO = new ArrayList<MetRevisionValidacionEntity>();
						MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
						peticion.getRevision().stream().map(el -> {
							MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
							revision.setIxCheck(el.getCheck());
							revision.setCxComentario(el.getComentarios());
							revision.setIdElementoValidar(el.getIdElemento());
							revision.setIdValidacion(metValidacion.getIdValidacion());
							return revision;
						}).forEach(elementosEnRevisionO::add);
						metRevisionValidacionRepository.persist(elementosEnRevisionO);

						if (peticion.getArchivos().size() > 0) {
							Archivo archivo = new Archivo();
							Log.info(peticion.getEstatus());
							Log.info("peticion.getArchivos().get(0).getCveUsuario()  "
									+ peticion.getArchivos().get(0).getCveUsuario());
							archivo.setCsEstatus(peticion.getEstatus());
							archivo.setCxNombre(peticion.getArchivos().get(0).getCxNombre());
							archivo.setCveUsuario(peticion.getArchivos().get(0).getCveUsuario());
							archivo.setCxUuid(peticion.getArchivos().get(0).getCxUuid());
							archivo.setCxUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
							archivo.setDfFechaCarga(LocalDate.now());
							archivo.setDhHoraCarga(LocalTime.now());
							archivo.setIdTipoDocumento(1);
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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(epilogo.getIdValidacionSupervisor());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

							if (peticion.getArchivos().size() > 0) {
								Archivo archivo = new Archivo();
								Log.info(peticion.getEstatus());
								Log.info("peticion.getArchivos().get(0).getCveUsuario()  "
										+ peticion.getArchivos().get(0).getCveUsuario());
								archivo.setCsEstatus(peticion.getEstatus());
								archivo.setCxNombre(peticion.getArchivos().get(0).getCxNombre());
								archivo.setCveUsuario(peticion.getArchivos().get(0).getCveUsuario());
								archivo.setCxUuid(peticion.getArchivos().get(0).getCxUuid());
								archivo.setCxUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
								archivo.setDfFechaCarga(LocalDate.now());
								archivo.setDhHoraCarga(LocalTime.now());
								archivo.setIdTipoDocumento(1);
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

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				case 6:
					Log.info("peticion para usuario de Planeacion");
					idValidacion = epilogo.getIdValidacionPlaneacion();
					Log.info("epilogo.getIdValidacion() " + idValidacion);
					if (idValidacion == null || idValidacion == 0) {
						Log.info("El idValidacion viene nulo para este idObjetivo  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						epilogo.setIdValidacionPlaneacion(metValidacion.getIdValidacion());
						epilogoRepository.persistAndFlush(epilogo);

						metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
						var elementosEnRevisionO = new ArrayList<MetRevisionValidacionEntity>();
						MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
						peticion.getRevision().stream().map(el -> {
							MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
							revision.setIxCheck(el.getCheck());
							revision.setCxComentario(el.getComentarios());
							revision.setIdElementoValidar(el.getIdElemento());
							revision.setIdValidacion(metValidacion.getIdValidacion());
							return revision;
						}).forEach(elementosEnRevisionO::add);
						metRevisionValidacionRepository.persist(elementosEnRevisionO);

						if (peticion.getArchivos().size() > 0) {
							Archivo archivo = new Archivo();
							Log.info(peticion.getEstatus());
							Log.info("peticion.getArchivos().get(0).getCveUsuario()  "
									+ peticion.getArchivos().get(0).getCveUsuario());
							archivo.setCsEstatus(peticion.getEstatus());
							archivo.setCxNombre(peticion.getArchivos().get(0).getCxNombre());
							archivo.setCveUsuario(peticion.getArchivos().get(0).getCveUsuario());
							archivo.setCxUuid(peticion.getArchivos().get(0).getCxUuid());
							archivo.setCxUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
							archivo.setDfFechaCarga(LocalDate.now());
							archivo.setDhHoraCarga(LocalTime.now());
							archivo.setIdTipoDocumento(1);
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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(epilogo.getIdValidacionPlaneacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

							if (peticion.getArchivos().size() > 0) {
								Archivo archivo = new Archivo();
								Log.info(peticion.getEstatus());
								Log.info("peticion.getArchivos().get(0).getCveUsuario()  "
										+ peticion.getArchivos().get(0).getCveUsuario());
								archivo.setCsEstatus(peticion.getEstatus());
								archivo.setCxNombre(peticion.getArchivos().get(0).getCxNombre());
								archivo.setCveUsuario(peticion.getArchivos().get(0).getCveUsuario());
								archivo.setCxUuid(peticion.getArchivos().get(0).getCxUuid());
								archivo.setCxUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
								archivo.setDfFechaCarga(LocalDate.now());
								archivo.setDhHoraCarga(LocalTime.now());
								archivo.setIdTipoDocumento(1);
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

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				case 7:
					Log.info("peticion para usuario de Presupuesto");
					idValidacion = epilogo.getIdValidacion();
					Log.info("epilogo.getIdValidacion() " + idValidacion);
					if (idValidacion == null || idValidacion == 0) {
						Log.info("El idValidacion viene nulo para este idObjetivo  " + peticion.getId());
						MetValidacionEntity metValidacion = new MetValidacionEntity();
						metValidacion.setDfValidacion(LocalDate.now());
						metValidacion.setDhValidacion(LocalTime.now());
						metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
						metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
						metValidacion.setCsEstatus(peticion.getEstatus());
						metValidacionRepository.persistAndFlush(metValidacion);
						Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
						epilogo.setIdValidacion(metValidacion.getIdValidacion());
						epilogoRepository.persistAndFlush(epilogo);

						metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
						var elementosEnRevisionO = new ArrayList<MetRevisionValidacionEntity>();
						MetRevisionValidacionEntity metRevision = new MetRevisionValidacionEntity();
						peticion.getRevision().stream().map(el -> {
							MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
							revision.setIxCheck(el.getCheck());
							revision.setCxComentario(el.getComentarios());
							revision.setIdElementoValidar(el.getIdElemento());
							revision.setIdValidacion(metValidacion.getIdValidacion());
							return revision;
						}).forEach(elementosEnRevisionO::add);
						metRevisionValidacionRepository.persist(elementosEnRevisionO);

						if (peticion.getArchivos().size() > 0) {
							Archivo archivo = new Archivo();
							Log.info(peticion.getEstatus());
							Log.info("peticion.getArchivos().get(0).getCveUsuario()  "
									+ peticion.getArchivos().get(0).getCveUsuario());
							archivo.setCsEstatus(peticion.getEstatus());
							archivo.setCxNombre(peticion.getArchivos().get(0).getCxNombre());
							archivo.setCveUsuario(peticion.getArchivos().get(0).getCveUsuario());
							archivo.setCxUuid(peticion.getArchivos().get(0).getCxUuid());
							archivo.setCxUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
							archivo.setDfFechaCarga(LocalDate.now());
							archivo.setDhHoraCarga(LocalTime.now());
							archivo.setIdTipoDocumento(1);
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

					} else {
						var existeIdValidacion = metValidacionRepository.findById(idValidacion);
						if (!ObjectUtils.isEmpty(existeIdValidacion)) {
							Log.info("existeIdValidacion.getIdValidacion() " + existeIdValidacion.getIdValidacion());
							MetValidacionEntity metValidacion = new MetValidacionEntity();
							metValidacion.setDfValidacion(LocalDate.now());
							metValidacion.setDhValidacion(LocalTime.now());
							metValidacion.setCveUsuarioRegistra(peticion.getCveUsuario());
							metValidacion.setCveUsuarioActualiza(peticion.getCveUsuario());
							metValidacion.setCsEstatus(peticion.getEstatus());
							metValidacion.setIdValidacion(epilogo.getIdValidacion());

							metValidacionRepository.getEntityManager().merge(metValidacion);
							Log.info("metValidacion.getIdValidacion() " + metValidacion.getIdValidacion());

							metRevisionValidacionRepository.delete("idValidacion", metValidacion.getIdValidacion());
							var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();
							peticion.getRevision().stream().map(el -> {
								MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
								revision.setIxCheck(el.getCheck());
								revision.setCxComentario(el.getComentarios());
								revision.setIdElementoValidar(el.getIdElemento());
								revision.setIdValidacion(metValidacion.getIdValidacion());
								return revision;
							}).forEach(elementosEnRevision::add);
							metRevisionValidacionRepository.persist(elementosEnRevision);

							if (peticion.getArchivos().size() > 0) {
								Archivo archivo = new Archivo();
								Log.info(peticion.getEstatus());
								Log.info("peticion.getArchivos().get(0).getCveUsuario()  "
										+ peticion.getArchivos().get(0).getCveUsuario());
								archivo.setCsEstatus(peticion.getEstatus());
								archivo.setCxNombre(peticion.getArchivos().get(0).getCxNombre());
								archivo.setCveUsuario(peticion.getArchivos().get(0).getCveUsuario());
								archivo.setCxUuid(peticion.getArchivos().get(0).getCxUuid());
								archivo.setCxUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
								archivo.setDfFechaCarga(LocalDate.now());
								archivo.setDhHoraCarga(LocalTime.now());
								archivo.setIdTipoDocumento(1);
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

						} else {
							Log.info("No existe registro para el idValidacion " + peticion.getId());
							throw new BadRequestException("No existe registro para el id " + peticion.getId());
						}

					}
					break;
				default:
					throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
				}

				break;
			default:
				Log.info("Este apartado no esta considerado");
				throw new BadRequestException("Este apartado no esta considerado en esta solucion");
			}

		} catch (Exception e) {
			e.printStackTrace();
			respuesta = new RespuestaGenerica("400", "Error en la petición: " + e.getMessage());
		}
		return respuesta;
	}
	
	private void actualizaProgramaInstituacional(Usuario usuario, ValidacionDTO peticion, Epilogo epilogo) {
		if (EstatusEnum.APROBADO.getEstatus().equals(peticion.getEstatus())
			||	EstatusEnum.RECHAZADO.getEstatus().equals(peticion.getEstatus())) {
			Estructura estructura = estructuraRepository.findById(epilogo.getIdEstructura());
			estructura.setCsEstatus(peticion.getEstatus());
			estructura.setUsuario(usuario);
			estructuraRepository.persistAndFlush(estructura);			
		}
		
	}

	public MensajePersonalizado<ValidacionDTO> consultarRevision(String apartado, Integer id, String rol) {
		MensajePersonalizado<ValidacionDTO> respuesta = new MensajePersonalizado<ValidacionDTO>();
		var variasRevisiones = new ArrayList<Revision>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		Integer idValidacion = 1;

		switch (apartado) {
		case "INICIO":
			Log.info("Entrando a inicio");
			var estructura = estructuraRepository.findById(id);
			if (estructura == null)
				throw new BadRequestException("El idEstructura no existe, favor de validar.");
			switch (rol) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = estructura.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = estructura.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = estructura.getIdValidacion();
				break;
			}

			Log.info("estructura.getIdValidacion() " + idValidacion);

			break;
		case "OBJETIVOS":
			Log.info("Entrando a OBJETIVOS");
			var objetivo = catalogoRepo.findById(id);
			if (objetivo == null)
				throw new BadRequestException("El idObjetivo no existe, favor de validar.");
			switch (rol) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = objetivo.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = objetivo.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = objetivo.getIdValidacion();
				break;
			}
			Log.info("objetivo.getIdValidacion() " + idValidacion);
			break;
		case "ESTRATEGIAS-ACCIONES":
			Log.info("Entrando a \"ESTRATEGIAS-ACCIONES\"");
			var estrategia = catalogoRepo.findById(id);
			if (estrategia == null)
				throw new BadRequestException("El idEstrategia no existe, favor de validar.");
			switch (rol) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = estrategia.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = estrategia.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = estrategia.getIdValidacion();
				break;
			}
			Log.info("objetivo.getIdValidacion() " + idValidacion);
			break;
		case "METAS-PARA-EL-BIENESTAR":
			Log.info("Entrando a METAS-PARA-EL-BIENESTAR");
			var meta = metaRepository.findById(id);
			if (meta == null)
				throw new BadRequestException("El idMeta no existe, favor de validar.");
			switch (rol) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = meta.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = meta.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = meta.getIdValidacion();
				break;
			}
			Log.info("objetivo.getIdValidacion() " + idValidacion);
			break;
		case "PARAMETROS":
			Log.info("Entrando a \"PARAMETROS\"");
			var parametro = metaRepository.findById(id);
			if (parametro == null)
				throw new BadRequestException("El idMeta no existe, favor de validar.");
			switch (rol) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = parametro.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = parametro.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = parametro.getIdValidacion();
				break;
			}
			
			Log.info("objetivo.getIdValidacion() " + idValidacion);
			break;
		case "EPILOGO-CARGA-DEL-PI-Y-ACTAS":
			Log.info("Entrando a EPILOGO-CARGA-DEL-PI-Y-ACTAS");
			var epilogo = epilogoRepository.findById(id);
			if (epilogo == null)
				throw new BadRequestException("El id no existe, favor de validar.");
			switch (rol) {
			case "ENLACE":
			case "SUPERVISOR":
				idValidacion = epilogo.getIdValidacionSupervisor();
				break;
			case "PLANEACION":
				idValidacion = epilogo.getIdValidacionPlaneacion();
				break;
			case "PRESUPUESTO":
				idValidacion = epilogo.getIdValidacion();
				break;
			}
			Log.info("epilogo.getIdValidacion() " + idValidacion);
			break;
		default:
			Log.info("Este apartado no esta considerado");
		}
		Log.info("IdValidacion de busqueda() " + idValidacion);
		if (idValidacion==null) {
			throw new BadRequestException("No hay validación para el id indicado.");
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

		var validacion = metValidacionRepository.findById(idValidacion);

		ValidacionDTO validacionDTO = new ValidacionDTO();
		validacionDTO.setApartado(apartado);
		validacionDTO.setCveUsuario(validacion.getCveUsuarioRegistra());
		validacionDTO.setEstatus(validacion.getCsEstatus());
		validacionDTO.setId(idValidacion);

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
