package mx.mejoredu.dgtic.controladores;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.mejoredu.dgtic.servicios.EstatusProgmaticoService;
import mx.sep.dgtic.mejoredu.seguimiento.ActividadEstatusProgramaticoVO;
import mx.sep.dgtic.mejoredu.seguimiento.DetallesProductoEstatusProgramaticoVO;
import mx.sep.dgtic.mejoredu.seguimiento.ProductosEstatusProgramaticoVO;
import mx.sep.dgtic.mejoredu.seguimiento.SeguimientoEstatusProgramaticoVO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Emmanuel Estrada Gonzalez (emmanuel.estrada)
 * @version 1.0
 */

@RestController
@RequestMapping("/api/seguimiento-programatico")
public class EstatusProgramaticoPresupuestalController {

  @Inject
  EstatusProgmaticoService estatusProgmaticoService;

  @GetMapping("proyectos")
  public MensajePersonalizado<List<SeguimientoEstatusProgramaticoVO>> consultarEstatus(
      @RequestParam(value = "anhio") Integer anhio,
      @RequestParam(value = "trimestre", required = false) Integer trimestre,
      @RequestParam(value = "idUnidad", required = false) Integer idUnidad,
      @RequestParam(value = "idProyecto", required = false) Integer idProyecto,
      @RequestParam(value = "idActividad", required = false) Integer idActividad,
      @RequestParam(value = "idTipoAdecuacion", required = false) Integer idTipoAdecuacion
  ) {
    Log.debug("Iniciando consulta estatus");
    var proyectos = estatusProgmaticoService.consultaEstatus(anhio, trimestre, idUnidad, idProyecto, idActividad, idTipoAdecuacion);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", proyectos);
    Log.debug("Terminando consultarPAA");
    return respuesta;
  }

  @GetMapping("proyectos/{idProyecto}/actividades")
  public MensajePersonalizado<List<ActividadEstatusProgramaticoVO>> consultarEstatusPorId(
      @PathVariable Integer idProyecto,
      @RequestParam(value = "trimestre", required = false) Integer trimestre
  ) {
    Log.debug("Inicio consulta estatus");
    var actividades = estatusProgmaticoService.consultarActividades(idProyecto, trimestre);
    Log.debug("Terminando consulta PAA");
    return new MensajePersonalizado<>("200", "Exitoso", actividades);
  }

  @GetMapping("actividades/{idActividad}/productos")
  public MensajePersonalizado<List<ProductosEstatusProgramaticoVO>> consultarProductos(
      @PathVariable Integer idActividad,
      @RequestParam(value = "trimestre", required = false) Integer trimestre
  ) {
    Log.debug("Inicio consulta estatus");
    var productos = estatusProgmaticoService.consultarProductos(idActividad, trimestre);
    Log.debug("Terminando consulta PAA");
    return new MensajePersonalizado<>("200", "Exitoso", productos);
  }

  @GetMapping("productos/{idProducto}")
  public MensajePersonalizado<DetallesProductoEstatusProgramaticoVO> consultarProductoPorId(@PathVariable Integer idProducto) {
    Log.debug("Inicio consulta estatus");
    var vo = estatusProgmaticoService.consultarDetallesProducto(idProducto);
    Log.debug("Terminando consulta PAA");
    return new MensajePersonalizado<>("200", "Exitoso", vo);
  }
}
