package mx.sep.dgtic.mejoredu.cortoplazo.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPresupuesto;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaPresupuesto;
import mx.sep.dgtic.mejoredu.cortoplazo.service.PresupuestoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presupuesto")
public class PresupuestoController {
  @Inject
  private PresupuestoService presupuestoService;

  @GetMapping("/consultarPorProducto/{idProducto}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<RespuestaPresupuesto>> consultarPresupuestosPorIdProducto(@PathVariable int idProducto) {
    Log.info("Iniciando consultarPresupuestosPorIdProducto");
    Log.info("consultarPresupuestosPorIdProducto por : " + idProducto);

    var presupuestos = presupuestoService.consultaPorIdProducto(idProducto);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", presupuestos);

    Log.info("Termina consultarPresupuestosPorIdProducto");
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
  public RespuestaGenerica registrarPresupuesto(@RequestBody PeticionPresupuesto peticion) {
    Log.info("Iniciando registrarPresupuesto");
    Log.info("registrarPresupuesto por : " + peticion.getIdProducto());

    presupuestoService.registrar(peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

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

  @PutMapping("/eliminar/{idPresupuesto}")
  public RespuestaGenerica eliminarPresupuesto(@PathVariable int idPresupuesto) {
    Log.info("Iniciando eliminarPresupuesto");
    Log.info("eliminarPresupuesto por : " + idPresupuesto);

    presupuestoService.eliminar(idPresupuesto);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.info("Termina eliminarPresupuesto");
    return respuesta;
  }
}
