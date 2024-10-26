package mx.mejoredu.dgtic.controladores;

import java.util.List;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.inject.Inject;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.reportes.PAAAprobadoDTO;
import mx.edu.sep.dgtic.mejoredu.reportes.PeticionPAAA;
import mx.mejoredu.dgtic.servicios.IReporteadorService;

@RestController
@RequestMapping("/api/extractores")
public class PAAAprobadosControllers {
	
	@Inject
	IReporteadorService servicioReporte;
	
	@PatchMapping("paaaprobado")
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<PAAAprobadoDTO>> consultarPAAAprobados(@RequestBody PeticionPAAA peticionPAAA){
		return servicioReporte.consultarPAAAprobados(peticionPAAA);
	}

}
