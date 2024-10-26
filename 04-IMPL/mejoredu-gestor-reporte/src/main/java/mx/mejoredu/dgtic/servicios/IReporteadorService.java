package mx.mejoredu.dgtic.servicios;

import java.util.List;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.reportes.PAAAprobadoDTO;
import mx.edu.sep.dgtic.mejoredu.reportes.PeticionPAAA;
import mx.edu.sep.dgtic.mejoredu.reportes.ProyectoEstatusDTO;
import mx.edu.sep.dgtic.mejoredu.reportes.RespuestaReportePAAGeneralDTO;
import mx.edu.sep.dgtic.mejoredu.reportes.RespuestaReporteAlineacionMIR;
import mx.edu.sep.dgtic.mejoredu.reportes.RespuestaReporteAdecuacionDTO;
import mx.edu.sep.dgtic.mejoredu.reportes.RespuestaReportePresupuestoDTO;
import mx.edu.sep.dgtic.mejoredu.reportes.RespuestaReporteSeguimientoDTO;
import org.springframework.web.bind.annotation.PathVariable;


public interface IReporteadorService {
	
	MensajePersonalizado<List<ProyectoEstatusDTO>> consultarEstatusPorAnhio(Integer anhio);

	MensajePersonalizado<RespuestaReportePAAGeneralDTO> consultarPAAReporteGeneralorAnhio(Integer anhio,String cveUsuario);
	MensajePersonalizado<RespuestaReporteAlineacionMIR> alineacionGeneral(@PathVariable Integer anhio,String cveUsuario);
	MensajePersonalizado<RespuestaReporteAdecuacionDTO> adecuacionesGeneral(@PathVariable Integer anhio,String cveUsuario);
	MensajePersonalizado<RespuestaReporteSeguimientoDTO> seguimientoGeneral(@PathVariable Integer anhio, String cveUsuario);
	MensajePersonalizado<RespuestaReportePresupuestoDTO> presupuestoGeneral(int anhio,  String cveUsuario);

	MensajePersonalizado<List<PAAAprobadoDTO>> consultarPAAAprobados(PeticionPAAA peticionPAAA);


}
