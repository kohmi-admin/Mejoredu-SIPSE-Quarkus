package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import mx.sep.dgtic.mejoredu.seguimiento.AdecuacionDTO;
import mx.sep.dgtic.mejoredu.seguimiento.TipoModificacionDTO;
import mx.sep.dgtic.mejoredu.seguimiento.dao.AdecuacionRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.MasterCatalogoRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.SolicitudRepository;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionSolicitud;
import mx.sep.dgtic.mejoredu.seguimiento.service.AdecuacionService;
@Service
public class AdecuacionServiceImpl implements AdecuacionService {

	@Inject
	private AdecuacionRepository adecuacionRepository;
	@Inject
	private MasterCatalogoRepository masterCatalogoRepository;
	@Inject
	private SolicitudRepository solicitudRepository;

	@Override
	@Transactional
	public void registrar(Integer idSolicitud, List<AdecuacionDTO> adecuacionesDTO) {
		adecuacionRepository.persist(convert(idSolicitud, adecuacionesDTO));
	}

	@Override
	public List<AdecuacionDTO> consultaPorIdSolicitud(Integer idSolicitud) {
		return convert(adecuacionRepository.findByIdSolicitud(idSolicitud));
	}

	@Override
	@Transactional
	public void eliminarPorIdSolicitud(Integer idSolicitud) {
		adecuacionRepository.deleteByIdSolicitud(idSolicitud);
	}

	private List<AdecuacionSolicitud> convert(Integer idSolicitud, List<AdecuacionDTO> adecuacionesDTO) {
		List<AdecuacionSolicitud> adecuacionesMap = new ArrayList<>();
		adecuacionesDTO.forEach(adecuacion -> {
			adecuacion.getTiposModificaciones().forEach(tipo -> {
				AdecuacionSolicitud adecuacionSol = new AdecuacionSolicitud();
				adecuacionSol.setSolicitud(solicitudRepository.findById(idSolicitud));
				adecuacionSol.setCatalogoApartado(masterCatalogoRepository.findById(adecuacion.getIdTipoApartado()));
				adecuacionSol.setCatalogoModificacion(masterCatalogoRepository.findById(tipo.getIdTipoModificacion()));
				adecuacionesMap.add(adecuacionSol);
			});
		});
		return adecuacionesMap;
	}

	private List<AdecuacionDTO> convert(List<AdecuacionSolicitud> adecuaciones) {
		Set<AdecuacionDTO> adecuacionesDTO = new HashSet<>();

		adecuaciones.forEach(adecuacion -> {
			List<TipoModificacionDTO> tipos = new ArrayList<>();
			adecuaciones.forEach(tipo -> {
				if (tipo.getCatalogoApartado().getId().equals(adecuacion.getCatalogoApartado().getId())) {
					TipoModificacionDTO tipoDTO = new TipoModificacionDTO();
					tipoDTO.setIdAdecuacionSolicitud(tipo.getIdAdecuacionSolicitud());
					tipoDTO.setIdTipoModificacion(tipo.getCatalogoModificacion().getId());
					tipoDTO.setTipoModificacion(tipo.getCatalogoModificacion().getCdOpcion());
					tipos.add(tipoDTO);
				}
			});
			AdecuacionDTO adecuacionDTO = new AdecuacionDTO();
			adecuacionDTO.setIdTipoApartado(adecuacion.getCatalogoApartado().getId());
			adecuacionDTO.setTipoApartado(adecuacion.getCatalogoApartado().getCdOpcion());
			adecuacionDTO.setTiposModificaciones(tipos);
			adecuacionesDTO.add(adecuacionDTO);
		});

		return List.copyOf(adecuacionesDTO);
	}
}
