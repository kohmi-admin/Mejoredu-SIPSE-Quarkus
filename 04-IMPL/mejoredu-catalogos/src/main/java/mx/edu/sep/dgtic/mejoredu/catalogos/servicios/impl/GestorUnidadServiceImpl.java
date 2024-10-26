package mx.edu.sep.dgtic.mejoredu.catalogos.servicios.impl;

import jakarta.inject.Inject;

import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.catalogos.daos.MasterCatalogoRepositorio;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.MasterCatalogoDto;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.PeticionCatalogo;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.MasterCatalogo;
import mx.edu.sep.dgtic.mejoredu.catalogos.servicios.GestorUnidadService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GestorUnidadServiceImpl implements GestorUnidadService {
	private static final Integer PADRE_UNIDAD_ADMINISTRATIVA = 2059;
	@Inject
	MasterCatalogoRepositorio masterCatalogoRepositorio;

	@Override
	public List<MasterCatalogoDto> consultarActivos(Integer idUnidadPadre) {
		List<MasterCatalogo> lista = masterCatalogoRepositorio.find("idCatalogoPadre.idCatalogo =?1 and dfBaja is null", idUnidadPadre).list();
		List<MasterCatalogoDto> listaNueva = new ArrayList<>();
		for (MasterCatalogo masterCatalogo : lista) {
			MasterCatalogoDto masterCatalogoDto = new MasterCatalogoDto();
			masterCatalogoDto.setIdCatalogo(masterCatalogo.getIdCatalogo());
			masterCatalogoDto.setCdOpcion(masterCatalogo.getCdOpcion());
			masterCatalogoDto.setCcExterna(masterCatalogo.getCcExterna());
			masterCatalogoDto.setCcExternaDos(masterCatalogo.getCcExternados());
			masterCatalogoDto.setCdDescripcionDos(masterCatalogo.getCdDescripciondos());
			masterCatalogoDto.setIdCatalgoPadre(masterCatalogo.getIdCatalogoPadre().getIdCatalogo());
			masterCatalogoDto.setDfBaja(masterCatalogo.getDfBaja());
			listaNueva.add(masterCatalogoDto);
		}
		return listaNueva;
	}

	@Override
	public List<MasterCatalogoDto> consultarOpcionADTO(Integer idUnidad) {
		Optional<MasterCatalogo> masterCatalogo = Optional.ofNullable(masterCatalogoRepositorio.find("idCatalogo =?1 and idCatalogoPadre.idCatalogo =?2",
				idUnidad ,PADRE_UNIDAD_ADMINISTRATIVA ).firstResult());
		if (!masterCatalogo.isPresent()) {
			return null;
		}
		MasterCatalogoDto masterCatalogoDto = new MasterCatalogoDto();
		List<MasterCatalogoDto> masterCatalogoDtos = new ArrayList<>();
		masterCatalogoDto.setIdCatalogo(masterCatalogo.get().getIdCatalogo());
		masterCatalogoDto.setIdCatalgoPadre(masterCatalogo.get().getIdCatalogoPadre().getIdCatalogo());
		masterCatalogoDto.setCdOpcion(masterCatalogo.get().getCdOpcion());
		masterCatalogoDto.setCcExterna(masterCatalogo.get().getCcExterna());
		masterCatalogoDto.setCcExternaDos(masterCatalogo.get().getCcExternados());
		masterCatalogoDto.setCdDescripcionDos(masterCatalogo.get().getCdDescripciondos());
		masterCatalogoDtos.add(masterCatalogoDto);
		return masterCatalogoDtos;
	}

	@Override
	@Transactional
	public MasterCatalogo guardarUnidad(PeticionCatalogo peticion) {
		MasterCatalogo masterCatalogo = new MasterCatalogo();
		masterCatalogo.setCdOpcion(peticion.getCdOpcion());
		masterCatalogo.setCveUsuario(peticion.getCveUsuario());
		masterCatalogo.setCcExterna(peticion.getCcExterna());
		masterCatalogo.setCcExternados(peticion.getCcExternaDos());
		masterCatalogo.setCdDescripciondos(peticion.getCdDescripcionDos());
		masterCatalogo.setDfBaja(null);
		MasterCatalogo masterCatalogo2 = masterCatalogoRepositorio.findById(Long.valueOf(PADRE_UNIDAD_ADMINISTRATIVA));
		masterCatalogo.setIdCatalogoPadre(masterCatalogo2);
		masterCatalogo.setIxDependencia(0);
		masterCatalogoRepositorio.persistAndFlush(masterCatalogo);
		return masterCatalogo;
	}

	@Override
	@Transactional
	public MasterCatalogo actualizarUnidad(PeticionCatalogo peticion, int idUnidad) {
		var masterCatalogo = masterCatalogoRepositorio.findByIdOptional((long) idUnidad)
				.orElseGet(MasterCatalogo::new);

		/*Optional<MasterCatalogo> catalogoOptional = Optional.ofNullable(masterCatalogoRepositorio.findById((long) idUnidad));
		MasterCatalogo masterCatalogo = catalogoOptional.orElseGet(MasterCatalogo::new);
		*/
		masterCatalogo.setCdOpcion(Optional.ofNullable(peticion.getCdOpcion()).orElse(masterCatalogo.getCdOpcion()));
		masterCatalogo.setCveUsuario(Optional.ofNullable(peticion.getCveUsuario()).orElse(masterCatalogo.getCveUsuario()));

		// Utilizar orElse para establecer el valor predeterminado si peticion es null
		masterCatalogo.setCcExterna(Optional.ofNullable(peticion.getCcExterna()).orElse(masterCatalogo.getCcExterna()));
		masterCatalogo.setCcExternados(Optional.ofNullable(peticion.getCcExternaDos()).orElse(masterCatalogo.getCcExternados()));
		masterCatalogo.setCdDescripciondos(Optional.ofNullable(peticion.getCdDescripcionDos()).orElse(masterCatalogo.getCdDescripciondos()));
		masterCatalogo.setDfBaja(Optional.ofNullable(peticion.getDfBaja()).orElse(masterCatalogo.getDfBaja()));
		masterCatalogo.setIxDependencia(Optional.ofNullable(peticion.getIxDependencia()).orElse(masterCatalogo.getIxDependencia()));
		masterCatalogoRepositorio.persistAndFlush(masterCatalogo);
		return masterCatalogo;
	}

	@Override
	@Transactional
	public MasterCatalogo eliminarUnidad(int idUnidad) {
		MasterCatalogo masterCatalogo = masterCatalogoRepositorio.findById((long) idUnidad);
		List<MasterCatalogo> masterCatalogoList = masterCatalogoRepositorio.find("idCatalogo = ?1 and idCatalogoPadre.idCatalogo = ?2",
				idUnidad , PADRE_UNIDAD_ADMINISTRATIVA).list();
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
