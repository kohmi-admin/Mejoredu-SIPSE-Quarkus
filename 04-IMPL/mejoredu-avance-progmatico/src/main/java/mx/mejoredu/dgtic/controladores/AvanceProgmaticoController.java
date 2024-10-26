package mx.mejoredu.dgtic.controladores;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.seguimiento.*;
import mx.mejoredu.dgtic.dao.MetasVencidasAdelantadas;
import mx.mejoredu.dgtic.servicios.AvanceProgmaticoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/avance-programatico")
public class AvanceProgmaticoController {
    @Inject
    AvanceProgmaticoService avanceProgmaticoService;

    @GetMapping("consultar-avances")
    public MensajePersonalizado<List<RespuestaAvancesProgramaticosVO>> consultarAvances(
        @RequestParam Integer anhio
    ) {
        Log.debug("Iniciando consultarAvances");

        var avances = avanceProgmaticoService.consultarAvances(anhio);
        var respuesta = new MensajePersonalizado<>("200", "Exitoso", avances);

        Log.debug("Terminando consultarAvances");

        return respuesta;
    }

    @PutMapping("eliminar-avance/{idAvance}")
    public RespuestaGenerica eliminarAvance(@PathVariable int idAvance) {
        Log.debug("Iniciando eliminarAvance");

        avanceProgmaticoService.eliminarAvance(idAvance);
        var respuesta = new RespuestaGenerica("200", "Exitoso");

        Log.debug("Terminando eliminarAvance");

        return respuesta;
    }

    @PostMapping("registrarEntregables")
    @Consumes(MediaType.APPLICATION_JSON)
    public MensajePersonalizado<AvanceProgmatico> consultarRegistrarEntregables(@RequestBody AvanceProgmatico avanceProgmatico) {
        Log.debug("Iniciando consultarRegistrarEntregables");

        var avance  = avanceProgmaticoService.registrarEntregables(avanceProgmatico);
        var respuesta = new MensajePersonalizado<>("200", "Exitoso", avance);

        Log.debug("Terminando consultarRegistrarEntregables");

        return respuesta;
    }
    @GetMapping("consultar-avance/{idProducto}")
    public MensajePersonalizado<AvanceProgmatico> consultarAvance(@PathVariable int idProducto){
        MensajePersonalizado<AvanceProgmatico> mensaje = new MensajePersonalizado<AvanceProgmatico>();
        mensaje.setCodigo("200");
        mensaje.setMensaje("Se registro Correctamente");
        AvanceProgmatico respuesta = avanceProgmaticoService.consultarEntregables(idProducto);
        mensaje.setRespuesta(respuesta);
        return mensaje;
    }
    @PostMapping("registroEvidenciaTrimestral/{cveUsuario}")
    @Consumes(MediaType.APPLICATION_JSON)
    public MensajePersonalizado<RespuestaEvidenciaTrimestralVO> registroEvidencia(@RequestBody RegistroEvidenciaTrimestralVO evidenciaTrimestral, @PathVariable String cveUsuario) {
        Log.debug("Iniciando registroEvidenciaTrimestral");

        var evidencia = avanceProgmaticoService.registrarEvidenciaTrimestral(evidenciaTrimestral, cveUsuario);
        var mensaje = new MensajePersonalizado<>("200", "Exitoso", evidencia);

        Log.debug("Terminando registroEvidenciaTrimestral");

        return mensaje;
    }

    @PostMapping("registroEvidenciaMensual/{cveUsuario}")
    @Consumes(MediaType.APPLICATION_JSON)
    public MensajePersonalizado<RespuestaEvidenciaMensualVO> registroEvidenciaMensual(@RequestBody RegistroEvidenciaMensualVO evidenciaMensualVO, @PathVariable String cveUsuario) {
        Log.debug("Iniciando registroEvidenciaMensual");

        var evidencia = avanceProgmaticoService.registrarEvidenciasMensual(evidenciaMensualVO, cveUsuario);
        var mensaje = new MensajePersonalizado<>("200", "Exitoso", evidencia);

        Log.debug("Terminando registroEvidenciaMensual");

        return mensaje;
    }

    @GetMapping("consultarEvidenciaTrimestral/{idProducto}/{trimestre}")
    @Consumes(MediaType.APPLICATION_JSON)
    public MensajePersonalizado<EvidenciaTrimestralVO> consultarEvidencia(@PathVariable int idProducto, @PathVariable int trimestre) {
        Log.debug("Iniciando consultarEvidenciaTrimestral");

        var evidenciaTrimestral = avanceProgmaticoService.consultarEvidenciaTrimestral(idProducto, trimestre);
        var respuesta = new MensajePersonalizado<>("200", "Exitoso", evidenciaTrimestral);

        Log.debug("Terminando consultarEvidenciaTrimestral");
        return respuesta;
    }

    @GetMapping("consultarEvidenciaTrimestral/{idAvance}")
    @Consumes(MediaType.APPLICATION_JSON)
    public MensajePersonalizado<EvidenciaTrimestralVO> consultarEvidencia(@PathVariable int idAvance) {
        Log.debug("Iniciando consultarEvidenciaTrimestral");

        var evidenciaTrimestral = avanceProgmaticoService.consultarEvidenciaTrimestral(idAvance);
        var respuesta = new MensajePersonalizado<>("200", "Exitoso", evidenciaTrimestral);

        Log.debug("Terminando consultarEvidenciaTrimestral");
        return respuesta;
    }


    @GetMapping("consultarEvidenciaMensual/{idProducto}/{mes}")
    @Consumes(MediaType.APPLICATION_JSON)
    public MensajePersonalizado<EvidenciaMensualVO> consultarEvidenciaMensual(@PathVariable int idProducto, @PathVariable int mes) {
        var evidencia = avanceProgmaticoService.consultarEvidenciaMensual(idProducto, mes);
        var respuesta = new MensajePersonalizado<>("200", "Exitoso", evidencia);

        Log.debug("Terminando consultarEvidenciaMensual");
        return respuesta;
    }

    @GetMapping("consultarEvidenciaMensual/{idAvance}")
    @Consumes(MediaType.APPLICATION_JSON)
    public MensajePersonalizado<EvidenciaMensualVO> consultarEvidenciaMensual(@PathVariable int idAvance) {
        var evidencia = avanceProgmaticoService.consultarEvidenciaMensual(idAvance);
        var respuesta = new MensajePersonalizado<>("200", "Exitoso", evidencia);

        Log.debug("Terminando consultarEvidenciaMensual");
        return respuesta;
    }

    @PostMapping("registrarMetasVencidasAdelantadas/{cveUsuario}")
    @Consumes(MediaType.APPLICATION_JSON)
    public MensajePersonalizado<RespuestaMetasVencidasAdelantadasVO> registrarMetasVencidasAdelantadas(@RequestBody PeticionRegistroMetasExtraordinarias metasVencidas, @PathVariable String cveUsuario) {
        var respuesta = avanceProgmaticoService.registrarMetasVencidas(metasVencidas, cveUsuario);
      return new MensajePersonalizado<>("200", "Exitoso", respuesta);
    }
}
