package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstrategiaAcciones {
	private int idEstaci;
    private int ixTipo;
    private MasterCatalogoDTO masterCatalogo;
}
