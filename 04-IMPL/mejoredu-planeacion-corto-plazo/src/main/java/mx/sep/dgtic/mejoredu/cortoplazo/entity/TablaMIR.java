package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name="vt_tabla_mir")
public class TablaMIR {
	
	@Id
	private Integer id;
	private Integer idAnhio;
	private Integer idCatalogoUnidad;
	private Integer idCatalogoIndicador;
	private String nombreIndicador;
	private String nivel;
	private String tipo;
	private Integer entregables;
	
}
