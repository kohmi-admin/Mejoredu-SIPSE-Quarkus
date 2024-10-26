package mx.edu.sep.dgtic.mejoredu.catalogos.dtos;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PeticionCatalogoDireccion {
    private String cdOpcion;
    private String cveUsuario;
    private String ccExterna;
    private String ccExternaDos;
}
