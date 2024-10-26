package mx.sep.dgtic.sipse.medianoplazo.servicios;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.EpilogoArchivoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.PeticionEpilogoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.RespuestaEpilogoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.RespuestaReporteMedianoPlazo;

public interface EpilogoService {
	RespuestaEpilogoDTO consultarPorIdEstructura(Integer idEstructura);

	RespuestaEpilogoDTO consultarPorId(Integer idEpilogo);

	void registrar(PeticionEpilogoDTO epilogo);

	void modificar(PeticionEpilogoDTO epilogo, Integer idEpilogo);

	void eliminar(Integer idEpilogo);

	List<EpilogoArchivoDTO> consultarArchivosPorId(Integer idEpilogo);

	List<EpilogoArchivoDTO> consultarArchivosPorId(Integer idEpilogo, Integer idTipoArchivo);

	RespuestaReporteMedianoPlazo consultarReporte(Integer anhio);
	RespuestaGenerica generaReporte(Integer anio);
}
