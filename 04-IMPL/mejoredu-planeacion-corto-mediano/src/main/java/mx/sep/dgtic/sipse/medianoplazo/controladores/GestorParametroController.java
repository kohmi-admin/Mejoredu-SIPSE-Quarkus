package mx.sep.dgtic.sipse.medianoplazo.controladores;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.RespuestaCatalogo;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ElementoDTO;
import mx.sep.dgtic.sipse.medianoplazo.servicios.ParametroService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.PeticionMetasBienestarDTO;

@RestController
@RequestMapping("/api/mp/parametro")
public class GestorParametroController {
  @Inject
  private ParametroService parametroService;

  @GetMapping("/consultarCatalogoIndicadores/{anhio}")
  public RespuestaCatalogo consultarCatalogoIndicadoresPI(@PathVariable int anhio) {
    Log.info("Arrancando endpoint consultarOpcionCatalogoADto");

    RespuestaCatalogo respuestaCat = new RespuestaCatalogo("200", "Exitoso");

    var catalogos = parametroService.consultarCatalogoIndicadoresPI(anhio);

    respuestaCat.setCatalogo(catalogos);

    Log.info("Terminando endpoint consultarOpcionCatalogoADto");
    return respuestaCat;
  }

  @GetMapping("consultarPorEstrucura/{idEstructura}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<PeticionMetasBienestarDTO>> consultarPorIdEstrucura(@PathVariable Integer idEstructura) {
    Log.info("Iniciando consultarPorIdEstrucura en Parametro");
    Log.info("consultarPorIdEstrucura por : " + idEstructura);

    var parametro = parametroService.consultarPorIdEstrucura(idEstructura);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", parametro);

    Log.info("Termina consultarPorIdEstrucura en parametro");
    return respuesta;
  }

  @GetMapping("consultarPorID/{idParametro}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<PeticionMetasBienestarDTO> consultarPorId(@PathVariable Integer idParametro) {
    Log.info("Iniciando consultarPorId en parametro");
    Log.info("consultarPorId por : " + idParametro);

    var parametro = parametroService.consultarPorId(idParametro);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", parametro);

    Log.info("Termina consultarPorId en parametro");
    return respuesta;
  }

  @PostMapping("registrar")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica registrar(@RequestBody PeticionMetasBienestarDTO peticion) {
    Log.info("Iniciando registrar en Parametro");

    RespuestaGenerica respuesta = parametroService.registrar(peticion);

    Log.info("Termina registrar en parametro.");
    return respuesta;
  }

  @PutMapping("modificar")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica modificar(@RequestBody PeticionMetasBienestarDTO peticion) {
    Log.info("Iniciando modificar en parametro");

    Log.info("estructura por id :" + peticion.getIdEstructura());


    RespuestaGenerica respuesta = parametroService.modificar(peticion);

    Log.info("Termina modificar en parametro.");
    return respuesta;
  }


  @PutMapping("eliminar/{idParametro}/{cveUsuario}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica eliminar(@PathVariable Integer idParametro, @PathVariable String cveUsuario) {
    RespuestaGenerica respuesta = parametroService.eliminar(idParametro, cveUsuario);
    return respuesta;
  }

  @GetMapping("consultarPorIdProyecto/{idProyecto}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<ElementoDTO>> consultarPorIdProyecto(@PathVariable Integer idProyecto) {
    Log.info("Iniciando consultarPorIdProyecto en Parametro");
    Log.info("consultarPorIdProyecto por : " + idProyecto);

    var parametros = parametroService.consultarPorIdProyecto(idProyecto);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", parametros);

    Log.info("Termina consultarPorIdProyecto en parametro");
    return respuesta;
  }

  @GetMapping("consultarPorIdActividad/{idActividad}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<ElementoDTO>> consultarPorIdActividad(@PathVariable Integer idActividad) {
    Log.info("Iniciando consultarPorIdActividad en Parametro");
    Log.info("consultarPorIdActividad por : " + idActividad);

    var parametros = parametroService.consultarPorIdActividad(idActividad);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", parametros);

    Log.info("Termina consultarPorIdActividad en parametro");
    return respuesta;
  }
}
