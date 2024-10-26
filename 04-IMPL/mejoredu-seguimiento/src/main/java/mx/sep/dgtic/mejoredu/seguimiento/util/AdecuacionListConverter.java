package mx.sep.dgtic.mejoredu.seguimiento.util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.modelmapper.AbstractConverter;

import mx.sep.dgtic.mejoredu.seguimiento.AdecuacionDTO;
import mx.sep.dgtic.mejoredu.seguimiento.TipoModificacionDTO;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionSolicitud;

public class AdecuacionListConverter extends AbstractConverter<List<AdecuacionSolicitud>, List<AdecuacionDTO>> {

	@Override
	protected List<AdecuacionDTO> convert(List<AdecuacionSolicitud> adecuaciones) {

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
