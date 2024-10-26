package mx.mejoredu.dgtic.controladores;

import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.seguimiento.RespuestaSeguimientoMirVO;
import mx.mejoredu.dgtic.servicios.AvanceMirService;
import org.jfree.util.Log;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/avances-mir")
public class AvanceMirController {
  @Inject
  private AvanceMirService avanceMirService;

  @GetMapping("/segumiento-mir")
  public MensajePersonalizado<RespuestaSeguimientoMirVO> consultarSeguimientoMir(
    @RequestParam int idAnhio
  ) {
    Log.debug("Iniciando consultarSeguimientoMir");
    Log.debug("consultarSeguimientoMir por : " + idAnhio);

    var avanceMir = avanceMirService.consultarAvanceMir(idAnhio);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", avanceMir);

    Log.debug("Termina consultarSeguimientoMir");

    return respuesta;
  }
}
