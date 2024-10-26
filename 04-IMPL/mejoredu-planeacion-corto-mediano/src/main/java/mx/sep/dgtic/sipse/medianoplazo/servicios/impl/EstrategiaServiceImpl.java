package mx.sep.dgtic.sipse.medianoplazo.servicios.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO2;
import mx.sep.dgtic.sipse.medianoplazo.daos.EstrategiaPrioritariaRepository;
import mx.sep.dgtic.sipse.medianoplazo.entidades.EstrategiaPrioritaria;
import org.springframework.stereotype.Service;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;
import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.EstrategiaDTO;

import mx.sep.dgtic.sipse.medianoplazo.daos.MasterCatalogoRepository;
import mx.sep.dgtic.sipse.medianoplazo.daos.UsuarioRepository;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MasterCatalogo;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Usuario;
import mx.sep.dgtic.sipse.medianoplazo.servicios.IEstrategiaService;

@Service
public class EstrategiaServiceImpl implements IEstrategiaService {

	final private Integer IDCATESTRATEGIA = 771;

	@Inject
	MasterCatalogoRepository catalogoRepo;
	@Inject
	private UsuarioRepository usuarioRepository;
	
	@Inject
    EntityManager em;
	@Inject
	private EstrategiaPrioritariaRepository estrategiaPrioritariaRepository;

	@Override
	public List<MasterCatalogoDTO2> consultarCatalogoObjetivos(Integer anhio) {
		return estrategiaPrioritariaRepository.list("estructura.anhoPlaneacion.idAnhio = ?1 AND catalogo.dfBaja IS NULL", anhio)
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
	public MensajePersonalizado<List<EstrategiaDTO>> consultarActivos(String cveObjetivo) {
		MensajePersonalizado<List<EstrategiaDTO>> respuesta = new MensajePersonalizado<List<EstrategiaDTO>>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		Log.info("Buscando por ccExterna = " + cveObjetivo);
		List<MasterCatalogo> lstEstructura = catalogoRepo
				.find("MasterCatalogo2.idCatalogo = ?1 and dfBaja is null  and ccExterna=?2", IDCATESTRATEGIA,
						cveObjetivo)
				.list();
		List<EstrategiaDTO> lstEstrategias = new ArrayList<>();
		lstEstructura.stream().map(objeto -> {
			EstrategiaDTO objDto = new EstrategiaDTO();
			objDto.setIdEstrategia(objeto.getIdCatalogo());
			objDto.setCveObjetivo(objeto.getCcExterna());
			objDto.setCveEstrategia(objeto.getCcExternaDos());
			objDto.setCdEstrategia(objeto.getCdOpcion());
			objDto.setUsuario(objeto.getUsuario().getCveUsuario());
			return objDto;
		}).forEach(lstEstrategias::add);
		respuesta.setRespuesta(lstEstrategias);
		return respuesta;
	}

	@Override
	public MensajePersonalizado<List<EstrategiaDTO>> consultarActivosPorId(Integer idEstrategia) {
		MensajePersonalizado<List<EstrategiaDTO>> respuesta = new MensajePersonalizado<List<EstrategiaDTO>>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		Log.info("Buscando por idEstrategia = " + idEstrategia);
		List<MasterCatalogo> lstEstructura = catalogoRepo.find("idCatalogo", idEstrategia).list();
		List<EstrategiaDTO> lstEstrategias = new ArrayList<>();
		lstEstructura.stream().map(objeto -> {
			EstrategiaDTO objDto = new EstrategiaDTO();
			objDto.setIdEstrategia(objeto.getIdCatalogo());
			objDto.setCveEstrategia(objeto.getCcExternaDos());

			objDto.setCveObjetivo(objeto.getCcExterna());
			objDto.setCdEstrategia(objeto.getCdOpcion());
			objDto.setUsuario(objeto.getUsuario().getCveUsuario());
			return objDto;
		}).forEach(lstEstrategias::add);
		respuesta.setRespuesta(lstEstrategias);
		return respuesta;
	}

	@Override
	@Transactional
	public RespuestaGenerica registrar(EstrategiaDTO peticion) {
		MasterCatalogo catalogo = new MasterCatalogo();
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			catalogo.setCdOpcion(peticion.getCdEstrategia());
			catalogo.setCcExterna(peticion.getCveObjetivo());
			catalogo.setCcExternaDos(peticion.getCveEstrategia());
			MasterCatalogo catalogoPadre = catalogoRepo.findById(IDCATESTRATEGIA);
			catalogo.setMasterCatalogo2(catalogoPadre);
			Usuario usuario = usuarioRepository.findById(peticion.getUsuario());
			if (usuario == null)
				return new RespuestaGenerica("500", "El usuario no existe, validar.");
			catalogo.setUsuario(usuario);
			catalogoRepo.persistAndFlush(catalogo);

			var objetivoPrioritario = new EstrategiaPrioritaria();
			objetivoPrioritario.setIdCatalogo(catalogo.getIdCatalogo());
			objetivoPrioritario.setIdEstrucutra(peticion.getIdEstructura());
			estrategiaPrioritariaRepository.persistAndFlush(objetivoPrioritario);
		} catch (Exception e) {
			respuesta = new RespuestaGenerica("500", "Error al registrar: " + e.getMessage());
		}
		return respuesta;
	}

	@Override
	@Transactional
	public RespuestaGenerica modificar(EstrategiaDTO peticion) {

		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			MasterCatalogo catalogo = catalogoRepo.findById(peticion.getIdEstrategia());
			if (catalogo == null)
				return new RespuestaGenerica("500", "El registro de estrategia que se busca no existe, validar.");

			estrategiaPrioritariaRepository.find("idCatalogo = ?1", catalogo.getIdCatalogo())
					.firstResultOptional()
					.orElseGet(() -> {
						var op = new EstrategiaPrioritaria();
						op.setIdCatalogo(catalogo.getIdCatalogo());
						op.setIdEstrucutra(peticion.getIdEstructura());

						estrategiaPrioritariaRepository.persistAndFlush(op);
						return op;
					});

			catalogo.setCdOpcion(peticion.getCdEstrategia());
			catalogo.setCcExterna(peticion.getCveObjetivo());
			catalogo.setCcExternaDos(peticion.getCveEstrategia());
			Usuario usuario = usuarioRepository.findById(peticion.getUsuario());
			if (usuario == null)
				return new RespuestaGenerica("500", "El usuario no existe, validar.");
			catalogo.setUsuario(usuario);

			catalogoRepo.persistAndFlush(catalogo);
		} catch (Exception e) {
			respuesta = new RespuestaGenerica("500", "Error al registrar: " + e.getMessage());
		}
		return respuesta;
	}
	
	@Override
	@Transactional
	public RespuestaGenerica eliminar(EstrategiaDTO peticion) {

		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			MasterCatalogo catalogo = catalogoRepo.findById(peticion.getIdEstrategia());
			if (catalogo == null)
				return new RespuestaGenerica("500", "El registro de estrategia que se busca no existe, validar.");
			
			catalogo.setDfBaja(LocalDate.now());
			Usuario usuario = usuarioRepository.findById(peticion.getUsuario());
			if (usuario == null)
				return new RespuestaGenerica("500", "El usuario no existe, validar.");
			catalogo.setUsuario(usuario);
			catalogoRepo.persistAndFlush(catalogo);
			
			//Eliminar las acciones asociadas a la estrategia
			eliminarAccionesPorCveEstrategia(catalogo.getCcExternaDos());
		} catch (Exception e) {
			respuesta = new RespuestaGenerica("500", "Error al registrar: " + e.getMessage());
		}
		return respuesta;
	}
	
	@Override
	@Transactional
	public RespuestaGenerica eliminarPorIDObjetivo(String cveObjetivo) {

		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			StoredProcedureQuery storedProcedure = em.createStoredProcedureQuery("PROC_BAJA_ESTRATEGIAS_POR_CVEOBJETIVO");
	        storedProcedure.registerStoredProcedureParameter("cveObjetivo", String.class, ParameterMode.IN);
	        storedProcedure.registerStoredProcedureParameter("respuesta", String.class, ParameterMode.OUT);
	        storedProcedure.setParameter("cveObjetivo", cveObjetivo);
	        Boolean respSP = storedProcedure.execute();
	        Log.info("respSP:" + respSP);

	        Log.info(storedProcedure.getParameter("respuesta").toString());
	        if (!respSP)
	        	respuesta = new RespuestaGenerica("501", "Error al ejecutar el proceso de baja de Estategias por objetivo con clave : " + cveObjetivo);
	        
	        return respuesta;
		} catch (Exception e) {
			respuesta = new RespuestaGenerica("500", "Error al eliminarPorIDObjetivo: " + e.getMessage());
		}
		return respuesta;
	}
	
	@Override
	@Transactional
	public RespuestaGenerica eliminarAccionesPorCveEstrategia(String cveEstrategia) {

		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			StoredProcedureQuery storedProcedure = em.createStoredProcedureQuery("PROC_BAJA_ACCIONES_POR_CVEESTRATEGIA");
	        storedProcedure.registerStoredProcedureParameter("cveEstrategia", String.class, ParameterMode.IN);
	        storedProcedure.registerStoredProcedureParameter("respuesta", String.class, ParameterMode.OUT);
	        storedProcedure.setParameter("cveEstrategia", cveEstrategia);
	        Boolean respSP = storedProcedure.execute();
	        Log.info("respSP:" + respSP);

	        Log.info(storedProcedure.getParameter("respuesta").toString());
	        if (!respSP)
	        	respuesta = new RespuestaGenerica("501", "Error al ejecutar el proceso de baja de Acciones por Estrategia con clave : " + cveEstrategia);
	        
	        return respuesta;
		} catch (Exception e) {
			respuesta = new RespuestaGenerica("500", "Error al eliminarAccionesPorCveEstrategia: " + e.getMessage());
		}
		return respuesta;
	}

}
