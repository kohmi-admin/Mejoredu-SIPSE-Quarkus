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
@Table(name = "met_elemento_validar")
public class MetElementoValidarEntity implements Serializable {

	private static final long serialVersionUID = 4390738304162145702L;
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_elemento", nullable = false)
	private int idElemento;
	@Basic
	@Column(name = "cx_nombre", nullable = true, length = 200)
	private String cxNombre;
	@Basic
	@Column(name = "id_apartado", nullable = false)
	private int idApartado;

}
