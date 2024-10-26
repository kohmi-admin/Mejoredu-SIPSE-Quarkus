package mx.sep.dgtic.mejoredu.cortoplazo;

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
