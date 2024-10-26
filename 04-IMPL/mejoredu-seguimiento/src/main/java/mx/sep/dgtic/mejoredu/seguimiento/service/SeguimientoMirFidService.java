package mx.sep.dgtic.mejoredu.seguimiento.service;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.Enums.TiposProgramasPresupuestales;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mir.SeguimientoJustificacionesMirDTO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.ConsultaSeguimientoMirFidVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.RegistroSeguimientoMirFidVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.RegistroOtrasMetasSeguimientoVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionJustificacionActividadesVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionJustificacionIndicadorVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mir.SeguimientoMirDTO;

public interface SeguimientoMirFidService {

	List<SeguimientoMirDTO> consultaPorAnhio(Integer anhio);
	List<SeguimientoJustificacionesMirDTO> consultarJustificaciones(Integer anhio, Integer trimestre);

	PeticionJustificacionIndicadorVO consultaJustificacionIndicador(Integer idIndicador);

	void registrarIndicador(PeticionJustificacionIndicadorVO justificacion);

	PeticionJustificacionActividadesVO consultaJustificacionActividad(Integer idIndicador, Integer trimestre);
	void registrarActividad(PeticionJustificacionActividadesVO justificacion);

	ConsultaSeguimientoMirFidVO consultarSeguimientoMirFid(Integer anhio, Integer semestre, String cveUsuario, TiposProgramasPresupuestales tipoPrograma);
	List<ConsultaSeguimientoMirFidVO> consultarVariosSeguimientoMirFid(Integer anhio, Integer semestre, String cveUsuario, TiposProgramasPresupuestales tipoPrograma);
	void registrarSeguimientoMirFid(RegistroSeguimientoMirFidVO actividadAdministrativa, TiposProgramasPresupuestales tipoPrograma);
	void registrarOtrasMetasSeguimiento(RegistroOtrasMetasSeguimientoVO metaAdministrativa, TiposProgramasPresupuestales tipoPrograma);

}
