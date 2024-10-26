package mx.mejoredu.dgtic.controladores;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.seguimiento.ActividadBaseVO;
import mx.mejoredu.dgtic.servicios.ActividadesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/actividades")
public class ActividadesController {
  @Inject
  private ActividadesService actividadesService;

  @GetMapping("/consultarActividades")
  public MensajePersonalizado<List<ActividadBaseVO>> consultarActividades(
      @RequestParam Integer idProyecto,
      @RequestParam(required = false) Integer trimestre
  ) {
    Log.debug("Iniciando consultarActividades");

    List<ActividadBaseVO> actividades = actividadesService.consultaActividades(idProyecto, trimestre);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", actividades);

    Log.debug("Terminando consultarActividades");

    return respuesta;
  }

  @GetMapping("/consultarActividadesPorAnhio")
  public MensajePersonalizado<List<ActividadBaseVO>> consultarActividadesPorAnhio(
      @RequestParam Integer anhio,
      @RequestParam Integer trimestre,
      @RequestParam Integer tipoRegistro
  ) {
    Log.debug("Iniciando consultarActividadesPorAnhio");

    if (anhio == null) {
      throw new BadRequestException("El año debe ser un valor válido");
    } else if (tipoRegistro == null && trimestre == null) {
      var actividades = actividadesService.consultaActividadesPorAnhio(anhio);
      var respuesta = new MensajePersonalizado<>("200", "Exitoso", actividades);

      Log.debug("Terminando consultarActividadesPorAnhio");

      return respuesta;
    } else if (tipoRegistro == null || tipoRegistro < 1 || tipoRegistro > 2) {
      throw new BadRequestException("El tipo de registro debe ser 1 (Meta vencida) o 2 (Meta adelantada)");
    } else if (trimestre == null || trimestre < 1 || trimestre > 4) {
      throw new BadRequestException("El trimestre debe ser un valor entre 1 y 4");
    }

    List<ActividadBaseVO> actividades = actividadesService.consultaActividadesPorAnhio(anhio, trimestre, tipoRegistro);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", actividades);

    Log.debug("Terminando consultarActividadesPorAnhio");

    return respuesta;
  }

  @GetMapping("/consultarActividadesPorAnhioUsuario")
  public MensajePersonalizado<List<ActividadBaseVO>> consultarActividadesPorAnhioAndUnidad(@RequestParam Integer anhio, @RequestParam String cveUsuario) {
    Log.debug("Iniciando consultarActividadesPorAnhioUsuario");

    List<ActividadBaseVO> actividades = actividadesService.consultaActividadesPorAnhioAndUnidad(anhio, cveUsuario);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", actividades);

    Log.debug("Terminando consultarActividadesPorAnhioUsuario");

    return respuesta;
  }
}