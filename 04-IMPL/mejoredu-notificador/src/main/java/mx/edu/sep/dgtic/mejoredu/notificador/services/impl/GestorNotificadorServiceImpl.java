package mx.edu.sep.dgtic.mejoredu.notificador.services.impl;

import io.quarkus.logging.Log;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.quarkus.qute.Template;
import io.smallrye.common.annotation.Blocking;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.notificador.services.GestorNotificadorService;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;


@ApplicationScoped
public class GestorNotificadorServiceImpl implements GestorNotificadorService {
    private final Mailer enviar;
    private final Template notificacion;

    @Autowired
    public GestorNotificadorServiceImpl(Mailer enviar, Template notificacion) {
        this.enviar = enviar;
        this.notificacion = notificacion;
    }


    @Blocking
    public void enviandoCuentasDeCorreo(List<String> correos, String asunto, String cuerpo) {
        var correos2 = new ArrayList<Mail>();
        String nombre = "Podría extraerse de la tabla seg_persona mediante el correo";
        Log.info("Con fines de desarrollo " + nombre);
        String quienEnvia = "SIPSE";
        if (ObjectUtils.isEmpty(correos)) {
            throw new BadRequestException("El campo correos no debe estar vacio  ");
        }
        if (ObjectUtils.isEmpty(asunto) || asunto.equals("")) {
            throw new BadRequestException("El campo asunto no debe estar vacio  ");
        }
        if (ObjectUtils.isEmpty(cuerpo) || cuerpo.equals("")) {
            throw new BadRequestException("El campo cuerpo no debe estar vacio  ");
        }
        String templateUno = notificacion(null, quienEnvia, asunto, cuerpo);
        correos.stream().map(correo -> {
            EmailValidator validator = EmailValidator.getInstance();
            Mail mail = null;
            if (validator.isValid(correo)) {
                mail = Mail.withHtml(correo, asunto, templateUno);
                enviar.send(mail);
            } else {
                throw new BadRequestException("Este correo no es válido  " + correo + " , favor de verificar");
            }
            return mail;
        }).toList().forEach(correos2::add);

        Log.info("Fin del servicio de notificación");

    }

    @Produces(MediaType.TEXT_PLAIN)
    public String notificacion(String name, String quienEnvia, String asunto, String cuerpo) {
        return notificacion.data("name", name).data("mejorEdu", quienEnvia).data("asunto", asunto).data("cuerpo", cuerpo).render();
    }
}
