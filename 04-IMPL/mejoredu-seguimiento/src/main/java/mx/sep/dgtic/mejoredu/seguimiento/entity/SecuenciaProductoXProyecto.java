package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Version;
import lombok.Data;

@Data
@Entity(name = "vt_secuencia_producto_proyecto")
public class SecuenciaProductoXProyecto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_secuencia", unique = true, nullable = false, precision = 10)
	private Integer idSecuencia;
	@ManyToOne
	@JoinColumn(name = "id_unidad_admiva")
	private MasterCatalogo unidadAdmiva;
	
	@Column(name = "id_proyecto", precision = 10)
	private Integer idProyecto;
	
	@Column(name = "ix_secuencia", precision = 10)
	private Integer ixSecuencia;
	
	@Version
	@Column(name = "LOCK_FLAG")
	private Integer lockFlag;

}
