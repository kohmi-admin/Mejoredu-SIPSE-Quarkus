package mx.sep.dgtic.mejoredu.cortoplazo.config;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaError;

@Provider
public class ServerErrorHandler implements ExceptionMapper<Throwable> {
  public Response toResponse(Throwable e) {
    e.printStackTrace();
    var respuesta = new RespuestaError();
    respuesta.setEstatus("500");
    respuesta.setMensaje(e.getMessage());
    respuesta.setFecha(java.time.LocalDateTime.now());
    return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
  }
}
