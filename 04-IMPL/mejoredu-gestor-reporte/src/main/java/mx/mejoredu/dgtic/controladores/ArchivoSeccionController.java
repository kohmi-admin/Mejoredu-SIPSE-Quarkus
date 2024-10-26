package mx.mejoredu.dgtic.controladores;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.mejoredu.dgtic.servicios.ArchivoSeccionService;
import mx.sep.dgtic.mejoredu.cortoplazo.PeticionRegistroArchivosSeccion;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/archivo-seccion")
public class ArchivoSeccionController {
  @Autowired
  private ArchivoSeccionService archivoSeccionService;

  @GetMapping("consultaPorAnhio/{idAnhio}")
  public MensajePersonalizado<List<ArchivoDTO>> consultaPorSeccion(
      @PathVariable Integer idAnhio
  ) {
    var archivos = archivoSeccionService.consultarArchivos(idAnhio);
    return new MensajePersonalizado<>("200", "Exitoso", archivos);
  }

  @PostMapping("registrar")
  public MensajePersonalizado<Void> registrar(
      @RequestBody PeticionRegistroArchivosSeccion peticion
  ) {
    archivoSeccionService.registrar(peticion);
    return new MensajePersonalizado<>("200", "Exitoso", null);
  }
}
