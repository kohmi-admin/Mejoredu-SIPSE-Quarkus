package mx.mejoredu.dgtic.servicios.Impl;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.seguimiento.RespuestaProductosNoProgramadosVO;
import mx.mejoredu.dgtic.dao.*;
import mx.mejoredu.dgtic.entity.*;
import mx.mejoredu.dgtic.servicios.ProductoNoProgramadoService;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionProductosNoProgramadosVO;
import org.springframework.stereotype.Service;

@Service
public class ProductoNoProgramadoServiceImpl implements ProductoNoProgramadoService {

	@Inject
	private AvanceRepository avanceRepository;
	@Inject
	private CortoplazoActividadRepository actividadRepository;
	@Inject
	private UsuarioRepository usuarioRepository;
	@Inject
	private ArchivoRepository archivoRepository;
	@Inject
	private TipoDocumentoRepository tipoDocumentoRepository;
	@Inject
	private EvidenciaDocumentoRepository documentoRepository;
	@Inject
	private EvidenciaMensualRepository evidenciaMensualRepository;
	@Inject
	private EvidenciaTrimestralRepository evidenciaTrimestralRepository;
	
	@Transactional
	@Override
	public RespuestaProductosNoProgramadosVO registrar(PeticionProductosNoProgramadosVO peticion, String cveUsuario) {
		usuarioRepository.findByIdOptional(cveUsuario)
				.orElseThrow(() -> new BadRequestException("Usuario no encontrado"));
		CortoplazoActividad actividad = actividadRepository.findByIdOptional(peticion.getIdActividad())
				.orElseThrow(() -> new BadRequestException("Actividad no encontrada"));
		Usuario usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario())
				.orElseThrow(() -> new BadRequestException("Usuario no encontrado"));
		TipoDocumento tipoDocumento = tipoDocumentoRepository.findByExtension("pdf");

		var evidenciaTrimestral = new EvidenciaTrimestral();
		evidenciaTrimestral.setIdArticulacionActividades(peticion.getEvidenciaComplementaria().getIdArticulacion());
		evidenciaTrimestral.setDificultadesSuperacion(peticion.getEvidenciaComplementaria().getDificultad());

		evidenciaTrimestral.setFechaSesion(peticion.getEvidenciaComplementaria().getFechaSesion());
		evidenciaTrimestral.setAprobacionJuntaDirectiva(peticion.getEvidenciaComplementaria().getAprobado());
		evidenciaTrimestral.setFechaAprobacion(peticion.getEvidenciaComplementaria().getFechaAprobacion());

		evidenciaTrimestral.setIdTipoPublicacion(peticion.getEvidenciaComplementaria().getTipoPublicacion());
		evidenciaTrimestral.setEspecificarPublicacion(peticion.getEvidenciaComplementaria().getEspecificarPublicacion());

		evidenciaTrimestral.setIdTipoDifusion(peticion.getEvidenciaComplementaria().getTipoDifusion());
		evidenciaTrimestral.setEspecificarDifusion(peticion.getEvidenciaComplementaria().getEspecificarDifusion());

		evidenciaTrimestralRepository.persistAndFlush(evidenciaTrimestral);

		EvidenciaMensual evidenciaMensual = new EvidenciaMensual();
		evidenciaMensual.setEstatus(EstatusEnum.COMPLETO.getEstatus());
		evidenciaMensual.setJustificacion(peticion.getEvidencia().getJustificacion());
		evidenciaMensual.setDescripcionTareas(peticion.getEvidencia().getDescripcionTareas());
		evidenciaMensual.setDescripcionProducto(peticion.getEvidencia().getDescripcionProducto());

		evidenciaMensualRepository.persistAndFlush(evidenciaMensual);

		peticion.getEvidencia().getArchivos().forEach(archivoVO -> {
			var archivoDB = archivoRepository.find("uuid", archivoVO.getUuid()).firstResultOptional()
					.orElseGet(() -> {
						Archivo archivo = new Archivo();
						archivo.setEstatus("C");
						archivo.setNombre(archivoVO.getNombre());
						archivo.setUuid(archivoVO.getUuid());
						archivo.setFechaCarga(LocalDate.now());
						archivo.setHoraCarga(LocalTime.now());
						archivo.setTipoDocumento(tipoDocumento);
						archivo.setUsuario(usuario);

						return archivo;
					});

			archivoRepository.persistAndFlush(archivoDB);

			EvidenciaDocumento evidenciaDocumento = new EvidenciaDocumento();
			EvidenciaDocumentoPK evidenciaDocumentoPK = new EvidenciaDocumentoPK();
			evidenciaDocumentoPK.setIdEvidenciaMensual(evidenciaMensual.getIdEvidenciaMensual());
			evidenciaDocumentoPK.setIdArchivo(archivoDB.getIdArchivo());
			evidenciaDocumento.setId(evidenciaDocumentoPK);
			documentoRepository.persistAndFlush(evidenciaDocumento);

		});


		Avance avance = new Avance();
		avance.setCortoplazoActividad(actividad);
		avance.setEvidenciaMensual(evidenciaMensual);
		avance.setEvidenciaTrimestral(evidenciaTrimestral);
		avance.setIxTipoRegistro(3);
		avance.setCxMes(peticion.getMes());
		avance.setCveUsuario(cveUsuario);

		avanceRepository.persistAndFlush(avance);

		RespuestaProductosNoProgramadosVO respuesta = new RespuestaProductosNoProgramadosVO();
		respuesta.setIdAvance(avance.getIdAvance());
		respuesta.setIdEvidenciaMensual(evidenciaMensual.getIdEvidenciaMensual());
		respuesta.setIdEvidenciaTrimestral(evidenciaTrimestral.getIdEvidenciaTrimestral());

		return respuesta;
	}
}
