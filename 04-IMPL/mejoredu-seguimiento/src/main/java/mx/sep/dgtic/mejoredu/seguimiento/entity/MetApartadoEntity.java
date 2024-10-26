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
@Table(name = "met_apartado")
public class MetApartadoEntity implements Serializable {

	private static final long serialVersionUID = 1409073356846150177L;
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_apartado", nullable = false)
	private int idApartado;
	@Basic
	@Column(name = "cx_nombre", nullable = true, length = 100)
	private String cxNombre;

}
