package mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos;

import lombok.Data;

import java.util.List;

@Data
public class RespuestaCatalogo {
  private Mensaje mensaje;
  private List<MasterCatalogoDTO2> catalogo;

  public RespuestaCatalogo(String pCodigo, String pMensaje){
    super();
    this.mensaje = new Mensaje();
    this.mensaje.setCodigo(pCodigo);
    this.mensaje.setMensaje(pMensaje);

  }
}
