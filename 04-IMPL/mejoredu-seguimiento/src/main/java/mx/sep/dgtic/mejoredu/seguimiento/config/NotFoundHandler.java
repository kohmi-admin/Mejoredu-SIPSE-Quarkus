package mx.sep.dgtic.mejoredu.seguimiento.config;

import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaError;

import java.time.LocalDateTime;

@Provider
public class NotFoundHandler implements ExceptionMapper<NotFoundException> {
  public Response toResponse(NotFoundException e) {
    e.printStackTrace();
    var respuesta = new RespuestaError();
    respuesta.setEstatus("404");
    respuesta.setMensaje(e.getMessage());
    respuesta.setFecha(LocalDateTime.now());
    return Response.status(Response.Status.NOT_FOUND).entity(respuesta).build();
  }
}