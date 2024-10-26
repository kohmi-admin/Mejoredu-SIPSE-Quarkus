package mx.edu.sep.dgtic.mejoredu.catalogos.dtos;

import java.util.List;

import lombok.Data;

@Data
public class RespuestaCatalogo {
    private Mensaje mensaje;
    private List<MasterCatalogoDto> catalogo;

    public RespuestaCatalogo(String pCodigo, String pMensaje){
        super();
        this.mensaje = new Mensaje();
        this.mensaje.setCodigo(pCodigo);
        this.mensaje.setMensaje(pMensaje);
        
    }
}
