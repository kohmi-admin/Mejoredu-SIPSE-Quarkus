package mx.mejoredu.dgtic.controladores;

import java.util.List;
import mx.edu.sep.dgtic.mejoredu.reportes.ProyectoEstatusDTO;
import mx.edu.sep.dgtic.mejoredu.reportes.RespuestaReportePAAGeneralDTO;
import mx.edu.sep.dgtic.mejoredu.reportes.RespuestaReporteAlineacionMIR;
import mx.edu.sep.dgtic.mejoredu.reportes.RespuestaReporteAdecuacionDTO;
import mx.edu.sep.dgtic.mejoredu.reportes.RespuestaReportePresupuestoDTO;
import mx.edu.sep.dgtic.mejoredu.reportes.RespuestaReporteSeguimientoDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.inject.Inject;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.mejoredu.dgtic.servicios.IReporteadorService;

@RestController
@RequestMapping("api/reportes")
public class ReporteadorController {
	
	@Inject
	IReporteadorService servicioReporte;
	
	@GetMapping("proyecto/estatus/{idAnhoo}")
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<ProyectoEstatusDTO>> consultarEstatusPorAnhio(@PathVariable("idAnhoo") Integer anhio){
		MensajePersonalizado<List<ProyectoEstatusDTO>> respuesta = new MensajePersonalizado<List<ProyectoEstatusDTO>>();
		
		respuesta = servicioReporte.consultarEstatusPorAnhio(anhio);
		
		return respuesta;
	}
	
	@GetMapping("paa/general/{idAnhoo}/{cveUsuario}")
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<RespuestaReportePAAGeneralDTO> general(@PathVariable("idAnhoo") Integer idAnhoo, @PathVariable String cveUsuario){
		MensajePersonalizado<RespuestaReportePAAGeneralDTO> respuesta = new MensajePersonalizado<RespuestaReportePAAGeneralDTO>();
		
		respuesta = servicioReporte.consultarPAAReporteGeneralorAnhio(idAnhoo,cveUsuario);
		
		return respuesta;
	}
	
	@GetMapping("alineacion/general/{idAnhoo}/{cveUsuario}")
	public MensajePersonalizado<RespuestaReporteAlineacionMIR> alineacionGeneral(@PathVariable Integer idAnhoo, @PathVariable String cveUsuario){
		MensajePersonalizado<RespuestaReporteAlineacionMIR> respuesta = new MensajePersonalizado<RespuestaReporteAlineacionMIR>();

		respuesta = servicioReporte.alineacionGeneral(idAnhoo,cveUsuario);

		return respuesta;
	}
	@GetMapping("adecuaciones/general/{idAnhoo}/{cveUsuario}")
	public MensajePersonalizado<RespuestaReporteAdecuacionDTO> adecuacionesGeneral(@PathVariable Integer idAnhoo, @PathVariable String cveUsuario){
		MensajePersonalizado<RespuestaReporteAdecuacionDTO> respuesta = new MensajePersonalizado<RespuestaReporteAdecuacionDTO>();

		respuesta = servicioReporte.adecuacionesGeneral(idAnhoo,cveUsuario);

		return respuesta;
	}
	@GetMapping("seguimiento/general/{idAnhoo}/{cveUsuario}")
	public MensajePersonalizado<RespuestaReporteSeguimientoDTO> seguimientoGeneral(@PathVariable Integer idAnhoo, @PathVariable String cveUsuario){
		MensajePersonalizado<RespuestaReporteSeguimientoDTO> respuesta = new MensajePersonalizado<RespuestaReporteSeguimientoDTO>();

		respuesta = servicioReporte.seguimientoGeneral(idAnhoo,cveUsuario);

		return respuesta;
	}
	@GetMapping("presupuesto/general/{idAnhoo}/{cveUsuario}")
	public MensajePersonalizado<RespuestaReportePresupuestoDTO> presupuestoGeneral(@PathVariable Integer idAnhoo, @PathVariable String cveUsuario){
		MensajePersonalizado<RespuestaReportePresupuestoDTO> respuesta = new MensajePersonalizado<RespuestaReportePresupuestoDTO>();

		respuesta = servicioReporte.presupuestoGeneral(idAnhoo, cveUsuario);

		return respuesta;
	}
}
