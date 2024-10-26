package mx.sep.dgtic.mejoredu.cortoplazo.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.MetasBienestarDTO;
import mx.sep.dgtic.mejoredu.cortoplazo.ProductoDTO;
import mx.sep.dgtic.mejoredu.cortoplazo.service.MetasBienestarService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/cortoplazo/metasbienestar")
public class MetasBienestarController {
  @Inject
  private MetasBienestarService metasBienestarService;

  @GetMapping("consultarPorAnhio/{anhio}/{cveUsuario}")
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<MetasBienestarDTO>> consultarPorAnhio(@PathVariable Integer anhio, @PathVariable String cveUsuario) {
    Log.info("Iniciando consultarPorAnhio");
    Log.info("consultarPorAnhio por : " + anhio);

    var metasBienestar = metasBienestarService.consultarPorAnhio(anhio, cveUsuario );
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", metasBienestar);

    Log.info("Termina consultarPorAnhio");
    return respuesta;
  }

  @GetMapping("productos/consultarPorIdCatalogoIndicadorPI/{anhio}/{cveUsuario}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<ProductoVO>> consultarPorIdCatalogoIndicadorPI(@PathVariable Integer anhio, @PathVariable String cveUsuario) {
    Log.info("Iniciando consultarPorIdCatalogoIndicadorPI");

    var metasBienestar = metasBienestarService.consultarPorIdCatalogoIndicadorPI(anhio, cveUsuario );
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", metasBienestar);

    Log.info("Termina consultarPorIdCatalogoIndicadorPI");
    return respuesta;
  }


  @GetMapping("consultarPorID/{idProducto}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<ProductoVO> consultarPorId(@PathVariable Integer idProducto) {
    Log.info("Iniciando consultarPorId");
    Log.info("consultarPorId por : " + idProducto);

    var producto = metasBienestarService.consultarPorId(idProducto);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", producto);

    Log.info("Termina consultarPorId");
    return respuesta;
  }

}
