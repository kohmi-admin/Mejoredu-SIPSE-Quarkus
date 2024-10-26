package mx.edu.sep.dgtic.mejoredu.reportes;

import java.util.List;

import lombok.Data;

@Data
public class PeticionPAAA {

	private Integer idAnhio;
	private String cveUsuario;
	private List<String> dataReporte;
	
}
