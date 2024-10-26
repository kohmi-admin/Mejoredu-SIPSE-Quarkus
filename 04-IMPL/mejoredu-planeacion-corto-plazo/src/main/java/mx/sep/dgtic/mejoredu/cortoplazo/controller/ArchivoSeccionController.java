package mx.sep.dgtic.mejoredu.cortoplazo.controller;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.sep.dgtic.mejoredu.cortoplazo.PeticionRegistroArchivosSeccion;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ArchivoSeccionService;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/archivo-seccion")
public class ArchivoSeccionController {
  @Autowired
  private ArchivoSeccionService archivoSeccionService;

  @GetMapping("consultaPorAnhio/{idAnhio}/{subseccion}")
  public MensajePersonalizado<List<ArchivoDTO>> consultaPorSeccion(
      @PathVariable Integer idAnhio,
      @PathVariable Integer subseccion
  ) {
    var archivos = archivoSeccionService.consultarArchivos(idAnhio, subseccion);
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
