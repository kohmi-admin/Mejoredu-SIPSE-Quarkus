package mx.sep.dgtic.mejoredu.cortoplazo.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.*;
import mx.sep.dgtic.mejoredu.cortoplazo.service.FormularioAnaliticoService;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ProyectoAnualService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/formulario-analitico")
public class FormularioAnaliticoController {
  @Inject
  FormularioAnaliticoService formularioAnaliticoService;
  @Inject
  private ProyectoAnualService proyectoAnualService;
  @GetMapping("consultaProyectosPorAnhioEstatus/{idAnhio}/{csEstatus}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaProyectos consultaProyectosPorAnhioEstatus(@PathVariable int idAnhio,@PathVariable EstatusEnum csEstatus) {
    Log.debug("Iniciando consultaProyectosPorAnhioEstatus");
    Log.debug("Anhios por : " + idAnhio);
    Log.debug("Estatus por : " + idAnhio);
    RespuestaProyectos respuesta = proyectoAnualService.consultaProyectos(idAnhio, csEstatus);

    Log.debug("Termina consultaProyectosPorAnhioEstatus");
    return respuesta;
  }

  @GetMapping("consultaProyectosPorAnhioParaVistaGeneral/{idAnhio}/{cveUsuario}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaProyectosVistaGeneral consultaProyectosPorAnhioParaVistaGeneral(@PathVariable int idAnhio,@PathVariable String cveUsuario) {
    Log.debug("Iniciando consultaProyectosPorAnhioParaVistaGeneral");
    Log.debug("consultaProyectosParaVistaGeneral por : " + idAnhio);
    RespuestaProyectosVistaGeneral respuesta = proyectoAnualService.consultaProyectosParaVistaGeneral(idAnhio, cveUsuario);

    Log.debug("Termina consultaProyectosParaVistaGeneral");
    return respuesta;
  }
  @GetMapping("consultaProyectosPorAnhioParaVistaGeneralPorId/{idAnhio}/{cveUsuario}/{idProyecto}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaProyectosVistaGeneralPorID consultaProyectosPorAnhioParaVistaGeneralPorId(@PathVariable int idAnhio,@PathVariable String cveUsuario,@PathVariable int idProyecto) {
    Log.debug("Iniciando consultaProyectosPorAnhioParaVistaGeneral");
    Log.debug("consultaProyectosParaVistaGeneral por : " + idAnhio);
    RespuestaProyectosVistaGeneralPorID respuesta = proyectoAnualService.consultaProyectosParaVistaGeneralPorId(idAnhio, cveUsuario,idProyecto);

    Log.debug("Termina consultaProyectosParaVistaGeneral");
    return respuesta;
  }
  
  @GetMapping("consultaProyectosPorAnhio/{idAnhio}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaProyectos consultaProyectosPorAnhio(@PathVariable int idAnhio) {
    Log.debug("Iniciando consultaProyectosPorAnhio");
    Log.debug("consultaProyectosPorAnhio por : " + idAnhio);
    RespuestaProyectos respuesta = proyectoAnualService.consultaProyectos(idAnhio, 0);

    Log.debug("Termina consultaProyectosPorAnhio");
    return respuesta;
  }
  @GetMapping("consultaProyectosPorAnhioParaValidar/{idAnhio}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaProyectos consultaProyectosPorAnhioParaValidar(@PathVariable int idAnhio) {
    Log.debug("Iniciando consultaProyectosPorAnhioParaValidar");
    Log.debug("consultaProyectosParaValidar por : " + idAnhio);
    RespuestaProyectos respuesta = proyectoAnualService.consultaProyectosParaValidar(idAnhio);

    Log.debug("Termina consultaProyectosParaValidar");
    return respuesta;
  }
  
  @GetMapping("consultaProyectosPorAnhioCarga/{idAnhio}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaProyectos consultaProyectosPorAnhioCarga(@PathVariable int idAnhio) {
    Log.debug("Iniciando consultaProyectosPorAnhioCarga");
    Log.debug("consultaProyectosPorAnhioCarga por : " + idAnhio);
    RespuestaProyectos respuesta = proyectoAnualService.consultaProyectosCarga(idAnhio, 0);

    Log.debug("Termina consultaProyectosPorAnhioCarga");
    return respuesta;
  }

  @GetMapping("consultarProyectoPorID/{idProyecto}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaProyectos consultarProyectoPorID(@PathVariable int idProyecto) {
    Log.debug("Iniciando consultarProyectoPorID ");
    Log.debug("consultaProyectosPorAnhio por : " + idProyecto);
    RespuestaProyectos respuesta = proyectoAnualService.consultaProyectos(0, idProyecto);
    Log.debug("Termina consultarProyectoPorID ");
    return respuesta;
  }

  @PostMapping("registrarProyecto")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica registrarProyecto(PeticionProyecto peticion) {
    Log.debug("Inicia registrarProyecto");

    RespuestaGenerica respuesta = proyectoAnualService.registrarProyectoAnual(peticion);

    Log.debug("Termina registrarProyecto");
    return respuesta;
  }

  @PutMapping("eliminarProyectosPorID")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica eliminarProyectosPorID(PeticionPorID peticion) {
    Log.debug("Iniciando eliminar ");
    Log.debug("eliminar por : " + peticion.getId());
    Log.debug("Usuario : " + peticion.getId());

    proyectoAnualService.eliminarProyectoAnual(peticion);
    RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");

    return respuesta;
  }

}
