package mx.sep.dgtic.mejoredu.seguimiento.controller;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.seguimiento.mir.SeguimientoJustificacionesMirDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionJustificacionActividadesVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionJustificacionIndicadorVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mir.SeguimientoMirDTO;
import mx.sep.dgtic.mejoredu.seguimiento.service.SeguimientoMirFidService;

@RestController
@RequestMapping("api/seguimiento/mir-fid/planeacion")
public class SeguimientoPlaneacionMirController {

	@Inject
	private SeguimientoMirFidService seguimientoService;

	@GetMapping("/consultaMirPorAnhio/{anhio}")
	public MensajePersonalizado<List<SeguimientoMirDTO>> consultaMirPorAnio(@PathVariable Integer anhio) {
		return new MensajePersonalizado<>("200", "PeticionJustificacionActividadesVOExitoso", seguimientoService.consultaPorAnhio(anhio));
	}

	@GetMapping("/consultarJustificaciones/{anhio}/{trimestre}")
	public MensajePersonalizado<List<SeguimientoJustificacionesMirDTO>> consultarJustificaciones(
			@PathVariable Integer anhio,
			@PathVariable Integer trimestre
	) {
		return new MensajePersonalizado<>("200", "Exitoso",
				seguimientoService.consultarJustificaciones(anhio, trimestre));
	}

	@GetMapping("/justificacion/indicador/{idIndicador}")
	public MensajePersonalizado<PeticionJustificacionIndicadorVO> consultaJustificacionIndicador(
			@PathVariable Integer idIndicador) {
		return new MensajePersonalizado<>("200", "Exitoso",
				seguimientoService.consultaJustificacionIndicador(idIndicador));
	}

	@PostMapping("/justificacion/indicador")
	public MensajePersonalizado<String> registrarIndicador(@RequestBody PeticionJustificacionIndicadorVO justificacion) {
		seguimientoService.registrarIndicador(justificacion);
		return new MensajePersonalizado<>("200", "Exitoso", "Se registro Correctamente");
	}

	@GetMapping("/justificacion/actividad/{idIndicador}/{trimestre}")
	public MensajePersonalizado<PeticionJustificacionActividadesVO> consultaJustificacionActividad(
			@PathVariable Integer idIndicador,
			@PathVariable Integer trimestre
	) {
		return new MensajePersonalizado<>("200", "Exitoso",
				seguimientoService.consultaJustificacionActividad(idIndicador, trimestre));
	}

	@PostMapping("/justificacion/actividad")
	public MensajePersonalizado<String> registrarActividad(
			@RequestBody PeticionJustificacionActividadesVO justificacion) {
		seguimientoService.registrarActividad(justificacion);
		return new MensajePersonalizado<>("200", "Exitoso", "Se registro Correctamente");
	}

}