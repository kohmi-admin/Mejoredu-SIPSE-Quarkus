package mx.sep.dgtic.sipse.medianoplazo.servicios.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO2;
import mx.sep.dgtic.sipse.medianoplazo.daos.AccionPuntualRepository;
import mx.sep.dgtic.sipse.medianoplazo.entidades.AccionPuntual;
import org.springframework.stereotype.Service;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.AccionDTO;
import mx.sep.dgtic.sipse.medianoplazo.daos.MasterCatalogoRepository;
import mx.sep.dgtic.sipse.medianoplazo.daos.UsuarioRepository;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MasterCatalogo;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Usuario;
import mx.sep.dgtic.sipse.medianoplazo.servicios.IAccionService;

@Service
public class AccionServiceImpl implements IAccionService {
	
	final private Integer IDCATACCION = 640;

	@Inject
	MasterCatalogoRepository catalogoRepo;
	@Inject
	private UsuarioRepository usuarioRepository;
	@Inject
	private AccionPuntualRepository accionPuntualRepository;

	@Override
	public List<MasterCatalogoDTO2> consultarCatalogoObjetivos(Integer anhio) {
		return accionPuntualRepository.list("estructura.anhoPlaneacion.idAnhio = ?1 AND catalogo.dfBaja IS NULL", anhio)
				.stream().map(it -> {
					var listaNueva = it.getCatalogo();

					var masterCatalogoDto = new MasterCatalogoDTO2();
					masterCatalogoDto.setIdCatalogo(listaNueva.getIdCatalogo());
					masterCatalogoDto.setIdCatalgoPadre(listaNueva.getMasterCatalogo2().getIdCatalogo());
					masterCatalogoDto.setCdOpcion(listaNueva.getCdOpcion());
					masterCatalogoDto.setCcExterna(listaNueva.getCcExterna());
					masterCatalogoDto.setCcExternaDos(listaNueva.getCcExternaDos());
					masterCatalogoDto.setCdDescripcionDos(listaNueva.getCdDescripcionDos());

					return masterCatalogoDto;
				}).toList();
	}

	@Override
	public MensajePersonalizado<List<AccionDTO>> consultarActivos(String cveEstrategia) {
		MensajePersonalizado<List<AccionDTO>> respuesta = new MensajePersonalizado<List<AccionDTO>>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		Log.info("Buscando por cveEstrategia = " + cveEstrategia);
		List<MasterCatalogo> lstEstructura = catalogoRepo
				.find("MasterCatalogo2.idCatalogo = ?1 and dfBaja is null  and cdDescripcionDos=?2", IDCATACCION,
						cveEstrategia)
				.list();
		List<AccionDTO> lstAcciones = new ArrayList<>();
		lstEstructura.stream().map(objeto -> {
			AccionDTO objDto = new AccionDTO();
			objDto.setIdAccion(objeto.getIdCatalogo());
			objDto.setCveAccion(objeto.getCcExterna());
			objDto.setCdAccion(objeto.getCdOpcion());
			objDto.setCveEstrategia(objeto.getCdDescripcionDos());
			objDto.setUsuario(objeto.getUsuario().getCveUsuario());
			return objDto;
		}).forEach(lstAcciones::add);
		respuesta.setRespuesta(lstAcciones);
		return respuesta;
	}
	
	@Override
	public MensajePersonalizado<List<AccionDTO>> consultarPorID(Integer idAccion) {
		MensajePersonalizado<List<AccionDTO>> respuesta = new MensajePersonalizado<List<AccionDTO>>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		Log.info("Buscando por idAccion = " + idAccion);
		List<MasterCatalogo> lstEstructura = catalogoRepo
				.find("idCatalogo = ?1 and dfBaja is null  and MasterCatalogo2.idCatalogo=?2", idAccion,
						IDCATACCION)
				.list();
		List<AccionDTO> lstAcciones = new ArrayList<>();
		lstEstructura.stream().map(objeto -> {
			AccionDTO objDto = new AccionDTO();
			objDto.setIdAccion(objeto.getIdCatalogo());
			objDto.setCveAccion(objeto.getCcExterna());
			objDto.setCdAccion(objeto.getCdOpcion());
			objDto.setCveEstrategia(objeto.getCdDescripcionDos());
			objDto.setUsuario(objeto.getUsuario().getCveUsuario());
			return objDto;
		}).forEach(lstAcciones::add);
		respuesta.setRespuesta(lstAcciones);
		return respuesta;
	}
	@Override
	@Transactional
	public RespuestaGenerica registrar(AccionDTO peticion) {
		MasterCatalogo catalogo = new MasterCatalogo();
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			Usuario usuario = usuarioRepository.findById(peticion.getUsuario());
			if (usuario == null)
				return new RespuestaGenerica("500", "El usuario no existe, validar.");
			catalogo.setCdOpcion(peticion.getCdAccion());
			catalogo.setCcExterna(peticion.getCveAccion());
			catalogo.setCdDescripcionDos(peticion.getCveEstrategia());
			MasterCatalogo catalogoPadre = catalogoRepo.findById(IDCATACCION);
			if (catalogoPadre == null)
				return new RespuestaGenerica("500", "El catálogo de acciones ID= "+IDCATACCION+" no existe, validar.");
			catalogo.setMasterCatalogo2(catalogoPadre);
			
			catalogo.setUsuario(usuario);
			catalogoRepo.persistAndFlush(catalogo);

			// Este es un catalogo anidado
			var accion = new AccionPuntual();
			accion.setIdCatalogo(catalogo.getIdCatalogo());
			accion.setIdEstrucutra(peticion.getIdEstructura());

			accionPuntualRepository.persistAndFlush(accion);
		} catch (Exception e) {
			respuesta = new RespuestaGenerica("500", "Error al registrar: " + e.getMessage());
		}
		return respuesta;
	}
	@Override
	@Transactional
	public RespuestaGenerica modificar(AccionDTO peticion) {
		
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			MasterCatalogo catalogo = catalogoRepo.findById(peticion.getIdAccion());
			if (catalogo == null)
				return new RespuestaGenerica("500", "El catálogo de acciones ID= "+IDCATACCION+" no existe, validar.");
			
			Usuario usuario = usuarioRepository.findById(peticion.getUsuario());
			if (usuario == null)
				return new RespuestaGenerica("500", "El usuario no existe, validar.");

			accionPuntualRepository.find("idCatalogo = ?1", catalogo.getIdCatalogo())
					.firstResultOptional()
					.orElseGet(() -> {
						var accion = new AccionPuntual();
						accion.setIdCatalogo(catalogo.getIdCatalogo());
						accion.setIdEstrucutra(peticion.getIdEstructura());

						accionPuntualRepository.persistAndFlush(accion);
						return accion;
					});

			catalogo.setCdOpcion(peticion.getCdAccion());
			catalogo.setCdDescripcionDos(peticion.getCveEstrategia());
			catalogo.setCcExterna(peticion.getCveAccion());
			
			catalogo.setUsuario(usuario);
			catalogoRepo.persistAndFlush(catalogo);
		} catch (Exception e) {
			respuesta = new RespuestaGenerica("500", "Error al registrar: " + e.getMessage());
		}
		return respuesta;
	}
	@Override
	@Transactional
	public RespuestaGenerica eliminar(AccionDTO peticion) {
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			MasterCatalogo catalogo = catalogoRepo.findById(peticion.getIdAccion());
			if (catalogo == null)
				return new RespuestaGenerica("500", "El catálogo de acciones ID= "+IDCATACCION+" no existe, validar.");
			
			Usuario usuario = usuarioRepository.findById(peticion.getUsuario());
			if (usuario == null)
				return new RespuestaGenerica("500", "El usuario no existe, validar.");
			catalogo.setDfBaja(LocalDate.now());
			catalogo.setUsuario(usuario);
			catalogoRepo.persistAndFlush(catalogo);
		} catch (Exception e) {
			respuesta = new RespuestaGenerica("500", "Error al registrar: " + e.getMessage());
		}
		return respuesta;
	}

}
