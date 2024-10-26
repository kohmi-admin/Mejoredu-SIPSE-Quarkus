package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity(name = "met_rubrica")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class Rubrica implements Serializable {
	private static final long serialVersionUID = 317093608895788840L;

	protected static final String PK = "idRubrica";

	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id_rubrica", unique = true, nullable = false)
	private Integer idRubrica;
	@Column(name = "cd_rubrica", nullable = true)
	private String cdRubrica;
	@Column(name = "cd_estatus", nullable = true)
	private String cdEstatus;
	

}
