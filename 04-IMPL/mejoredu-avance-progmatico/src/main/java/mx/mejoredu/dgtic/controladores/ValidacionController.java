package mx.mejoredu.dgtic.controladores;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.mejoredu.dgtic.servicios.ValidacionService;
import mx.sep.dgtic.mejoredu.seguimiento.ValidacionDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/validacion")
public class ValidacionController {
  @Inject
  private ValidacionService validacionService;

  @PostMapping("guardar")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica guardar(@RequestBody ValidacionDTO peticion) {
    Log.info("Iniciando servicio de guardado de validaciones");
    validacionService.guardar(peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");
    Log.info("Termina servicio de guardado de validaciones");
    return respuesta;
  }

  @GetMapping("consultarRevision/{apartado}/{id}/{trimestre}/{rol}")
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<ValidacionDTO> consultarRevision(
    @PathVariable String apartado,
    @PathVariable Integer id,
    @PathVariable Integer trimestre,
    @PathVariable String rol
  ) {
    Log.info("Iniciando servicio de guardado de validaciones");
    var validacionDTO = validacionService.consultarRevision(apartado,id, trimestre, rol);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", validacionDTO);
    Log.info("Termina servicio de guardado de validaciones");
    return respuesta;
  }
}
