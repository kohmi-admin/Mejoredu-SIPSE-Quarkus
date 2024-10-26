package mx.sep.dgtic.sipse.medianoplazo.servicios.impl;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import mx.sep.dgtic.mejoredu.medianoplazo.dtos.*;
import mx.sep.dgtic.sipse.medianoplazo.daos.EstructuraRepository;
import mx.sep.dgtic.sipse.medianoplazo.entidades.*;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.springframework.stereotype.Service;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.jasper.JasperReportResponse;
import mx.edu.sep.dgtic.mejoredu.rest.client.model.ResponseCreateFile;
import mx.sep.dgtic.sipse.medianoplazo.daos.ArchivoRepository;
import mx.sep.dgtic.sipse.medianoplazo.daos.CargaEpilogoRepository;
import mx.sep.dgtic.sipse.medianoplazo.daos.EpilogoRepository;
import mx.sep.dgtic.sipse.medianoplazo.rest.client.AlfrescoRestClient;
import mx.sep.dgtic.sipse.medianoplazo.rest.client.MultipartBody;
import mx.sep.dgtic.sipse.medianoplazo.servicios.EpilogoService;
import mx.sep.dgtic.sipse.medianoplazo.util.JasperReportManager;

@Service
public class EpilogoServiceImpl implements EpilogoService {
	@Inject
	private EstructuraRepository estructuraRepository;
	@Inject
	private EpilogoRepository epilogoRepository;
	@Inject
	private CargaEpilogoRepository cargaEpilogoRepository;
	@Inject
	private ArchivoRepository archivoRepository;
	@RestClient
	private AlfrescoRestClient alfrescoRest;
	@ConfigProperty(name = "sipse.alf.uuid")
	private String UUID;
	@Inject
	private JasperReportManager reportManager;

	@Inject
	private MasterCatalogoServiceImpl masterCatalogoService;
	@Inject
	private EstrategiaServiceImpl estrategiaService;

	@Override
	public RespuestaEpilogoDTO consultarPorIdEstructura(Integer idEstructura) {
		var epilogo = epilogoRepository.findFirstByEstructura(idEstructura).orElseThrow(() -> {
			throw new NotFoundException("No se encontró el epilogo de la estructura " + idEstructura);
		});

		var epilogoDTO = new RespuestaEpilogoDTO();
		epilogoDTO.setIdEpilogo(epilogo.getIdEpilogo());
		epilogoDTO.setIdEstructura(epilogo.getIdEstructura());
		epilogoDTO.setDescripcion(epilogo.getCxDescripcion());
		epilogoDTO.setEstatus(epilogo.getCsEstatus());

		var archivosCargados = epilogo.getCargaEpilogos();
		var archivosPI = new ArrayList<EpilogoArchivoDTO>();
		var actas = new ArrayList<EpilogoArchivoDTO>();

		for (var cargaEpilogo : archivosCargados) {
			if (cargaEpilogo.getIxTipoDocumento() == 1) {
				var epilogoArchivo = cargaEpilogoToDTO(cargaEpilogo);
				archivosPI.add(epilogoArchivo);
			} else if (cargaEpilogo.getIxTipoDocumento() == 2) {
				var epilogoArchivo = cargaEpilogoToDTO(cargaEpilogo);
				actas.add(epilogoArchivo);
			}
		}

		epilogoDTO.setArchivosPI(archivosPI);
		epilogoDTO.setActas(actas);

		return epilogoDTO;
	}

	@Override
	public RespuestaEpilogoDTO consultarPorId(Integer idEpilogo) {
		var epilogo = epilogoRepository.findByIdOptional(idEpilogo).orElseThrow(() -> {
			throw new NotFoundException("No se encontró el epilogo " + idEpilogo);
		});

		var epilogoDTO = new RespuestaEpilogoDTO();
		epilogoDTO.setIdEpilogo(epilogo.getIdEpilogo());
		epilogoDTO.setIdEstructura(epilogo.getIdEstructura());
		epilogoDTO.setDescripcion(epilogo.getCxDescripcion());
		epilogoDTO.setEstatus(epilogo.getCsEstatus());

		var archivosCargados = epilogo.getCargaEpilogos();
		var archivosPI = new ArrayList<EpilogoArchivoDTO>();
		var actas = new ArrayList<EpilogoArchivoDTO>();

		for (var cargaEpilogo : archivosCargados) {
			if (cargaEpilogo.getIxTipoDocumento() == 1) {
				var epilogoArchivo = cargaEpilogoToDTO(cargaEpilogo);
				archivosPI.add(epilogoArchivo);
			} else if (cargaEpilogo.getIxTipoDocumento() == 2) {
				var epilogoArchivo = cargaEpilogoToDTO(cargaEpilogo);
				actas.add(epilogoArchivo);
			}
		}

		epilogoDTO.setArchivosPI(archivosPI);
		epilogoDTO.setActas(actas);

		return epilogoDTO;
	}

	@Override
	@Transactional
	public void registrar(PeticionEpilogoDTO epilogoPeticion) {
		var epilogoExistente = epilogoRepository.findFirstByEstructura(epilogoPeticion.getIdEstructura());
		if (epilogoExistente.isPresent()) {
			modificar(epilogoPeticion, epilogoExistente.get().getIdEpilogo());
			return;
		}

		var epilogo = new Epilogo();

		epilogo.setCxDescripcion(epilogoPeticion.getDescripcion());
		epilogo.setCsEstatus(epilogoPeticion.getEstatus());
		epilogo.setIdEstructura(epilogoPeticion.getIdEstructura());

		epilogoRepository.persist(epilogo);

		epilogoPeticion.getActas().stream().map(it -> {
			var cargaEpilogo = new CargaEpilogo();

			cargaEpilogo.setEpilogo(epilogo);
			cargaEpilogo.setIdEpilogo(epilogo.getIdEpilogo());
			cargaEpilogo.setCsEstatus("A");
			cargaEpilogo.setIxTipoDocumento(2);

			var archivo = archivoRepository.consultarPorUUID(it.getUuid()).orElseGet(() -> {
				var nuevoArchivo = new Archivo();

				nuevoArchivo.setCxUuid(it.getUuid());
				nuevoArchivo.setCsEstatus("A");
				nuevoArchivo.setCveUsuario(epilogoPeticion.getCveUsuario());
				nuevoArchivo.setDfFechaCarga((LocalDate.now()));
				nuevoArchivo.setDhHoraCarga((LocalTime.now()));
				nuevoArchivo.setIdTipoDocumento(it.getTipoArchivo());
				nuevoArchivo.setCxNombre(it.getNombre());

				archivoRepository.persist(nuevoArchivo);
				return nuevoArchivo;
			});

			cargaEpilogo.setIdArchivo(archivo.getIdArchivo());

			return cargaEpilogo;
		}).forEach(epilogo::addCargaEpilogo);

		epilogoPeticion.getArchivosPI().stream().map(it -> {
			var cargaEpilogo = new CargaEpilogo();

			cargaEpilogo.setEpilogo(epilogo);
			cargaEpilogo.setIdEpilogo(epilogo.getIdEpilogo());
			cargaEpilogo.setCsEstatus("A");
			cargaEpilogo.setIxTipoDocumento(1);

			var archivo = archivoRepository.consultarPorUUID(it.getUuid()).orElseGet(() -> {
				var nuevoArchivo = new Archivo();

				nuevoArchivo.setCxUuid(it.getUuid());
				nuevoArchivo.setCsEstatus("A");
				nuevoArchivo.setCveUsuario(epilogoPeticion.getCveUsuario());
				nuevoArchivo.setDfFechaCarga((LocalDate.now()));
				nuevoArchivo.setDhHoraCarga((LocalTime.now()));
				nuevoArchivo.setIdTipoDocumento(it.getTipoArchivo());
				nuevoArchivo.setCxNombre(it.getNombre());

				archivoRepository.persist(nuevoArchivo);
				return nuevoArchivo;
			});

			cargaEpilogo.setIdArchivo(archivo.getIdArchivo());

			return cargaEpilogo;
		}).forEach(epilogo::addCargaEpilogo);

		epilogoRepository.persistAndFlush(epilogo);
	}

	@Override
	@Transactional
	public void modificar(PeticionEpilogoDTO epilogoPeticion, Integer idEpilogo) {
		var epilogo = epilogoRepository.findByIdOptional(idEpilogo).orElseThrow(() -> {
			throw new NotFoundException("No se encontró el epilogo " + idEpilogo);
		});

		epilogo.setCxDescripcion(epilogoPeticion.getDescripcion());
		epilogo.setCsEstatus(epilogoPeticion.getEstatus());
		epilogo.setIdEstructura(epilogoPeticion.getIdEstructura());

		cargaEpilogoRepository.delete("epilogo", epilogo);

		epilogoPeticion.getActas().stream().map(it -> {
			var cargaEpilogo = new CargaEpilogo();

			cargaEpilogo.setEpilogo(epilogo);
			cargaEpilogo.setIdEpilogo(epilogo.getIdEpilogo());
			cargaEpilogo.setCsEstatus("A");
			cargaEpilogo.setIxTipoDocumento(2);

			var archivo = archivoRepository.consultarPorUUID(it.getUuid()).orElseGet(() -> {
				var nuevoArchivo = new Archivo();

				nuevoArchivo.setCxUuid(it.getUuid());
				nuevoArchivo.setCsEstatus("A");
				nuevoArchivo.setCveUsuario(epilogoPeticion.getCveUsuario());
				nuevoArchivo.setDfFechaCarga((LocalDate.now()));
				nuevoArchivo.setDhHoraCarga((LocalTime.now()));
				nuevoArchivo.setIdTipoDocumento(it.getTipoArchivo());
				nuevoArchivo.setCxNombre(it.getNombre());

				archivoRepository.persist(nuevoArchivo);
				return nuevoArchivo;
			});

			cargaEpilogo.setIdArchivo(archivo.getIdArchivo());

			return cargaEpilogo;
		}).forEach(epilogo::addCargaEpilogo);

		epilogoPeticion.getArchivosPI().stream().map(it -> {
			var cargaEpilogo = new CargaEpilogo();

			cargaEpilogo.setEpilogo(epilogo);
			cargaEpilogo.setIdEpilogo(epilogo.getIdEpilogo());
			cargaEpilogo.setCsEstatus("A");
			cargaEpilogo.setIxTipoDocumento(1);

			var archivo = archivoRepository.consultarPorUUID(it.getUuid()).orElseGet(() -> {
				var nuevoArchivo = new Archivo();

				nuevoArchivo.setCxUuid(it.getUuid());
				nuevoArchivo.setCsEstatus("A");
				nuevoArchivo.setCveUsuario(epilogoPeticion.getCveUsuario());
				nuevoArchivo.setDfFechaCarga((LocalDate.now()));
				nuevoArchivo.setDhHoraCarga((LocalTime.now()));
				nuevoArchivo.setIdTipoDocumento(it.getTipoArchivo());
				nuevoArchivo.setCxNombre(it.getNombre());

				archivoRepository.persist(nuevoArchivo);
				return nuevoArchivo;
			});

			cargaEpilogo.setIdArchivo(archivo.getIdArchivo());

			return cargaEpilogo;
		}).forEach(epilogo::addCargaEpilogo);

		epilogoRepository.persistAndFlush(epilogo);
	}

	@Override
	@Transactional
	public void eliminar(Integer idEpilogo) {
		var epilogo = epilogoRepository.findByIdOptional(idEpilogo).orElseThrow(() -> {
			throw new NotFoundException("No se encontró el epilogo " + idEpilogo);
		});

		epilogo.setCsEstatus("B");
		epilogoRepository.persist(epilogo);
	}

	@Override
	public List<EpilogoArchivoDTO> consultarArchivosPorId(Integer idEpilogo) {
		var epilogo = epilogoRepository.findByIdOptional(idEpilogo).orElseThrow(() -> {
			throw new NotFoundException("No se encontró el epilogo " + idEpilogo);
		});

		var archivosCargados = epilogo.getCargaEpilogos();
		var archivosPI = new ArrayList<EpilogoArchivoDTO>();
		var actas = new ArrayList<EpilogoArchivoDTO>();

		for (var cargaEpilogo : archivosCargados) {
			if (cargaEpilogo.getIxTipoDocumento() == 1) {
				var epilogoArchivo = cargaEpilogoToDTO(cargaEpilogo);
				archivosPI.add(epilogoArchivo);
			} else if (cargaEpilogo.getIxTipoDocumento() == 2) {
				var epilogoArchivo = cargaEpilogoToDTO(cargaEpilogo);
				actas.add(epilogoArchivo);
			}
		}

		var lista = new ArrayList<EpilogoArchivoDTO>();
		lista.addAll(archivosPI);
		lista.addAll(actas);
		return lista;
	}

	@Override
	public List<EpilogoArchivoDTO> consultarArchivosPorId(Integer idEpilogo, Integer idTipoArchivo) {
		var epilogo = epilogoRepository.findByIdOptional(idEpilogo).orElseThrow(() -> {
			throw new NotFoundException("No se encontró el epilogo " + idEpilogo);
		});

		var archivosCargados = epilogo.getCargaEpilogos();
		var archivosPI = new ArrayList<EpilogoArchivoDTO>();

		archivosCargados.stream().filter(cargaEpilogo -> cargaEpilogo.getIxTipoDocumento() == idTipoArchivo)
				.forEach(cargaEpilogo -> {
					var epilogoArchivo = cargaEpilogoToDTO(cargaEpilogo);
					archivosPI.add(epilogoArchivo);
				});

		return archivosPI;
	}

	private EpilogoArchivoDTO cargaEpilogoToDTO(CargaEpilogo cargaEpilogo) {
		var epilogoArchivo = new EpilogoArchivoDTO();
		epilogoArchivo.setIdCarga(cargaEpilogo.getIdCarga());
		epilogoArchivo.setEstatus(cargaEpilogo.getCsEstatus());
		epilogoArchivo.setTipoDocumento(cargaEpilogo.getIxTipoDocumento());

		var archivo = new ArchivoDTO();
		archivo.setIdArchivo(cargaEpilogo.getArchivo().getIdArchivo());
		archivo.setCxUuid(cargaEpilogo.getArchivo().getCxUuid());
		archivo.setCxUuidToPdf(cargaEpilogo.getArchivo().getCxUuidToPdf());
		archivo.setCxNombre(cargaEpilogo.getArchivo().getCxNombre());
		archivo.setCveUsuario(cargaEpilogo.getArchivo().getCveUsuario());
		archivo.setDfFechaCarga(cargaEpilogo.getArchivo().getDfFechaCarga());
		archivo.setDfHoraCarga(cargaEpilogo.getArchivo().getDhHoraCarga());
		archivo.setCsEstatus(cargaEpilogo.getArchivo().getCsEstatus());

		epilogoArchivo.setArchivo(archivo);

		return epilogoArchivo;
	}

	@Override
	public RespuestaReporteMedianoPlazo consultarReporte(Integer anhio) {
		var estructura = estructuraRepository.find("anhoPlaneacion.idAnhio = ?1 and csEstatus !='B'", anhio)
				.firstResultOptional()
				.orElseThrow(() -> new NotFoundException("No se encontró la estructura para el año " + anhio));

		var objetivos = masterCatalogoService.consultarObjetivos().getRespuesta()
				.stream().map(it -> {
					var estrategias = estrategiaService.consultarActivos(it.getIdObjetivo().toString()).getRespuesta();
					var objetivoEstrategia = new ObjetivoEstrategia();
					objetivoEstrategia.setIdObjetivo(it.getIdObjetivo());
					objetivoEstrategia.setCdObjetivo(it.getCdObjetivo());
					objetivoEstrategia.setIxObjetivo(it.getIxObjetivo());
					objetivoEstrategia.setRelevancia(it.getRelevancia());
					objetivoEstrategia.setUsuario(it.getUsuario());
					objetivoEstrategia.setEstrategias(estrategias);
					return objetivoEstrategia;
				}).toList();

		var metas = estructura.getMeta();
		var metasBienestar = metas.stream()
				.filter(it -> it.getIxTipo() == 1)
				.toList();
		var parametros = metas.stream()
				.filter(it -> it.getIxTipo() == 2)
				.toList();

		var epilogos = estructura.getEpilogo();

		var respuesta = new RespuestaReporteMedianoPlazo();
		respuesta.setIdEstructura(estructura.getIdEstructura());
		respuesta.setNombrePrograma(estructura.getCdNombrePrograma());
		respuesta.setAnalisis(estructura.getCdAnalisisEstado());
		respuesta.setProblemasPublicos(estructura.getCdProblemasPublicos());
		respuesta.setEpilogo(epilogos.stream().findFirst().map(Epilogo::getCxDescripcion).orElse(null));
		respuesta.setMetasBienestar(metasBienestar.stream().map(it -> {
			var metaReporte = new MetaReporte();
			metaReporte.setIdMetasBienestar(it.getIdMetasBienestar());

			var elemento = it.getElemento().stream().findFirst();

			if (elemento.isPresent()) {
				metaReporte.setNombre(elemento.get().getCxNombre());
				metaReporte.setMeta(elemento.get().getCxDefinicion());
			}

			var objetivo = elemento.map(Elemento::getObjetivo);

			if (objetivo.isPresent()) {
				metaReporte.setIdObjetivo(objetivo.get().getIdCatalogo());
				metaReporte.setObjetivo(objetivo.get().getCdOpcion());
			}

			return metaReporte;
		}).toList());
		respuesta.setParametros(parametros.stream().map(it -> {
			var metaReporte = new MetaReporte();
			metaReporte.setIdMetasBienestar(it.getIdMetasBienestar());

			var elemento = it.getElemento().stream().findFirst();

			if (elemento.isPresent()) {
				metaReporte.setNombre(elemento.get().getCxNombre());
				metaReporte.setMeta(elemento.get().getCxDefinicion());
			}

			var objetivo = elemento.map(Elemento::getObjetivo);

			if (objetivo.isPresent()) {
				metaReporte.setIdObjetivo(objetivo.get().getIdCatalogo());
				metaReporte.setObjetivo(objetivo.get().getCdOpcion());
			}

			return metaReporte;
		}).toList());
		respuesta.setObjetivos(objetivos);

		return respuesta;
	}

	@Override
	public RespuestaGenerica generaReporte(Integer anio) {
		JasperReportResponse responseFile = reportManager.getItemReport("epilogo_reporte", anio);
		MultipartBody multi = new MultipartBody();
		multi.name = responseFile.getNombreArchivo();
		multi.filedata = new ByteArrayInputStream(responseFile.getStreamByte());
		multi.overwrite = true;
		try {
			Response responseSave = alfrescoRest.createFile(UUID, multi);
			ResponseCreateFile nodeCreate = responseSave.readEntity(ResponseCreateFile.class);
			String uuidPDF = nodeCreate.getEntry().getId();
			return new RespuestaGenerica("200", uuidPDF);
		} catch (Exception e) {
			Log.error("Error al depositar el archivo en Alfresco: ", e);
			return new RespuestaGenerica("500", "Error al depositar el archivo en Alfresco");
		}
	}
}
