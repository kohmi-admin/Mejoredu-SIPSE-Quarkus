package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.sep.dgtic.mejoredu.cortoplazo.RubricaDTO;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValidacionDTO {
	private String apartado;
	private Integer id;
	private String estatus;
	ArrayList<Revision> revision = new ArrayList<Revision>();
	private String cveUsuario;
	ArrayList<ArchivoDTO> archivos = new ArrayList<ArchivoDTO>();
	ArrayList<RubricaDTO> rubrica = new ArrayList<RubricaDTO>();
}
