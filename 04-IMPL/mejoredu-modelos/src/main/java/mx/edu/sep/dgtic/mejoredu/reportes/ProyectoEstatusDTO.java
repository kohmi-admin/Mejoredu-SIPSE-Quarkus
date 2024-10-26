package mx.edu.sep.dgtic.mejoredu.reportes;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RegisterForReflection
public class ProyectoEstatusDTO {
	
	private String nombreEstatus;
	private Integer porcentaje;

}
