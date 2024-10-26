package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.io.Serializable;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "met_archivo_validacion")
public class MetArchivoValidacionEntity implements Serializable {

	private static final long serialVersionUID = 2609024032022914475L;
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_archivo_validacion", nullable = false)
	private Integer idArchivoValidacion;
	@Basic
	@Column(name = "id_validacion", nullable = false)
	private Integer idValidacion;
	@Basic
	@Column(name = "id_archivo", nullable = false)
	private Integer idArchivo;

}
