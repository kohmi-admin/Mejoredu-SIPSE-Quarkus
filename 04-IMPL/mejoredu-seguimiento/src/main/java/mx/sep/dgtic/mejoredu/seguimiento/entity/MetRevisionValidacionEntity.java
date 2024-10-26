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
@Table(name = "met_revision_validacion")
public class MetRevisionValidacionEntity implements Serializable {

	private static final long serialVersionUID = 4144773801347929411L;
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_revision", nullable = false)
	private Integer idRevision;
	@Basic
	@Column(name = "id_elemento_validar", nullable = true)
	private Integer idElementoValidar;
	@Basic
	@Column(name = "id_validacion", nullable = true)
	private Integer idValidacion;
	@Basic
	@Column(name = "cx_comentario", nullable = true, length = 500)
	private String cxComentario;
	@Basic
	@Column(name = "ix_check", nullable = true)
	private Integer ixCheck;

}
