package mx.sep.dgtic.mejoredu.cortoplazo;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@RegisterForReflection
public class VTProyectoApartadoEstatusDTO {
	
	private Integer idSecuencia;
	private Integer idProyecto;
	private Integer id;
	private Integer idValidacion;
	private String apartado;
	private String csEstatus;

}
