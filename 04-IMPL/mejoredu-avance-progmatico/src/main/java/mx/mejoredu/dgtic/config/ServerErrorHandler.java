package mx.mejoredu.dgtic.config;

import io.quarkus.logging.Log;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaError;

@Provider
public class ServerErrorHandler implements ExceptionMapper<Exception> {
  public Response toResponse(Exception e) {
    Log.error("Error en ServerErrorHandler: ", e);

    var respuesta = new RespuestaError();
    respuesta.setEstatus("500");
    respuesta.setMensaje(e.getMessage());
    respuesta.setFecha(java.time.LocalDateTime.now());
    return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
  }
}