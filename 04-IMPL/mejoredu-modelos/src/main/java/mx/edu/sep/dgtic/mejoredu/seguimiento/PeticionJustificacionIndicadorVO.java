package mx.edu.sep.dgtic.mejoredu.seguimiento;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionJustificacionIndicadorVO {
	private Integer idIndicador;
	private String indicador;
	private Double avance;
	private List<ArchivoBase> archivos = new ArrayList<>();
	private String causa;
	private String efecto;
	private String otrosMotivos;
	private String cveUsuario;
}
