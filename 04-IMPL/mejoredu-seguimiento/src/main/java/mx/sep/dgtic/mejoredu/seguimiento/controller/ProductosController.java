package mx.sep.dgtic.mejoredu.seguimiento.controller;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.producto.RespuestaAdecuacionProductoVO;
import mx.sep.dgtic.mejoredu.seguimiento.producto.RespuestaRegistroProductoVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionProductoVO;
import mx.sep.dgtic.mejoredu.seguimiento.producto.PeticionCancelacionProductoVO;
import mx.sep.dgtic.mejoredu.seguimiento.service.ProductoService;

@RestController
@RequestMapping("/api/seguimiento/productos")
public class ProductosController {
	@Inject
	private ProductoService productoService;

	@GetMapping("consultaProductoModificacion/{idAdecuacionSolicitud}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<RespuestaAdecuacionProductoVO>> consultaProductoModificacion(@PathVariable int idAdecuacionSolicitud) {
		Log.info("Iniciando consultaProductoModificacion");
		Log.info("consultaProductoModificacion por : " + idAdecuacionSolicitud);

		var productos = productoService.consultaProductoModificacion(idAdecuacionSolicitud);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", productos);

		Log.info("Termina consultaProductoModificacion");
		return respuesta;
	}

	@GetMapping("consultaProductoCancelacion/{idAdecuacionSolicitud}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<RespuestaAdecuacionProductoVO>> consultaProductoCancelacion(@PathVariable int idAdecuacionSolicitud) {
		Log.info("Iniciando consultaProductoCancelacion");
		Log.info("consultaProductoCancelacion por : " + idAdecuacionSolicitud);

		var productos = productoService.consultaProductoCancelacion(idAdecuacionSolicitud);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", productos);

		Log.info("Termina consultaProductoCancelacion");
		return respuesta;
	}

	@GetMapping("consultaPorActividadSolicitud")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<ProductoVO>> consultaPorActividadSolicitud(@RequestParam int idActividad,
			@RequestParam(defaultValue = "false") boolean excluirCortoPlazo, @RequestParam int idSolicitud) {
		Log.info("Iniciando consultaPorActividadSolicitud");
		Log.info("consultaPorActividadSolicitud por : " + idActividad);

		var productos = productoService.consultaPorActividadSolicitud(idActividad, excluirCortoPlazo, idSolicitud);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", productos);

		Log.info("Termina consultaPorActividadSolicitud");
		return respuesta;
	}

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
	public MensajePersonalizado<RespuestaRegistroProductoVO> registrar(PeticionProductoVO peticion) {
		Log.debug("Iniciando registrar ");
		Log.debug("registrar por : " + peticion.getIdActividad());

		var respuestaRegistro = productoService.registrar(peticion);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", respuestaRegistro);

		Log.debug("Termina registrar ");
		return respuesta;
	}

	@PutMapping("modificar/{idProducto}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica modificar(@PathVariable int idProducto, PeticionProductoVO peticion) {
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

	@PutMapping("eliminarAdecuacion")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminarAdecuacion(@RequestBody PeticionEliminarModificacion peticion) {
		Log.debug("Iniciando eliminarAdecuacion");
		productoService.eliminarAdecuacion(peticion);
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		Log.debug("Termina eliminarAdecuacion");
		return respuesta;
	}

	@PutMapping("cancelarProducto")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica cancelarProducto(@RequestBody PeticionCancelacionProductoVO peticion) {
		Log.debug("Iniciando cancelarProducto");
		productoService.cancelarProducto(peticion);
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		Log.debug("Termina cancelarProducto");
		return respuesta;
	}

	@GetMapping("secuencialPorActividad/{idActividad}")
	public MensajePersonalizado<Integer> secuencialPorActividad(@PathVariable Integer idActividad) {
		return productoService.secuencialPorActividad(idActividad);
	}
	
	@GetMapping("secuencialPorProyecto/{idProyecto}")
	public MensajePersonalizado<Integer> secuencialPorProyecto(@PathVariable Integer idProyecto) {
		return productoService.secuencialPorProyecto(idProyecto);
	}

	@GetMapping("consulta-actividades-por-producto/{idProducto}/{trimestre}")
	public MensajePersonalizado consultaActividadesPorProducto(@PathVariable Integer idProducto, @PathVariable Integer trimestre){
		var actividades = productoService.consultaActividadPorProducto(idProducto, trimestre);
        return new MensajePersonalizado<>("200", "Exitoso", actividades);
	}

}
