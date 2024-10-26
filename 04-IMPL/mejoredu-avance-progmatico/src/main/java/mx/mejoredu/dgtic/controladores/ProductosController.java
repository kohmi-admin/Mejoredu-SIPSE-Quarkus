package mx.mejoredu.dgtic.controladores;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.seguimiento.ProductoEvidenciaVO;
import mx.mejoredu.dgtic.servicios.ProductosService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductosController {
  @Inject
  private ProductosService productosService;

  @GetMapping("/consultarProductos")
  public MensajePersonalizado<List<ProductoEvidenciaVO>> consultarProductos(
      @RequestParam Integer idActividad,
      @RequestParam(required = false) Integer trimestre
  ) {
    Log.debug("Iniciando consultarProductos");

    var productos = productosService.consultaProductos(idActividad, trimestre);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", productos);

    Log.debug("Terminando consultarProductos");

    return respuesta;
  }
}
