package mx.sep.dgtic.mejoredu.seguimiento.controller;

import mx.edu.sep.dgtic.mejoredu.Enums.TiposProgramasPresupuestales;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.ConsultaSeguimientoMirFidVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.RegistroSeguimientoMirFidVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.RegistroOtrasMetasSeguimientoVO;
import mx.sep.dgtic.mejoredu.seguimiento.service.SeguimientoMirFidService;

import java.util.List;

@RestController
@RequestMapping("api/seguimiento/mir-fid/actividad")
public class SeguimientoActividadesMirController {

	@Inject
	private SeguimientoMirFidService seguimientoService;

	@GetMapping("/consulta-m001/{cveUsuario}/{anhio}/{semestre}")
	public MensajePersonalizado<ConsultaSeguimientoMirFidVO> consultarM001PorAnhio(
			@PathVariable Integer anhio,
			@PathVariable Integer semestre,
			@PathVariable String cveUsuario
	) {
		var consulta = seguimientoService.consultarSeguimientoMirFid(anhio, semestre, cveUsuario, TiposProgramasPresupuestales.M001);
		return new MensajePersonalizado<>("200", "Exitoso", consulta);
	}

	@GetMapping("/consulta-todos-m001/{cveUsuario}/{anhio}/{semestre}")
	public MensajePersonalizado<List<ConsultaSeguimientoMirFidVO>> consultarTodosM001PorAnhio(
			@PathVariable Integer anhio,
			@PathVariable Integer semestre,
			@PathVariable String cveUsuario
	) {
		var consulta = seguimientoService.consultarVariosSeguimientoMirFid(anhio, semestre, cveUsuario, TiposProgramasPresupuestales.M001);
		return new MensajePersonalizado<>("200", "Exitoso", consulta);
	}

	@PostMapping("/actividad-m001")
	public MensajePersonalizado<String> registrarActividadM001(
			@RequestBody RegistroSeguimientoMirFidVO actividadApoyo) {
		seguimientoService.registrarSeguimientoMirFid(actividadApoyo, TiposProgramasPresupuestales.M001);
		return new MensajePersonalizado<>("200", "Exitoso", "Se registro Correctamente");
	}

	@PostMapping("/meta-m001")
	public MensajePersonalizado<String> registrarMetaM001(
			@RequestBody RegistroOtrasMetasSeguimientoVO metaAdministrativa) {
		seguimientoService.registrarOtrasMetasSeguimiento(metaAdministrativa, TiposProgramasPresupuestales.M001);
		return new MensajePersonalizado<>("200", "Exitoso", "Se registro Correctamente");
	}

	@GetMapping("/consulta-o001/{cveUsuario}/{anhio}/{semestre}")
	public MensajePersonalizado<ConsultaSeguimientoMirFidVO> consultarO001PorAnhio(
			@PathVariable Integer anhio,
			@PathVariable Integer semestre,
			@PathVariable String cveUsuario
	) {
		var consulta = seguimientoService.consultarSeguimientoMirFid(anhio, semestre, cveUsuario, TiposProgramasPresupuestales.O001);
		return new MensajePersonalizado<>("200", "Exitoso", consulta);
	}

	@GetMapping("/consulta-todos-o001/{cveUsuario}/{anhio}/{semestre}")
	public MensajePersonalizado<List<ConsultaSeguimientoMirFidVO>> consultarTodosO001PorAnhio(
			@PathVariable Integer anhio,
			@PathVariable Integer semestre,
			@PathVariable String cveUsuario
	) {
		var consulta = seguimientoService.consultarVariosSeguimientoMirFid(anhio, semestre, cveUsuario, TiposProgramasPresupuestales.O001);
		return new MensajePersonalizado<>("200", "Exitoso", consulta);
	}

	@PostMapping("/actividad-o001")
	public MensajePersonalizado<String> registrarActividadO001(
			@RequestBody RegistroSeguimientoMirFidVO actividadApoyo) {
		seguimientoService.registrarSeguimientoMirFid(actividadApoyo, TiposProgramasPresupuestales.O001);
		return new MensajePersonalizado<>("200", "Exitoso", "Se registro Correctamente");
	}

	@PostMapping("/meta-o001")
	public MensajePersonalizado<String> registrarMetaO001(
			@RequestBody RegistroOtrasMetasSeguimientoVO metaAdministrativa) {
		seguimientoService.registrarOtrasMetasSeguimiento(metaAdministrativa, TiposProgramasPresupuestales.O001);
		return new MensajePersonalizado<>("200", "Exitoso", "Se registro Correctamente");
	}
}
