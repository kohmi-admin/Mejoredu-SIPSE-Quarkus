package mx.sep.dgtic.mejoredu.seguimiento.controller;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.sep.dgtic.mejoredu.cortoplazo.PeticionRegistroArchivosSeccion;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.mejoredu.seguimiento.service.ArchivoSeccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/archivos-mediano-plazo")
public class ArchivosMedianoPlazo {
  @Autowired
  private ArchivoSeccionService archivoSeccionService;

  @GetMapping("/consultaPorAnhio/{idAnhio}")
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
