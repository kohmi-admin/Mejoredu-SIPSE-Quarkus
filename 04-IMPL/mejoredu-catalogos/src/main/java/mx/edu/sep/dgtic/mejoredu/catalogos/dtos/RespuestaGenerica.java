package mx.edu.sep.dgtic.mejoredu.catalogos.dtos;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

import java.io.Serializable;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class RespuestaGenerica implements Serializable {
    private static final long serialVersionUID= 0L;
    private Mensaje mensaje;

    public RespuestaGenerica(String pCodigo, String pMensaje){
        super();
        this.mensaje = new Mensaje();
        this.mensaje.setCodigo(pCodigo);
        this.mensaje.setMensaje(pMensaje);
        
    }
}
