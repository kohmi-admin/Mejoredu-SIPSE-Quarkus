package mx.edu.sep.dgtic.mejoredu.catalogos.dtos;

import lombok.Data;

import java.time.LocalDate;
@Data
public class PeticionCatalogo {
    private String cdOpcion;
    private String cveUsuario;
    private String ccExterna;
    private String ccExternaDos;
    private String cdDescripcion;
    private Integer idCatalogoPadre;
    private String cdDescripcionDos;
    private Integer ixDependencia;
    private LocalDate dfBaja;
}
