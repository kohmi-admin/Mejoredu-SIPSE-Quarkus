package mx.sep.dgtic.mejoredu.cortoplazo.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionProducto;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductosController {
  @Inject
  private ProductoService productoService;

  @GetMapping("consultaPorActividad/{idActividad}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<ProductoVO>> consultaPorActividad(@PathVariable int idActividad) {
    Log.info("Iniciando consultaPorActividad");
    Log.info("consultaPorActividad por : " + idActividad);

    var productos = productoService.consultaPorActividad(idActividad);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", productos);

    Log.info("Termina consultaPorActividad");
    return respuesta;
  }

  @GetMapping("consultarPorID/{idProducto}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<ProductoVO> consultarPorID(@PathVariable int idProducto) {
    Log.debug("Iniciando consultarPorID ");
    Log.debug("consultarPorID por : " + idProducto);

    var producto = productoService.consultarPorId(idProducto);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", producto);

    Log.debug("Termina consultarPorID ");
    return respuesta;
  }

  @PostMapping("registrar")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica registrar(PeticionProducto peticion) {
    Log.debug("Iniciando registrar ");
    Log.debug("registrar por : " + peticion.getIdActividad());

    
    productoService.registrar(peticion);;
    RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.debug("Termina registrar ");
    return respuesta;
  }

  @PutMapping("modificar/{idProducto}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica modificar(@PathVariable int idProducto, PeticionProducto peticion) {
    Log.debug("Iniciando modificar ");
    Log.debug("modificar por : " + idProducto);

    productoService.modificar(idProducto, peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.debug("Termina modificar ");
    return respuesta;
  }

  @PutMapping("eliminar/{idProducto}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica eliminar(@PathVariable int idProducto) {
    Log.debug("Iniciando eliminar ");
    Log.debug("eliminar por : " + idProducto);

    productoService.eliminar(idProducto);
    RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.debug("Termina eliminar ");
    return respuesta;
  }
}
