package mx.mejoredu.dgtic.controladores;

import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionProductosNoProgramadosVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.RespuestaProductosNoProgramadosVO;
import org.springframework.web.bind.annotation.*;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.mejoredu.dgtic.servicios.ProductoNoProgramadoService;

@RestController
@RequestMapping("/api/producto-no-programado")
public class ProductoNoProgmadoController {

  @Inject
  private ProductoNoProgramadoService productoNoProgramadoService;

  @PostMapping("registrarProducto/{cveUsuario}")
  @Consumes(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaProductosNoProgramadosVO> registrarProducto(@RequestBody PeticionProductosNoProgramadosVO productoNoProgramado, @PathVariable String cveUsuario) {
    var respuesta = productoNoProgramadoService.registrar(productoNoProgramado, cveUsuario);
    return new MensajePersonalizado<>("200", "Exitoso", respuesta);
  }

}
