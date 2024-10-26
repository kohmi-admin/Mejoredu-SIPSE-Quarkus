package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity(name = "vt_proyecto_apartado_estatus")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class VTProyectoApartadoEstatus {

	@Id
	@Column(name = "id_secuencia", unique = true, nullable = false)
	private Integer idSecuencia;
	@Column(name = "id_proyecto", nullable = true)
	private Integer idProyecto;
	@Column(name = "id", nullable = true)
	private Integer id;
	@Column(name = "id_validacion_supervisor", nullable = true)
	private Integer idValidacion;
	@Column(name = "apartado", nullable = true)
	private String apartado;
	@Column(name = "cs_estatus", nullable = true)
	private String csEstatus;

}
