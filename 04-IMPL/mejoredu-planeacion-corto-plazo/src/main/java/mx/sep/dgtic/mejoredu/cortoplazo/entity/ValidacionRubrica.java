package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity(name = "met_validacion_rubrica")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class ValidacionRubrica implements Serializable {
	
	private static final long serialVersionUID = 317093608895788840L;

	protected static final String PK = "idValidacionRubrica";

	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id_validacion_rubrica", unique = true, nullable = false)
	private Integer idValidacionRubrica;
	
	
	@Column(name = "df_registro", nullable = true)
	private LocalDate df_registro;
	@Column(name = "cx_observaciones", nullable = true)
	private String cx_observaciones;
	@Column(name = "ix_puntuacion", nullable = true)
	private Integer ix_puntuacion;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_rubrica", nullable = true)
	private Rubrica rubrica;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_validacion", nullable = true)
	private MetValidacionEntity validacion;
	
	

}
