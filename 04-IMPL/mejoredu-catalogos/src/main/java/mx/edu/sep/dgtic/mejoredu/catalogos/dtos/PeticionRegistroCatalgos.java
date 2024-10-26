package mx.edu.sep.dgtic.mejoredu.catalogos.dtos;

import lombok.Data;

@Data
public class PeticionRegistroCatalgos {
    private String cdOpcion;
    private String cveUsuario;
    private Integer idCatalogoPadre;
    private String ccExterna;
    private String csDescripcion;

}
