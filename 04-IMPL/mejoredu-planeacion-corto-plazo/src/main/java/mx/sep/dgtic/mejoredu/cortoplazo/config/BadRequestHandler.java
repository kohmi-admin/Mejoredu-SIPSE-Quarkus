package mx.sep.dgtic.mejoredu.cortoplazo.config;

import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaError;

import java.time.LocalDateTime;

@Provider
public class BadRequestHandler implements ExceptionMapper<BadRequestException> {
  public Response toResponse(BadRequestException e) {
    e.printStackTrace();
    var respuesta = new RespuestaError();
    respuesta.setEstatus("400");
    respuesta.setMensaje(e.getMessage());
    respuesta.setFecha(LocalDateTime.now());
    return Response.status(Response.Status.BAD_REQUEST).entity(respuesta).build();
  }
}
