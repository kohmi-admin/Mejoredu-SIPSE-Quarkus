package mx.edu.sep.dgtic.mejoredu.seguridad.config;

import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaError;

import java.time.LocalDateTime;

@Provider
public class ForbiddenHandler implements ExceptionMapper<ForbiddenException> {

  @Override
  public Response toResponse(ForbiddenException exception) {
    var response = new RespuestaError();
    response.setEstatus("403");
    response.setMensaje(exception.getMessage());
    response.setFecha(LocalDateTime.now());
    return Response.status(Response.Status.FORBIDDEN).entity(response).build();
  }
}
