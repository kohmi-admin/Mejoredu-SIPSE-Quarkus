package mx.sep.dgtic.mejoredu.seguimiento.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPresupuesto;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaPresupuesto;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.presupuesto.*;
import mx.sep.dgtic.mejoredu.seguimiento.service.PresupuestoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seguimiento/presupuesto")
public class PresupuestoController {
  @Inject
  private PresupuestoService presupuestoService;

  @GetMapping("/consultarPresupuestos")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<RespuestaPresupuesto>> consultarPresupuestos(
      @RequestParam int idProducto,
      @RequestParam(defaultValue = "false") boolean excluirCortoPlazo,
      @RequestParam int idSolicitud
  ) {
    Log.info("Iniciando consultarPresupuestosPorIdProducto");
    Log.info("consultarPresupuestosPorIdProducto por : " + idProducto);

    var presupuestos = presupuestoService.consultaPorProductoSolicitud(idProducto, excluirCortoPlazo, idSolicitud);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", presupuestos);

    Log.info("Termina consultarPresupuestosPorIdProducto");
    return respuesta;
  }

  @GetMapping("/consultarPresupuestoModificacion/{idAdecuacionSolicitud}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<RespuestaAdecuacionPresupuestoVO>> consultarPresupuestoModificacion(@PathVariable int idAdecuacionSolicitud) {
    Log.info("Iniciando consultarPresupuestoModificacion");
    Log.info("consultarPresupuestoModificacion por : " + idAdecuacionSolicitud);

    var presupuestos = presupuestoService.consultarPresupuestoModificacion(idAdecuacionSolicitud);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", presupuestos);

    Log.info("Termina consultarPresupuestoModificacion");
    return respuesta;
  }

  @GetMapping("/consultarPresupuestoCancelacion/{idAdecuacionSolicitud}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<RespuestaAdecuacionPresupuestoVO>> consultarPresupuestoCancelacion(@PathVariable int idAdecuacionSolicitud) {
    Log.info("Iniciando consultarPresupuestoCancelacion");
    Log.info("consultarPresupuestoCancelacion por : " + idAdecuacionSolicitud);

    var presupuestos = presupuestoService.consultarPresupuestoCancelacion(idAdecuacionSolicitud);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", presupuestos);

    Log.info("Termina consultarPresupuestoCancelacion");
    return respuesta;
  }

  @GetMapping("/consultarPorID/{idPresupuesto}")
  public MensajePersonalizado<RespuestaPresupuesto> consultarPresupuestosPorId(@PathVariable int idPresupuesto) {
    Log.info("Iniciando consultarPresupuestosPorIdProducto");
    Log.info("consultarPresupuestosPorIdProducto por : " + idPresupuesto);

    var presupuestos = presupuestoService.consultarPorId(idPresupuesto);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", presupuestos);

    Log.info("Termina consultarPresupuestosPorIdProducto");
    return respuesta;
  }

  @PostMapping("/registrar")
  public MensajePersonalizado<RespuestaRegistroPresupuestoVO> registrarPresupuesto(@RequestBody PeticionPresupuestoVO peticion) {
    Log.info("Iniciando registrarPresupuesto");
    Log.info("registrarPresupuesto por : " + peticion.getIdProducto());

    var respuestaRegistro = presupuestoService.registrar(peticion);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", respuestaRegistro);

    Log.info("Termina registrarPresupuesto");
    return respuesta;
  }

  @PutMapping("/modificar/{idPresupuesto}")
  public RespuestaGenerica editarPresupuesto(@PathVariable int idPresupuesto, @RequestBody PeticionPresupuesto peticion) {
    Log.info("Iniciando editarPresupuesto");
    Log.info("editarPresupuesto por : " + idPresupuesto);

    presupuestoService.modificar(idPresupuesto, peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.info("Termina editarPresupuesto");
    return respuesta;
  }

  @PutMapping("/cancelar")
  public RespuestaGenerica cancelarPresupuesto(@RequestBody PeticionCancelacionPresupuestoVO peticion) {
    Log.info("Iniciando cancelarPresupuesto");
    Log.info("cancelarPresupuesto por : " + peticion.getIdPresupuestoReferencia());

    presupuestoService.cancelar(peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.info("Termina cancelarPresupuesto");
    return respuesta;
  }

  @PutMapping("/eliminar/{idPresupuesto}")
  public RespuestaGenerica eliminarPresupuesto(@PathVariable int idPresupuesto) {
    Log.info("Iniciando eliminarPresupuesto");
    Log.info("eliminarPresupuesto por : " + idPresupuesto);

    presupuestoService.eliminar(idPresupuesto);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.info("Termina eliminarPresupuesto");
    return respuesta;
  }

  @PutMapping("/eliminarAdecuacion")
  public RespuestaGenerica eliminarAdecuacion(@RequestBody PeticionEliminarModificacion peticion) {
    Log.info("Iniciando eliminarAdecuacion");
    presupuestoService.eliminarAdecuacion(peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");
    Log.info("Termina eliminarAdecuacion");
    return respuesta;
  }

  @PutMapping("/eliminarAjuste")
  public RespuestaGenerica eliminarAjuste(@RequestBody PeticionEliminarModificacion peticion) {
    Log.info("Iniciando eliminarAjuste");
    presupuestoService.eliminarAjuste(peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");
    Log.info("Termina eliminarAjuste");
    return respuesta;
  }

  /*@PostMapping("/ampliacion")
  public RespuestaGenerica ampliacionPresupuesto(@RequestBody AdecuacionPresupuestoVO peticion) {
    Log.info("Iniciando ampliacionPresupuesto");

    
    var respuesta = presupuestoService.ampliacion(peticion);

    Log.info("Termina ampliacionPresupuesto");
    return respuesta;
  }*/

  /*@PostMapping("/reduccion")
  public RespuestaGenerica reduccionPresupuesto(@RequestBody AdecuacionPresupuestoVO peticion) {
    Log.info("Iniciando reduccionPresupuesto");

    var respuesta = presupuestoService.reduccion(peticion);
    

    Log.info("Termina reduccionPresupuesto");
    return respuesta;
  }*/

  /*@PostMapping("/reintegro")
  public RespuestaGenerica reintegroPresupuesto(@RequestBody AdecuacionPresupuestoVO peticion) {
    Log.info("Iniciando reintegroPresupuesto");

    presupuestoService.reintegro(peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.info("Termina reintegroPresupuesto");
    return respuesta;
  }*/
  
  @PostMapping("/registrarAjuste")
  public RespuestaGenerica registrarAjuste(@RequestBody AdecuacionPresupuestoVO peticion) {
    Log.info("Iniciando registrarAjuste");

    presupuestoService.ampliacion(peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.info("Termina registrarAjuste");
    return respuesta;
  }
  
  @GetMapping("/consultarAjustes/{idPresupuesto}/{idAdecuacionSolicitud}")
  public MensajePersonalizado<List<PartidaAdecuacionVO>> consultarAjuste(@PathVariable("idAdecuacionSolicitud") int idAdecuacionSolicitud, @PathVariable("idPresupuesto") int idPresupuesto) {
    Log.info("Iniciando consultarAjustes");

    var respuesta = presupuestoService.consultarAjuste(idPresupuesto, idAdecuacionSolicitud);

    Log.info("Termina consultarAjustes");
    return respuesta;
  }

  /*@PostMapping("/traspaso")
  public RespuestaGenerica traspasoPresupuesto(@RequestBody AdecuacionPresupuestoVO peticion) {
    Log.info("Iniciando traspasoPresupuesto");

    presupuestoService.traspaso(peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.info("Termina traspasoPresupuesto");
    return respuesta;
  }*/
  
}
