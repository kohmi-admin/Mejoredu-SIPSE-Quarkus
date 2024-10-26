package mx.sep.dgtic.sipse.medianoplazo.controladores;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.PeticionMetasBienestarDTO;
import mx.sep.dgtic.sipse.medianoplazo.servicios.MetasBienestarService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/medianoplazo/metasbienestar")
public class MetasBienestarController {
  @Inject
  private MetasBienestarService metasBienestarService;

  @GetMapping("consultarPorEstrucura/{idEstructura}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<PeticionMetasBienestarDTO>> consultarPorIdEstrucura(@PathVariable Integer idEstructura) {
    Log.info("Iniciando consultarPorIdEstrucura");
    Log.info("consultarPorIdEstrucura por : " + idEstructura);

    var metasBienestar = metasBienestarService.consultarPorIdEstrucura(idEstructura);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", metasBienestar);

    Log.info("Termina consultarPorIdEstrucura");
    return respuesta;
  }

  @GetMapping("consultarPorID/{idMetaBienestar}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<PeticionMetasBienestarDTO> consultarPorId(@PathVariable Integer idMetaBienestar) {
    Log.info("Iniciando consultarPorId");
    Log.info("consultarPorId por : " + idMetaBienestar);

    var metaBienestar = metasBienestarService.consultarPorId(idMetaBienestar);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", metaBienestar);

    Log.info("Termina consultarPorId");
    return respuesta;
  }

  @PostMapping("registrar")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica registrar(@RequestBody PeticionMetasBienestarDTO peticion) {
    Log.info("Iniciando registrar");

    RespuestaGenerica respuesta = metasBienestarService.registrar(peticion);

    Log.info("Termina registrar.");
    return respuesta;
  }

  @PutMapping("modificar")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica modificar(@RequestBody PeticionMetasBienestarDTO peticion) {
    Log.info("Iniciando modificar");

    Log.info("estructura por id :" + peticion.getIdEstructura());


      RespuestaGenerica respuesta = metasBienestarService.modificar(peticion);

    Log.info("Termina modificar.");
    return respuesta;
  }


  @PutMapping("eliminar/{idMetaBienestar}/{cveUsuario}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica eliminar(@PathVariable Integer idMetaBienestar, @PathVariable String cveUsuario) {
    RespuestaGenerica respuesta = metasBienestarService.eliminar(idMetaBienestar, cveUsuario);
    return respuesta ;
  }

}
