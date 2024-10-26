package mx.edu.sep.dgtic.mejoredu.notificador.controllers;

import io.quarkus.logging.Log;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.notificador.MailVO;
import mx.edu.sep.dgtic.mejoredu.notificador.services.GestorNotificadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/notificador")
public class GestorNotificadorController {

    private final GestorNotificadorService gestorNotificadorService;

    @Autowired
    public GestorNotificadorController(GestorNotificadorService gestorNotificadorService) {
        this.gestorNotificadorService = gestorNotificadorService;
    }

    @PostMapping("/cuentas")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public RespuestaGenerica cuentas(MailVO correoVO) {
        Log.info("Entrando al servicio de envio de correo");
        var respuesta = new RespuestaGenerica("200", "Exitoso");
        try {
            gestorNotificadorService.enviandoCuentasDeCorreo(correoVO.getCorreos(), correoVO.getAsunto(), correoVO.getCuerpo());

        } catch (Exception e) {
            respuesta = new RespuestaGenerica("400", e.getMessage());
        }
        return respuesta;
    }


}
