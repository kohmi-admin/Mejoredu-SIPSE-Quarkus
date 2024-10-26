package mx.sep.dgtic.mejoredu.seguimiento.util;

import java.util.List;

import org.modelmapper.ModelMapper;

import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionJustificacionIndicadorVO;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Justificacion;
import mx.sep.dgtic.mejoredu.seguimiento.entity.JustificacionDocumento;

public abstract class MirUtil {
	public static PeticionJustificacionIndicadorVO convertJustificacion(Justificacion justificacion, List<JustificacionDocumento> documentos) {
		ModelMapper modelMapper = new ModelMapper();
		PeticionJustificacionIndicadorVO justificacionVO = modelMapper.map(justificacion,
				PeticionJustificacionIndicadorVO.class);

		justificacionVO.setAvance(Double.valueOf(justificacion.getRegistroAvance()));

		if (!documentos.isEmpty()) {
			documentos.stream().map(docto -> {
				ArchivoBase archivo = new ArchivoBase();
				var fecha = docto.getArchivo().getFechaCarga();
				var hora = docto.getArchivo().getHoraCarga();
				archivo.setFechaCarga(fecha.atTime(hora).toString());
				archivo.setIdArchivo(docto.getArchivo().getIdArchivo());
				archivo.setNombre(docto.getArchivo().getNombre());
				archivo.setUuid(docto.getArchivo().getUuid());
				return archivo;
			}).forEach(justificacionVO.getArchivos()::add);
		}

		return justificacionVO;
	}
}
