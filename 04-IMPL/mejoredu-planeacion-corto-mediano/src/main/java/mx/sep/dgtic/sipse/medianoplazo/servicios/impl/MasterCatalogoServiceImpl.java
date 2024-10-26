package mx.sep.dgtic.sipse.medianoplazo.servicios.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO2;
import mx.sep.dgtic.sipse.medianoplazo.daos.ObjetivoPrioritarioRepository;
import mx.sep.dgtic.sipse.medianoplazo.entidades.ObjetivoPrioritario;
import org.springframework.stereotype.Service;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.AccionDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.EstrategiaDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ObjetivoDTO;
import mx.sep.dgtic.sipse.medianoplazo.daos.MasterCatalogoRepository;
import mx.sep.dgtic.sipse.medianoplazo.daos.UsuarioRepository;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MasterCatalogo;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Usuario;
import mx.sep.dgtic.sipse.medianoplazo.servicios.IEstrategiaService;
import mx.sep.dgtic.sipse.medianoplazo.servicios.IMasterCatalogoService;

@Service
public class MasterCatalogoServiceImpl implements IMasterCatalogoService{
	
	final private Integer IDCATOBJETIVO = 592;
	final private Integer IDCATESTRATEGIA = 771;
	final private Integer IDCATACCION = 640;
	
	@Inject
	MasterCatalogoRepository catalogoRepo;
	@Inject
	IEstrategiaService estrategiaService;
	@Inject
	private ObjetivoPrioritarioRepository objetivoPrioritarioRepository;
	
	@Inject
	private UsuarioRepository usuarioRepository;

	@Override
	public List<MasterCatalogoDTO2> consultarCatalogoObjetivos(Integer anhio) {
		return objetivoPrioritarioRepository.list("estructura.anhoPlaneacion.idAnhio = ?1 AND catalogo.dfBaja IS NULL", anhio)
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
	@Transactional
	public RespuestaGenerica registrar(ObjetivoDTO peticion) {
		MasterCatalogo catalogo = new MasterCatalogo();
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			Usuario usuario = usuarioRepository.findById(peticion.getUsuario());
			if (usuario==null)
				return new RespuestaGenerica("500","El usuario no existe, validar.");
			catalogo.setUsuario(usuario);
			catalogo.setCdOpcion(peticion.getCdObjetivo());
			catalogo.setCdDescripcionDos(peticion.getRelevancia());
			catalogo.setCcExterna(peticion.getIxObjetivo()+"");
			MasterCatalogo catalogoPadre = catalogoRepo.findById(IDCATOBJETIVO);
			catalogo.setMasterCatalogo2(catalogoPadre);
			catalogoRepo.persistAndFlush(catalogo);

			var objetivoPrioritario = new ObjetivoPrioritario();
			objetivoPrioritario.setIdCatalogo(catalogo.getIdCatalogo());
			objetivoPrioritario.setIdEstrucutra(peticion.getIdEstructura());
			objetivoPrioritarioRepository.persistAndFlush(objetivoPrioritario);
		}catch (Exception e) {
			respuesta = new RespuestaGenerica("500", "Error al registrar: " + e.getMessage());
		}
		return respuesta;
	}
	
	@Override
	@Transactional
	public RespuestaGenerica registrar(AccionDTO peticion) {
		MasterCatalogo catalogo = new MasterCatalogo();
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			catalogo.setCdOpcion(peticion.getCdAccion());
			catalogo.setCcExterna(peticion.getCveAccion()+"");
			MasterCatalogo catalogoPadre = catalogoRepo.findById(IDCATACCION);
			Usuario usuario = usuarioRepository.findById(peticion.getUsuario());
			if (usuario==null)
				return new RespuestaGenerica("500","El usuario no existe, validar.");
			catalogo.setUsuario(usuario);
			catalogo.setMasterCatalogo2(catalogoPadre);
			catalogoRepo.persistAndFlush(catalogo);
		}catch (Exception e) {
			respuesta = new RespuestaGenerica("500", "Error al registrar: " + e.getMessage());
		}
		return respuesta;
	}
	
	@Override
	@Transactional
	public RespuestaGenerica modificar(ObjetivoDTO peticion) {
		
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			MasterCatalogo catalogo = catalogoRepo.findById(peticion.getIdObjetivo());
			if (catalogo==null)
				return new RespuestaGenerica("500","El objetivo no existe, validar.");
			Usuario usuario = usuarioRepository.findById(peticion.getUsuario());
			if (usuario==null)
				return new RespuestaGenerica("500","El usuario no existe, validar.");
//			usuario.setLockFlag(0);
			objetivoPrioritarioRepository.find("idCatalogo = ?1", catalogo.getIdCatalogo())
					.firstResultOptional()
					.orElseGet(() -> {
						var op = new ObjetivoPrioritario();
						op.setIdCatalogo(catalogo.getIdCatalogo());
						op.setIdEstrucutra(peticion.getIdEstructura());

						objetivoPrioritarioRepository.persistAndFlush(op);
						return op;
					});

			catalogo.setUsuario(usuario);
			catalogo.setCcExterna(peticion.getIxObjetivo()+"");
			catalogo.setCdOpcion(peticion.getCdObjetivo());
			catalogo.setCdDescripcionDos(peticion.getRelevancia());
//			catalogo.setLockFlag(0);
//			catalogo.setIxDependencia(0);
//			MasterCatalogo catalogoPadre = catalogoRepo.findById(IDCATOBJETIVO);
//			catalogo.setMasterCatalogo2(catalogoPadre);
			catalogoRepo.persistAndFlush(catalogo);
		}catch (Exception e) {
			e.printStackTrace();
			respuesta = new RespuestaGenerica("500", "Error al modificar: " + e.getMessage());
		}
		return respuesta;
	}
	@Override
	@Transactional
	public RespuestaGenerica eliminar(MasterCatalogoDTO peticion) {
		
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		try {
			MasterCatalogo catalogo = catalogoRepo.findById(peticion.getIdCatalogo());
			if (catalogo==null)
				return new RespuestaGenerica("500","El objetivo no existe, validar.");
			Usuario usuario = usuarioRepository.findById(peticion.getCveUsuario());
			if (usuario==null)
				return new RespuestaGenerica("500","El usuario no existe, validar.");
			catalogo.setUsuario(usuario);
			catalogo.setDfBaja(LocalDate.now());
			catalogoRepo.persistAndFlush(catalogo);
			
			//Dar de baja de igual manera las estrategias
				respuesta = estrategiaService.eliminarPorIDObjetivo(catalogo.getCcExterna());
			
			//Dar de baja las acciones
			
		}catch (Exception e) {
			respuesta = new RespuestaGenerica("500", "Error al eliminar: " + e.getMessage());
		}
		return respuesta;
		
	}
	
	@Override
	public MensajePersonalizado<List<ObjetivoDTO>> consultarObjetivos(){
		MensajePersonalizado<List<ObjetivoDTO>> respuesta = new MensajePersonalizado<List<ObjetivoDTO>>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		List<MasterCatalogo> lstEstructura = catalogoRepo.find("MasterCatalogo2.idCatalogo = ?1 and dfBaja is null", IDCATOBJETIVO).list();
		List<ObjetivoDTO> lstObjetivos = new ArrayList<>();
		lstEstructura.stream().map(objetivo -> {
			ObjetivoDTO objDto = new ObjetivoDTO();
			objDto.setIdObjetivo(objetivo.getIdCatalogo());
			objDto.setCdObjetivo(objetivo.getCdOpcion());
			objDto.setIxObjetivo(Integer.valueOf(objetivo.getCcExterna()));
			objDto.setRelevancia(objetivo.getCdDescripcionDos());
			objDto.setUsuario(objetivo.getUsuario().getCveUsuario());
			return objDto;
		}).forEach(lstObjetivos::add);
		respuesta.setRespuesta(lstObjetivos);
		return respuesta;
	}

}
