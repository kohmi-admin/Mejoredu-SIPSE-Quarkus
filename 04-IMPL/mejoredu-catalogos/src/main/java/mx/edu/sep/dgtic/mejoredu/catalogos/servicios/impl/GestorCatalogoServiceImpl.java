package mx.edu.sep.dgtic.mejoredu.catalogos.servicios.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.PeticionCatalogo;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.PeticionRegistroCatalgos;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.MasterCatalogo;
import org.springframework.stereotype.Service;

import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.Enums.RespuestaGralEnum;
import mx.edu.sep.dgtic.mejoredu.catalogos.daos.MasterCatalogoRepositorio;
import mx.edu.sep.dgtic.mejoredu.catalogos.daos.TipoUsuarioRepositorio;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.MasterCatalogoDto;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.TipoUsuario;
import mx.edu.sep.dgtic.mejoredu.catalogos.servicios.GestorCatalogoService;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO;
import mx.sep.dgtic.mejoredu.seguridad.TipoUsuarioVO;
import java.util.Optional;

@Service
public class GestorCatalogoServiceImpl implements GestorCatalogoService {
	@Inject
	TipoUsuarioRepositorio tipoUsuarioRepositorio;
	
	@Inject
	MasterCatalogoRepositorio masterCatalogoRepositorio;
	private final String CATALOGO = "CAT";

	public TipoUsuarioVO consultarTipoUsuarioPorNombre(String nombre) {
		TipoUsuarioVO tipoUsuarioVO = new TipoUsuarioVO();
		TipoUsuario tipoUsuario = new TipoUsuario();
		tipoUsuario = tipoUsuarioRepositorio.findByName(nombre);
		if (null != tipoUsuario) {
			tipoUsuarioVO.setCdtipoUsuario(tipoUsuario.getCdTipoUsuario());
			tipoUsuarioVO.setIdTipoUsuario(tipoUsuario.getIdTipoUsuario());
			tipoUsuarioVO.setCsEstatus(tipoUsuarioVO.getCsEstatus());
			tipoUsuarioVO.setIdBitacora(tipoUsuario.getIdBitacora());
		}else {
			tipoUsuarioVO.setCdtipoUsuario(RespuestaGralEnum.NOHAYINFORMACION.getMensaje());
		}
		return tipoUsuarioVO;
	}
	
	public MasterCatalogoDTO consultarOpcion(int idCatalogo) {
		return masterCatalogoRepositorio.consultaOpcion(idCatalogo);
	}
	
	public List<MasterCatalogo> consultarCatalogo(int idCatalogoPadre){
		return masterCatalogoRepositorio.consultaCatalogo(idCatalogoPadre);
	}
	
	public List<MasterCatalogoDto> consultarOpcionADTO(int idCatalogoPadre){
		List<MasterCatalogo> listaConsulta = masterCatalogoRepositorio.find("idCatalogoPadre.idCatalogo = ?1 AND dfBaja IS NULL", idCatalogoPadre).list();
		List<MasterCatalogoDto> masterCatalogoDtos = new ArrayList<>();
		for (MasterCatalogo listaNueva : listaConsulta){
			MasterCatalogoDto masterCatalogoDto = new MasterCatalogoDto();
			masterCatalogoDto.setIdCatalogo(listaNueva.getIdCatalogo());
			masterCatalogoDto.setIdCatalgoPadre(listaNueva.getIdCatalogoPadre().getIdCatalogo());
			masterCatalogoDto.setCdOpcion(listaNueva.getCdOpcion());
			masterCatalogoDto.setCcExterna(listaNueva.getCcExterna());
			masterCatalogoDto.setCcExternaDos(listaNueva.getCcExternados());
			masterCatalogoDto.setCdDescripcionDos(listaNueva.getCdDescripciondos());
			masterCatalogoDtos.add(masterCatalogoDto);
		}
		return masterCatalogoDtos;
	}

	@Override
	public List<MasterCatalogoDto> consultarCatalogoPadres() {
		List<MasterCatalogo> catalogosPadres = masterCatalogoRepositorio.find("idCatalogoPadre.idCatalogo IS NULL and dfBaja IS NULL AND ccExterna = ?1", CATALOGO).list();
		List<MasterCatalogoDto> catalogoDtos = new ArrayList<>();
		for (MasterCatalogo masterCatalogo : catalogosPadres){
			MasterCatalogoDto masterCatalogoDTO = new MasterCatalogoDto();
			masterCatalogoDTO.setIdCatalogo(masterCatalogo.getIdCatalogo());
			masterCatalogoDTO.setCdOpcion(masterCatalogo.getCdOpcion());
			masterCatalogoDTO.setCcExterna(masterCatalogo.getCcExterna());
			masterCatalogoDTO.setCcExternaDos(masterCatalogo.getCcExternados());
			masterCatalogoDTO.setCdDescripcionDos(masterCatalogo.getCdDescripciondos());
			catalogoDtos.add(masterCatalogoDTO);

		}

		return catalogoDtos;
	}

	@Override
	@Transactional
	public List<MasterCatalogoDto> agregarRegistroCatalgo(PeticionRegistroCatalgos peticion) {
		List<MasterCatalogoDto> listaOpciones = new ArrayList<>();
		MasterCatalogoDto masterCatalogoDto = new MasterCatalogoDto();
		MasterCatalogo masterCatalogo = new MasterCatalogo();
		masterCatalogo.setCdOpcion(peticion.getCdOpcion());
		masterCatalogo.setCcExterna(peticion.getCcExterna());
		masterCatalogo.setCdDescripciondos(peticion.getCsDescripcion());
		masterCatalogo.setCveUsuario(peticion.getCveUsuario());
		if (peticion.getIdCatalogoPadre() != null){
		MasterCatalogo idpadre = masterCatalogoRepositorio.findById(Long.valueOf(peticion.getIdCatalogoPadre()));
		masterCatalogo.setIdCatalogoPadre(idpadre);
		}else {
			masterCatalogo.setIdCatalogoPadre(null);
		}
		masterCatalogoRepositorio.persistAndFlush(masterCatalogo);

		masterCatalogoDto.setCdOpcion(masterCatalogo.getCdOpcion());
		masterCatalogoDto.setIdCatalgoPadre(masterCatalogo.getIdCatalogoPadre().getIdCatalogo());
		masterCatalogoDto.setCdDescripcionDos(masterCatalogo.getCdDescripciondos());
		masterCatalogoDto.setCcExterna(masterCatalogo.getCcExterna());
		listaOpciones.add(masterCatalogoDto);
		return listaOpciones;
	}

	public List<MasterCatalogoDto> consultarCatalogoID(int idCatalogo){
		MasterCatalogo masterCatalogo = masterCatalogoRepositorio.findById(Long.valueOf(idCatalogo));
		List<MasterCatalogo> registros = masterCatalogoRepositorio.find("idCatalogoPadre.idCatalogo = ?1 AND dfBaja IS NULL", idCatalogo).list();
		if (masterCatalogo != null){
			List<MasterCatalogoDto> catalogoDtos = new ArrayList<>();
			MasterCatalogoDto masterCatalogoDTO = new MasterCatalogoDto();
			masterCatalogoDTO.setIdCatalogo(idCatalogo);
			masterCatalogoDTO.setCdOpcion(masterCatalogo.getCdOpcion());
			masterCatalogoDTO.setCcExterna(masterCatalogo.getCcExterna());
			masterCatalogoDTO.setCcExternaDos(masterCatalogo.getCcExternados());
			masterCatalogoDTO.setCdDescripcionDos(masterCatalogo.getCdDescripciondos());
			masterCatalogoDTO.setDfBaja(masterCatalogo.getDfBaja());
			List<MasterCatalogoDto> registroCatalogo = new ArrayList<>();

			for (MasterCatalogo masterCatalogo2 : registros){
				MasterCatalogoDto masterCatalogoDTO2 = new MasterCatalogoDto();
				masterCatalogoDTO2.setIdCatalogo(masterCatalogo2.getIdCatalogo());
				masterCatalogoDTO2.setCdOpcion(masterCatalogo2.getCdOpcion());
				masterCatalogoDTO2.setCcExterna(masterCatalogo2.getCcExterna());
				masterCatalogoDTO2.setCcExternaDos(masterCatalogo2.getCcExternados());
				masterCatalogoDTO2.setCdDescripcionDos(masterCatalogo2.getCdDescripciondos());
				masterCatalogoDTO2.setDfBaja(masterCatalogo2.getDfBaja());
				masterCatalogoDTO2.setIdCatalgoPadre(masterCatalogo2.getIdCatalogoPadre().getIdCatalogo());
				registroCatalogo.add(masterCatalogoDTO2);
			}
			masterCatalogoDTO.setRegistros(registroCatalogo);
			catalogoDtos.add(masterCatalogoDTO);
			return catalogoDtos;

		}
		return null;
	}
	
	@Override
	@Transactional
	public MasterCatalogo guardarCatalogo(PeticionCatalogo peticion){
		MasterCatalogo masterCatalogo = new MasterCatalogo();
		masterCatalogo.setCdOpcion(peticion.getCdOpcion());
		masterCatalogo.setCveUsuario(peticion.getCveUsuario());
		masterCatalogo.setCcExterna(CATALOGO);
		masterCatalogo.setCcExternados(null);
		masterCatalogo.setCdDescripciondos(null);
		masterCatalogo.setDfBaja(null);
		if (peticion.getIdCatalogoPadre() != null){
			MasterCatalogo idpadre = masterCatalogoRepositorio.findById(Long.valueOf(peticion.getIdCatalogoPadre()));
			masterCatalogo.setIdCatalogoPadre(idpadre);
		}else {
			masterCatalogo.setIdCatalogoPadre(null);
		}
		masterCatalogo.setIxDependencia(0);
		masterCatalogoRepositorio.persistAndFlush(masterCatalogo);
		return masterCatalogo;
	}

	@Override
	@Transactional
	public MasterCatalogo actualizarCatalogo(int idCatalogo,PeticionCatalogo peticion) {
		Optional<MasterCatalogo> catalogoOptional = Optional.ofNullable(masterCatalogoRepositorio.findById(Long.valueOf(idCatalogo)));
		MasterCatalogo masterCatalogo;

		if (catalogoOptional.isPresent()) {
			masterCatalogo = catalogoOptional.get();
		} else {
			masterCatalogo = new MasterCatalogo(); }

		masterCatalogo.setCdOpcion(peticion.getCdOpcion());
		masterCatalogo.setCveUsuario(peticion.getCveUsuario());
		if (peticion.getIdCatalogoPadre() != null){
			MasterCatalogo idpadre = masterCatalogoRepositorio.findById(Long.valueOf(peticion.getIdCatalogoPadre()));
			masterCatalogo.setIdCatalogoPadre(idpadre);
		}else {
			masterCatalogo.setIdCatalogoPadre(catalogoOptional.get().getIdCatalogoPadre());
		}

// Utilizar orElse para establecer el valor predeterminado si peticion.getCcExterna() es null
		masterCatalogo.setCcExterna(Optional.ofNullable(peticion.getCcExterna()).orElse(masterCatalogo.getCcExterna()));
		masterCatalogo.setCcExternados(Optional.ofNullable(peticion.getCcExternaDos()).orElse(masterCatalogo.getCcExternados()));
		masterCatalogo.setCdDescripciondos(Optional.ofNullable(peticion.getCdDescripcionDos()).orElse(masterCatalogo.getCdDescripciondos()));
		masterCatalogo.setDfBaja(Optional.ofNullable(peticion.getDfBaja()).orElse(masterCatalogo.getDfBaja()));

		masterCatalogoRepositorio.persistAndFlush(masterCatalogo);
		return masterCatalogo;
	}
	@Override
	@Transactional
	public MasterCatalogo eliminarCatalogo(int idCatalogo){
		MasterCatalogo masterCatalogo = masterCatalogoRepositorio.findById(Long.valueOf(idCatalogo));
		List<MasterCatalogo> masterCatalogoList = masterCatalogoRepositorio.find("idCatalogoPadre.idCatalogo = ?1", idCatalogo).list();
		if (!masterCatalogoList.isEmpty()) {
			for (MasterCatalogo masterCatalogo2 : masterCatalogoList) {
				masterCatalogo2.setDfBaja(LocalDate.now());
			}
		}
		masterCatalogo.setDfBaja(LocalDate.now());
		masterCatalogoRepositorio.persistAndFlush(masterCatalogo);
		return masterCatalogo;

	}
}
