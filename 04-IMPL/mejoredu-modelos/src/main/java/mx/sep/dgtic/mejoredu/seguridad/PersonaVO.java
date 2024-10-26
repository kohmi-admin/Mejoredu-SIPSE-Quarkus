package mx.sep.dgtic.mejoredu.seguridad;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonaVO {
	
	private Integer idPersona;
	private String cxNombre;
	private String cxPrimerApellido;
	private String cxSegundoApellido;
	private String cxCorreo;
	private LocalDate dfNacimiento;
	
}
