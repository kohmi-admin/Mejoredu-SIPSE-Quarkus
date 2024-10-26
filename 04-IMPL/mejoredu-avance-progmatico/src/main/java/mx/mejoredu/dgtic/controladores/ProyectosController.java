package mx.mejoredu.dgtic.controladores;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.seguimiento.ProyectoBaseVO;
import mx.mejoredu.dgtic.servicios.ProyectosService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proyectos")
public class ProyectosController {
  @Inject
  private ProyectosService proyectosService;
  @GetMapping("/consultarPAA")
  public MensajePersonalizado<List<ProyectoBaseVO>> consultarPAA(
      @RequestParam Integer idAnhio,
      @RequestParam String cveUsuario,
      @RequestParam(required = false) Integer trimestre
  ) {
    Log.debug("Iniciando consultarPAA");

    List<ProyectoBaseVO> proyectos = proyectosService.consultaPAA(idAnhio, cveUsuario, trimestre);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", proyectos);

    Log.debug("Terminando consultarPAA");

    return respuesta;
  }

  @GetMapping("/consultarPaaIdUnidad")
  public MensajePersonalizado<List<ProyectoBaseVO>> consultarPaaIdUnidad(@RequestParam Integer idAnhio, @RequestParam Integer idUnidad) {
    Log.debug("Iniciando consultarPaaIdUnidad");

    List<ProyectoBaseVO> proyectos = proyectosService.consultaPaaIdUnidad(idAnhio, idUnidad);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", proyectos);

    Log.debug("Terminando consultarPaaIdUnidad");

    return respuesta;
  }

  @PostMapping("/enviarRevision")
  public RespuestaGenerica enviarRevision(
      @RequestParam Integer idProyecto,
      @RequestParam Integer trimestre
  ) {
    Log.debug("Iniciando enviarRevision");
    if (trimestre == null || trimestre < 1 || trimestre > 4) {
      throw new BadRequestException("El trimestre debe ser un valor entre 1 y 4");
    }
    if (idProyecto == null) {
      throw new BadRequestException("El idProyecto es requerido");
    }

    proyectosService.enviarRevision(idProyecto, trimestre);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.debug("Terminando enviarRevision");

    return respuesta;
  }
}
